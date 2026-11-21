const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync('src/features/weather/notificationPolicy.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  { exports: exportsObject },
);
const { shouldNotifyMushrooms } = exportsObject;
const now = Date.parse('2026-11-14T10:00:00Z');
const base = {
  forecast: { fetchedAt: now, utcOffsetSeconds: 3600, days: [{ date: '2026-11-14' }] },
  score: 7,
  now,
  sunrise: Date.parse('2026-11-14T06:00:00Z'),
  sunset: Date.parse('2026-11-14T15:00:00Z'),
  lastSentAt: null,
};
test('good conditions during daylight qualify; low or unknown scores do not', () => {
  assert.equal(shouldNotifyMushrooms(base), true);
  for (const score of [6, null, NaN, 11])
    assert.equal(shouldNotifyMushrooms({ ...base, score }), false);
});
test('uses local hours, excludes night and the last hour before sunset', () => {
  for (const time of ['06:59', '14:00', '16:00', '22:00']) {
    const instant = Date.parse(`2026-11-14T${time}:00Z`);
    assert.equal(
      shouldNotifyMushrooms({
        ...base,
        now: instant,
        forecast: { ...base.forecast, fetchedAt: instant },
      }),
      false,
    );
  }
  assert.equal(shouldNotifyMushrooms({ ...base, sunrise: now + 1 }), false);
  assert.equal(shouldNotifyMushrooms({ ...base, sunset: null }), false);
});
test('rejects stale, future and previous-day weather', () => {
  for (const patch of [
    { fetchedAt: now - 21600001 },
    { fetchedAt: now + 1 },
    { days: [{ date: '2026-11-13' }] },
  ]) {
    assert.equal(
      shouldNotifyMushrooms({ ...base, forecast: { ...base.forecast, ...patch } }),
      false,
    );
  }
});
test('prevents repeat alerts after restart or location changes', () => {
  assert.equal(shouldNotifyMushrooms({ ...base, lastSentAt: now - 3600000 }), false);
  assert.equal(shouldNotifyMushrooms({ ...base, lastSentAt: now - 86400000 }), true);
});
