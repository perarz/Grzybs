const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function load(filename, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    Date,
    Intl,
    AbortController,
    URLSearchParams,
    setTimeout,
    clearTimeout,
    ...globals,
    require: (name) => load(path.resolve(path.dirname(filename), `${name}.ts`), globals),
  });
  return exports;
}
const point = { latitude: 12.345678, longitude: 34.567891 };
const fetchedAt = Date.parse('2026-11-06T12:00:00Z');
const { parseResponse, parseForecast } = load('src/features/weather/validation.ts');
const { getWeatherPoint, weatherKey, isForecastStale } = load('src/features/weather/forecast.ts');
const { readWeatherCache, writeWeatherCache } = load('src/features/weather/cache.ts');
function payload() {
  return {
    latitude: 12.38,
    longitude: 34.59,
    timezone: 'Europe/Warsaw',
    utc_offset_seconds: 3600,
    hourly_units: {
      time: 'iso8601',
      temperature_2m: '°C',
      precipitation: 'mm',
      wind_speed_10m: 'km/h',
    },
    hourly: {
      time: Array.from({ length: 72 }, (_, i) =>
        new Date(Date.parse('2026-11-06T00:00Z') + i * 3600000).toISOString().slice(0, 16),
      ),
      temperature_2m: Array.from({ length: 72 }, (_, i) => i),
      precipitation: Array(72).fill(0),
      wind_speed_10m: Array(72).fill(null),
    },
    daily_units: {
      time: 'iso8601',
      temperature_2m_min: '°C',
      temperature_2m_max: '°C',
      precipitation_sum: 'mm',
      precipitation_probability_max: '%',
      wind_speed_10m_max: 'km/h',
      weather_code: 'wmo code',
    },
    daily: {
      time: ['2026-11-06', '2026-11-07', '2026-11-08'],
      temperature_2m_min: [null, -3, 0],
      temperature_2m_max: [12, 7, 8],
      precipitation_sum: [null, 0, 2.4],
      precipitation_probability_max: [null, 0, 70],
      wind_speed_10m_max: [null, 12, 30],
      weather_code: [null, 0, 61],
    },
  };
}
function forecast() {
  return parseResponse(payload(), point, fetchedAt);
}
function database(t) {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  const { MIGRATIONS } = load('src/db/migrations.ts');
  for (const migration of MIGRATIONS) sqlite.exec(migration);
  const db = {
    getFirstAsync: async (sql, ...params) => sqlite.prepare(sql).get(...params) ?? null,
    runAsync: async (sql, ...params) => sqlite.prepare(sql).run(...params),
    withTransactionAsync: async (action) => {
      sqlite.exec('BEGIN');
      try {
        await action();
        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };
  return { sqlite, db };
}

test('coordinates are coarsened consistently before cache and network use', () => {
  const rounded = getWeatherPoint(point);
  assert.equal(rounded.latitude, 12.35);
  assert.equal(rounded.longitude, 34.57);
  assert.equal(weatherKey(point), weatherKey(rounded));
  assert.equal(weatherKey({ latitude: -0.001, longitude: 180 }), '0.00,180.00');
  assert.throws(() => getWeatherPoint({ latitude: 91, longitude: 0 }));
  assert.throws(() => getWeatherPoint({ latitude: 0, longitude: Infinity }));
});
test('response preserves provider date and missing metrics; provider grid center is not cache location', () => {
  const result = forecast();
  assert.equal(result.point.latitude, 12.35);
  assert.equal(result.point.longitude, 34.57);
  assert.equal(result.days[0].date, '2026-11-06');
  assert.equal(result.days[0].minTemp, null);
  assert.equal(result.days[0].precipitation, null);
  assert.equal(result.days[1].precipitation, 0);
  assert.equal(result.days[1].code, 0);
});
test('invalid required arrays, units, timezone, date or metric values are rejected', () => {
  const mutate = [
    (p) => {
      delete p.daily.temperature_2m_min;
    },
    (p) => {
      p.daily.wind_speed_10m_max.pop();
    },
    (p) => {
      p.daily.temperature_2m_max[0] = '12';
    },
    (p) => {
      p.daily.precipitation_sum[0] = -1;
    },
    (p) => {
      p.daily.precipitation_probability_max[0] = 101;
    },
    (p) => {
      p.daily.weather_code[0] = 1.5;
    },
    (p) => {
      p.daily.time[1] = '2026-02-30';
    },
    (p) => {
      p.daily.time[1] = p.daily.time[0];
    },
    (p) => {
      p.daily_units.temperature_2m_max = '°F';
    },
    (p) => {
      p.daily_units.wind_speed_10m_max = 'm/s';
    },
    (p) => {
      p.timezone = 'Invalid/Nowhere';
    },
    (p) => {
      p.utc_offset_seconds = null;
    },
  ];
  for (const change of mutate) {
    const p = payload();
    change(p);
    assert.throws(() => parseResponse(p, point, fetchedAt));
  }
});
test('freshness expires after six hours or provider-local midnight, not device UTC midnight', () => {
  const value = forecast();
  assert.equal(isForecastStale(value, fetchedAt + 5 * 3600000), false);
  assert.equal(isForecastStale(value, fetchedAt + 6 * 3600000), true);
  const late = { ...value, fetchedAt: Date.parse('2026-11-06T22:30:00Z') };
  assert.equal(isForecastStale(late, Date.parse('2026-11-06T22:59:00Z')), false);
  assert.equal(isForecastStale(late, Date.parse('2026-11-06T23:00:00Z')), true);
  assert.equal(isForecastStale(value, fetchedAt - 1), true);
});
test('cache reads the same rounded cell and never returns data for a different point', async (t) => {
  const { sqlite, db } = database(t);
  await writeWeatherCache(db, forecast());
  assert.equal((await readWeatherCache(db, point)).days[1].precipitation, 0);
  assert.equal(await readWeatherCache(db, { latitude: 0, longitude: 0 }), null);
  const wrong = { ...forecast(), point: { latitude: 0, longitude: 0 } };
  sqlite.prepare('UPDATE weather_cache SET payload = ?').run(JSON.stringify(wrong));
  assert.equal(await readWeatherCache(db, point), null);
});
test('corrupt JSON, mismatched timestamps and precise coordinates are rejected from cache', async (t) => {
  const { sqlite, db } = database(t);
  await writeWeatherCache(db, forecast());
  sqlite.prepare('UPDATE weather_cache SET payload = ?').run('{');
  assert.equal(await readWeatherCache(db, point), null);
  await writeWeatherCache(db, forecast());
  sqlite.exec('UPDATE weather_cache SET fetched_at = 1');
  assert.equal(await readWeatherCache(db, point), null);
  assert.throws(() => parseForecast({ ...forecast(), point }));
});
test('cache retains at most the ten newest locations and ignores older writes', async (t) => {
  const { sqlite, db } = database(t);
  for (let i = 0; i < 12; i++)
    await writeWeatherCache(db, {
      ...forecast(),
      point: { latitude: i, longitude: 0 },
      fetchedAt: fetchedAt + i,
    });
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM weather_cache').get().n, 10);
  assert.equal(await readWeatherCache(db, { latitude: 0, longitude: 0 }), null);
  await writeWeatherCache(db, {
    ...forecast(),
    point: { latitude: 11, longitude: 0 },
    fetchedAt: fetchedAt - 1,
  });
  assert.equal(
    (await readWeatherCache(db, { latitude: 11, longitude: 0 })).fetchedAt,
    fetchedAt + 11,
  );
});
function network(fetch) {
  let timer;
  let cleared = 0;
  const { fetchForecast } = load('src/features/weather/forecast.ts', {
    fetch,
    setTimeout: (callback) => {
      timer = callback;
      return 1;
    },
    clearTimeout: () => {
      cleared++;
    },
  });
  return { fetchForecast, timeout: () => timer(), cleared: () => cleared };
}
test('fetch sends only rounded coordinates and explicit requested units/days', async () => {
  let url;
  const context = network(async (input) => {
    url = new URL(input);
    return { ok: true, json: async () => payload() };
  });
  const result = await context.fetchForecast(point);
  assert.equal(url.searchParams.get('latitude'), '12.35');
  assert.equal(url.searchParams.get('longitude'), '34.57');
  assert.equal(url.searchParams.get('forecast_days'), '3');
  assert.equal(url.searchParams.get('hourly'), 'temperature_2m,precipitation,wind_speed_10m');
  assert.equal(url.searchParams.get('temperature_unit'), 'celsius');
  assert.equal(url.searchParams.get('wind_speed_unit'), 'kmh');
  assert.equal(url.searchParams.get('precipitation_unit'), 'mm');
  assert.equal(url.searchParams.get('timezone'), 'auto');
  assert.equal(result.days.length, 3);
  assert.equal(context.cleared(), 1);
});
test('HTTP and network failures produce errors and always clear request timers', async () => {
  for (const fetch of [
    async () => ({ ok: false, status: 429 }),
    async () => {
      throw new TypeError('offline');
    },
  ]) {
    const context = network(fetch);
    await assert.rejects(context.fetchForecast(point));
    assert.equal(context.cleared(), 1);
  }
});
test('aborting returns AbortError even if fetch ignores cancellation', async () => {
  const request = new AbortController();
  let listenerCount = 0;
  const add = request.signal.addEventListener.bind(request.signal);
  const remove = request.signal.removeEventListener.bind(request.signal);
  request.signal.addEventListener = (...args) => {
    listenerCount++;
    add(...args);
  };
  request.signal.removeEventListener = (...args) => {
    listenerCount--;
    remove(...args);
  };
  const context = network(() => new Promise(() => {}));
  const pending = context.fetchForecast(point, request.signal);
  request.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(listenerCount, 0);
  assert.equal(context.cleared(), 1);
});
test('12-second timeout also covers a stalled JSON body', async () => {
  let signal;
  const context = network(async (_, options) => {
    signal = options.signal;
    return { ok: true, json: () => new Promise(() => {}) };
  });
  const pending = context.fetchForecast(point);
  await Promise.resolve();
  context.timeout();
  await assert.rejects(pending, { name: 'TimeoutError' });
  assert.equal(signal.aborted, true);
  assert.equal(context.cleared(), 1);
});
test('pre-aborted requests never transmit coordinates', async () => {
  const request = new AbortController();
  request.abort();
  let calls = 0;
  const context = network(async () => {
    calls++;
  });
  await assert.rejects(context.fetchForecast(point, request.signal), { name: 'AbortError' });
  assert.equal(calls, 0);
});

const { weatherPeriods } = load('src/features/weather/periods.ts');
test('three weather periods select actual hours at the location across midnight', () => {
  const rows = weatherPeriods(forecast(), Date.parse('2026-11-06T22:45:00Z'));
  assert.deepEqual(
    Array.from(rows, (row) => row.temperature),
    [23, 25, 36],
  );
  assert.equal(rows[2].label, 'Jutro 12:00');
  assert.equal(rows[0].precipitation, 0);
  assert.equal(rows[0].wind, null);
});
test('tomorrow noon follows real Warsaw time when the cached provider offset crosses DST', () => {
  const p = payload();
  p.utc_offset_seconds = 7200;
  p.daily.time = ['2026-10-24', '2026-10-25', '2026-10-26'];
  p.hourly.time = p.hourly.time.map((_, i) =>
    new Date(Date.parse('2026-10-24T00:00Z') + i * 3600000).toISOString().slice(0, 16),
  );
  const rows = weatherPeriods(parseResponse(p, point, fetchedAt), Date.parse('2026-10-24T20:50Z'));
  assert.deepEqual(
    Array.from(rows, (row) => row.temperature),
    [22, 24, 37],
  );
});
test('legacy daily cache remains readable, requests a refresh and never invents hourly readings', async (t) => {
  const legacy = forecast();
  delete legacy.hours;
  const { db } = database(t);
  await writeWeatherCache(db, legacy);
  const saved = await readWeatherCache(db, point);
  assert.equal(saved.days.length, 3);
  assert.equal(isForecastStale(saved, fetchedAt), true);
  for (const row of weatherPeriods(saved, fetchedAt)) assert.equal(row.temperature, null);
  for (const row of weatherPeriods(forecast(), fetchedAt + 7 * 86400000))
    assert.equal(row.temperature, null);
});
test('malformed hourly series and mixed units are rejected', () => {
  for (const change of [
    (p) => delete p.hourly,
    (p) => {
      p.hourly_units.precipitation = 'inch';
    },
    (p) => p.hourly.time.pop(),
    (p) => {
      p.hourly.time[30] = p.hourly.time[29];
    },
    (p) => {
      p.hourly.precipitation[0] = -1;
    },
  ]) {
    const data = payload();
    change(data);
    assert.throws(() => parseResponse(data, point, fetchedAt));
  }
});

test('index uses only the seven completed days and survives a cache round trip', async (t) => {
  const { mushroomIndex } = load('src/features/weather/mushroomIndex.ts');
  const p = payload();
  const before = Array.from({ length: 7 }, (_, i) =>
    new Date(Date.UTC(2026, 9, 30 + i)).toISOString().slice(0, 10),
  );
  for (const [key, future] of Object.entries(p.daily)) {
    const historical =
      key === 'time'
        ? before
        : Array(7).fill(key === 'precipitation_sum' ? 4 : key.startsWith('temperature') ? 14 : 0);
    p.daily[key] = [...historical, ...future];
  }
  for (const [key, future] of Object.entries(p.hourly)) {
    const past = Array.from({ length: 168 }, (_, i) =>
      key === 'time' ? new Date(Date.UTC(2026, 9, 30, i)).toISOString().slice(0, 16) : null,
    );
    p.hourly[key] = [...past, ...future];
  }
  const value = parseResponse(p, point, fetchedAt);
  assert.equal(value.days[0].date, '2026-11-06');
  assert.equal(value.hours.length, 72);
  const { db } = database(t);
  await writeWeatherCache(db, value);
  const saved = await readWeatherCache(db, point);
  assert.equal(mushroomIndex(saved, fetchedAt, 1).score, 10);
  assert.equal(mushroomIndex(saved, fetchedAt, 1).rain, 28);
  assert.equal(mushroomIndex(saved, fetchedAt + 86400000, 1), null);
  saved.history.forEach((day) => (day.precipitation = 0));
  assert.ok(mushroomIndex(saved, fetchedAt, 1).score <= 3);
  saved.history[2].precipitation = null;
  assert.equal(mushroomIndex(saved, fetchedAt, 1), null);
  assert.equal(mushroomIndex(forecast(), fetchedAt, 1), null);
});
