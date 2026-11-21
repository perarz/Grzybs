const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const { createHookHost } = require('./helpers/weatherHookHost.cjs');
const flush = () => new Promise((resolve) => setImmediate(resolve));
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function setup(t, overrides = {}) {
  const host = createHookHost();
  t.after(() => host.unmount());
  let point = { latitude: 50.061, longitude: 19.941 };
  const calls = { reads: 0, fetches: 0, writes: 0, lastSignal: null };
  const api = {
    getWeatherPoint: (p) => ({
      latitude: Math.round(p.latitude * 100) / 100,
      longitude: Math.round(p.longitude * 100) / 100,
    }),
    weatherKey: (p) => `${p.latitude},${p.longitude}`,
    isForecastStale: overrides.stale ?? (() => false),
    readWeatherCache: async (...args) => {
      calls.reads++;
      return overrides.read ? overrides.read(...args) : null;
    },
    fetchForecast: async (target, signal) => {
      calls.fetches++;
      calls.lastSignal = signal;
      return overrides.fetch ? overrides.fetch(target, signal) : { point: target, days: [] };
    },
    writeWeatherCache: async (...args) => {
      calls.writes++;
      if (overrides.write) await overrides.write(...args);
    },
  };
  const exports = {};
  const db = {};
  const dependencies = {
    react: host.react,
    'expo-sqlite': { useSQLiteContext: () => db },
    'react-native': { AppState: { addEventListener: () => ({ remove() {} }) } },
    '@/features/navigation/geo': {
      isCoordinate: (p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude),
    },
    './weather': api,
  };
  vm.runInNewContext(
    ts.transpileModule(readFileSync('src/features/weather/useWeatherForecast.ts', 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    {
      exports,
      require: (name) => dependencies[name],
      AbortController,
      setInterval: () => 1,
      clearInterval() {},
    },
  );
  return {
    host,
    calls,
    render: () =>
      host.render(() => exports.useWeatherForecast(point, overrides.automatic ?? false)),
    move: (p) => {
      point = p;
    },
  };
}

test('opening weather reads local cache without transmitting a location', async (t) => {
  const cached = { point: { latitude: 50.06, longitude: 19.94 }, days: [] };
  const context = setup(t, { read: async () => cached });
  assert.equal(context.render().loadingCache, true);
  await flush();
  assert.equal(context.render().forecast, cached);
  assert.equal(context.calls.fetches, 0);
});

test('manual refresh locks double taps and retains forecast if cache write fails', async (t) => {
  const fetch = deferred();
  const context = setup(t, {
    fetch: () => fetch.promise,
    write: async () => {
      throw new Error('disk full');
    },
  });
  context.render();
  await flush();
  const ready = context.render();
  const pending = ready.refresh();
  await ready.refresh();
  assert.equal(context.calls.fetches, 1);
  fetch.resolve({ point: { latitude: 50.06, longitude: 19.94 }, days: [] });
  await pending;
  const result = context.render();
  assert.ok(result.forecast);
  assert.ok(result.cacheWarning);
  assert.equal(result.error, null);
  assert.equal(result.refreshing, false);
});

test('failed refresh preserves the saved forecast', async (t) => {
  const cached = { days: [] };
  const context = setup(t, {
    read: async () => cached,
    fetch: async () => {
      throw new Error('offline');
    },
  });
  context.render();
  await flush();
  await context.render().refresh();
  assert.equal(context.render().forecast, cached);
  assert.ok(context.render().error);
});

test('changing location cancels the old request and cannot display its late response', async (t) => {
  const fetch = deferred();
  const context = setup(t, { fetch: () => fetch.promise });
  context.render();
  await flush();
  const request = context.render().refresh();
  const signal = context.calls.lastSignal;
  context.move({ latitude: 52, longitude: 21 });
  context.render();
  assert.equal(signal.aborted, true);
  fetch.resolve({ point: { latitude: 50.06, longitude: 19.94 }, days: [] });
  await request;
  await flush();
  assert.equal(context.render().forecast, null);
  assert.equal(context.calls.writes, 0);
});

test('GPS jitter within one rounded area does not restart cache reads or cancel fetch', async (t) => {
  const fetch = deferred();
  const context = setup(t, { fetch: () => fetch.promise });
  context.render();
  await flush();
  const request = context.render().refresh();
  context.move({ latitude: 50.062, longitude: 19.942 });
  context.render();
  assert.equal(context.calls.reads, 1);
  assert.equal(context.calls.lastSignal.aborted, false);
  fetch.resolve({ days: [] });
  await request;
});

test('unmount cancels network and ignores late state writes', async (t) => {
  const fetch = deferred();
  const context = setup(t, { fetch: () => fetch.promise });
  context.render();
  await flush();
  const request = context.render().refresh();
  context.host.unmount();
  const writes = context.host.writes();
  fetch.resolve({ days: [] });
  await request;
  assert.equal(context.calls.lastSignal.aborted, true);
  assert.equal(context.host.writes(), writes);
});

test('without a location neither cache nor network is accessed', async (t) => {
  const context = setup(t);
  context.move(null);
  await context.render().refresh();
  assert.equal(context.calls.reads, 0);
  assert.equal(context.calls.fetches, 0);
});

test('visible map automatically refreshes stale data once even if offline', async (t) => {
  const cached = { days: [] };
  const c = setup(t, {
    automatic: true,
    read: async () => cached,
    stale: () => true,
    fetch: async () => {
      throw new Error('offline');
    },
  });
  c.render();
  await flush();
  c.render();
  await flush();
  assert.equal(c.render().forecast, cached);
  assert.ok(c.render().error);
  assert.equal(c.calls.fetches, 1);
});
test('map fetches missing weather but reuses a fresh cached forecast', async (t) => {
  for (const cached of [null, { days: [], history: [] }]) {
    const c = setup(t, { automatic: true, read: async () => cached });
    c.render();
    await flush();
    c.render();
    await flush();
    assert.ok(c.render().forecast);
    assert.equal(c.calls.fetches, cached ? 0 : 1);
  }
});
