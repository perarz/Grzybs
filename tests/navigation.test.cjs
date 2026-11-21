const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

// Reconstructed behavioral coverage; this is not a byte-for-byte recovery of the old file.
function load(name, dependencies = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(`src/features/navigation/${name}.ts`, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    Date,
    Math,
    Number,
    require: (dependency) => {
      if (dependency in dependencies) return dependencies[dependency];
      throw new Error(`Unexpected import: ${dependency}`);
    },
    ...globals,
  });
  return exports;
}
const geo = load('geo');
const daylight = load('daylight', { './geo': geo, suncalc: require('suncalc') });
const point = (latitude, longitude) => ({ latitude, longitude });
const near = (actual, expected, tolerance = 0.00001) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≈ ${expected}`);
const flush = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function clock() {
  let now = 1_800_000_000_000;
  let id = 0;
  const pending = new Map();
  class FakeDate extends Date {
    static now() {
      return now;
    }
  }
  return {
    globals: {
      Date: FakeDate,
      setTimeout: (fn, delay) => {
        pending.set(++id, { at: now + delay, fn });
        return id;
      },
      clearTimeout: (key) => pending.delete(key),
    },
    now: () => now,
    count: () => pending.size,
    advance(ms) {
      const target = now + ms;
      for (;;) {
        const next = [...pending]
          .filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        now = next[1].at;
        pending.delete(next[0]);
        next[1].fn();
      }
      now = target;
    },
  };
}
function trackerScenario(overrides = {}) {
  const time = clock();
  const positionCallbacks = [];
  const headingCallbacks = [];
  const subscriptions = [];
  let permissionCalls = 0;
  const makeSubscription = () => {
    const subscription = {
      removed: 0,
      remove() {
        this.removed++;
      },
    };
    subscriptions.push(subscription);
    return subscription;
  };
  const location = {
    Accuracy: { High: 4 },
    requestForegroundPermissionsAsync: async () => {
      permissionCalls++;
      return { granted: true };
    },
    hasServicesEnabledAsync: async () => true,
    watchPositionAsync: async (_, callback, error) => {
      positionCallbacks.push({ callback, error });
      return makeSubscription();
    },
    watchHeadingAsync: async (callback) => {
      headingCallbacks.push(callback);
      return makeSubscription();
    },
    ...overrides,
  };
  const heading = load('headingMonitor', {}, time.globals);
  const { createLocationTracker } = load(
    'locationTracking',
    { 'expo-location': location, './geo': geo, './headingMonitor': heading },
    time.globals,
  );
  const state = { position: null, heading: null, status: 'idle', error: null };
  const updates = [];
  const tracker = createLocationTracker((patch) => {
    Object.assign(state, patch);
    updates.push(patch);
  });
  return {
    tracker,
    state,
    updates,
    time,
    subscriptions,
    positionCallbacks,
    headingCallbacks,
    location,
    makeSubscription,
    permissionCalls: () => permissionCalls,
    fix(timestamp = time.now(), coordinates = point(50, 20), index = positionCallbacks.length - 1) {
      positionCallbacks[index].callback({ coords: { ...coordinates, accuracy: 5 }, timestamp });
    },
  };
}

test('distance is symmetric, handles same point, dateline and antipodes', () => {
  const a = point(50.06, 19.94),
    b = point(52.23, 21.01);
  assert.equal(geo.distanceMeters(a, a), 0);
  near(geo.distanceMeters(a, b), geo.distanceMeters(b, a));
  assert.ok(geo.distanceMeters(a, b) > 240000 && geo.distanceMeters(a, b) < 270000);
  assert.ok(geo.distanceMeters(point(0, 179.9), point(0, -179.9)) < 23000);
  near(geo.distanceMeters(point(0, 0), point(0, 180)), Math.PI * 6371008.8, 1);
  assert.ok(Number.isNaN(geo.distanceMeters(point(91, 0), b)));
});
test('bearings use true north clockwise and cross the dateline correctly', () => {
  for (const [to, expected] of [
    [point(1, 0), 0],
    [point(0, 1), 90],
    [point(-1, 0), 180],
    [point(0, -1), 270],
  ])
    near(geo.bearingDegrees(point(0, 0), to), expected);
  near(geo.bearingDegrees(point(0, 179), point(0, -179)), 90);
  assert.ok(Number.isNaN(geo.bearingDegrees(point(NaN, 0), point(0, 0))));
});
test('distance labels handle metres, kilometres and invalid fixes', () => {
  assert.equal(geo.formatDistance(0), '0 m');
  assert.equal(geo.formatDistance(48.8), '49 m');
  assert.equal(geo.formatDistance(1234), '1,2 km');
  for (const value of [-1, NaN, Infinity]) assert.equal(geo.formatDistance(value), '—');
  for (const value of [point(0, 181), point(-91, 0), point(NaN, 0)])
    assert.equal(geo.isCoordinate(value), false);
});
test('daylight distinguishes midday, the last hour, sunset and pre-dawn', () => {
  const place = point(50.06, 19.94);
  const noon = new Date('2026-06-15T12:00:00Z');
  const result = daylight.getDaylight(place, noon);
  assert.equal(result.state, 'day');
  assert.ok(result.sunset instanceof Date);
  assert.equal(
    daylight.getDaylight(place, new Date(result.sunset.getTime() - 30 * 60000)).state,
    'soon',
  );
  assert.equal(daylight.getDaylight(place, result.sunset).state, 'night');
  assert.equal(daylight.getDaylight(place, new Date('2026-06-15T00:00:00Z')).state, 'night');
});
test('polar days/nights and invalid inputs do not invent a sunset', () => {
  for (const [date, expected] of [
    ['2026-06-21T12:00:00Z', 'day'],
    ['2026-12-21T12:00:00Z', 'night'],
  ]) {
    const result = daylight.getDaylight(point(89, 0), new Date(date));
    assert.equal(result.state, expected);
    assert.equal(result.sunset, null);
    assert.equal(result.minutesLeft, null);
  }
  assert.equal(daylight.getDaylight(point(91, 0)).state, 'unknown');
  assert.equal(daylight.getDaylight(point(50, 20), new Date(NaN)).state, 'unknown');
});
test('GPS never asks permission before start; denied permission allows retry', async () => {
  const s = trackerScenario();
  assert.equal(s.permissionCalls(), 0);
  s.location.requestForegroundPermissionsAsync = async () => ({ granted: false });
  await s.tracker.start();
  assert.equal(s.state.status, 'denied');
  assert.equal(s.positionCallbacks.length, 0);
  s.location.requestForegroundPermissionsAsync = async () => ({ granted: true });
  const started = s.tracker.start();
  await flush();
  s.fix();
  await started;
  assert.equal(s.state.status, 'tracking');
  s.tracker.stop();
});
test('disabled location services fail without opening watchers', async () => {
  const s = trackerScenario({ hasServicesEnabledAsync: async () => false });
  await s.tracker.start();
  assert.equal(s.state.status, 'error');
  assert.equal(s.positionCallbacks.length, 0);
  assert.equal(s.time.count(), 0);
});
test('GPS times out without a first fix and releases subscriptions', async () => {
  const s = trackerScenario();
  const started = s.tracker.start();
  await flush();
  s.time.advance(30000);
  await started;
  assert.equal(s.state.status, 'error');
  assert.ok(s.subscriptions.every((subscription) => subscription.removed === 1));
  s.fix();
  assert.equal(s.state.position, null);
});
test('duplicate starts while requesting and reuse while tracking do not open extra watchers', async () => {
  const s = trackerScenario();
  const started = s.tracker.start();
  await s.tracker.start();
  await flush();
  assert.equal(s.permissionCalls(), 1);
  s.fix();
  await started;
  await s.tracker.start(true);
  assert.equal(s.positionCallbacks.length, 1);
  s.tracker.stop();
});
test('stop during permission request prevents late watchers and state updates', async () => {
  const permission = deferred();
  const s = trackerScenario({ requestForegroundPermissionsAsync: () => permission.promise });
  const started = s.tracker.start();
  s.tracker.stop();
  permission.resolve({ granted: true });
  await started;
  await flush();
  assert.equal(s.state.status, 'idle');
  assert.equal(s.positionCallbacks.length, 0);
  assert.equal(s.time.count(), 0);
});
test('late position and heading subscriptions are removed after stop', async () => {
  for (const watcher of ['position', 'heading']) {
    const late = deferred();
    const s = trackerScenario();
    if (watcher === 'position')
      s.location.watchPositionAsync = async (_, callback) => {
        s.positionCallbacks.push({ callback });
        return late.promise;
      };
    else s.location.watchHeadingAsync = () => late.promise;
    const started = s.tracker.start();
    await flush();
    if (watcher === 'heading') {
      s.fix();
      await started;
    }
    s.tracker.stop();
    const subscription = s.makeSubscription();
    late.resolve(subscription);
    await started;
    await flush();
    assert.equal(subscription.removed, 1);
    assert.equal(s.state.status, 'idle');
  }
});
test('invalid, future and out-of-order fixes cannot overwrite the newest location', async () => {
  const s = trackerScenario();
  const started = s.tracker.start();
  await flush();
  s.fix(s.time.now(), point(50, 20));
  await started;
  for (const [timestamp, position] of [
    [s.time.now() - 1, point(51, 21)],
    [NaN, point(51, 21)],
    [s.time.now() + 6000, point(51, 21)],
    [s.time.now(), point(99, 21)],
  ])
    s.fix(timestamp, position);
  assert.equal(s.state.position.latitude, 50);
  s.time.advance(1000);
  s.fix();
  assert.equal(s.state.position.timestamp, s.time.now());
  s.tracker.stop();
});
test('restart ignores old watcher callbacks and retains newest timestamp ordering', async () => {
  const s = trackerScenario();
  let started = s.tracker.start();
  await flush();
  s.fix();
  await started;
  const originalTimestamp = s.state.position.timestamp;
  started = s.tracker.start();
  await flush();
  s.fix(originalTimestamp + 1, point(55, 25), 0);
  s.fix(originalTimestamp - 1, point(54, 24));
  assert.equal(s.state.position.latitude, 50);
  s.fix(originalTimestamp + 1, point(51, 21));
  await started;
  assert.equal(s.state.position.latitude, 51);
  assert.equal(s.subscriptions[0].removed, 1);
  s.tracker.stop();
});
test('pause only stops active tracking and resume can obtain a new fix', async () => {
  const s = trackerScenario();
  s.tracker.pauseIfTracking();
  assert.equal(s.state.status, 'idle');
  let started = s.tracker.start();
  s.tracker.pauseIfTracking();
  assert.equal(s.state.status, 'requesting');
  await flush();
  s.fix();
  await started;
  s.tracker.pauseIfTracking();
  assert.equal(s.state.status, 'idle');
  assert.ok(s.subscriptions.every((subscription) => subscription.removed === 1));
  started = s.tracker.start(true);
  await flush();
  s.time.advance(1000);
  s.fix();
  await started;
  assert.equal(s.state.status, 'tracking');
  s.tracker.stop();
});
test('watcher failure clears heading and releases all active subscriptions', async () => {
  const s = trackerScenario();
  const started = s.tracker.start();
  await flush();
  s.fix();
  await started;
  s.headingCallbacks[0]({ trueHeading: 123, accuracy: 2 });
  assert.equal(s.state.heading, 123);
  s.positionCallbacks[0].error();
  assert.equal(s.state.status, 'error');
  assert.equal(s.state.heading, null);
  assert.equal(s.time.count(), 0);
  assert.ok(s.subscriptions.every((subscription) => subscription.removed === 1));
});
test('heading rejects invalid values and expires ten seconds after its latest sample', () => {
  const time = clock();
  const { createHeadingMonitor } = load('headingMonitor', {}, time.globals);
  const updates = [];
  const monitor = createHeadingMonitor(
    (value) => updates.push(value),
    () => true,
  );
  for (const trueHeading of [-1, 360, NaN, Infinity]) {
    monitor.receive({ trueHeading, accuracy: 2 });
    assert.equal(updates.at(-1), null);
  }
  monitor.receive({ trueHeading: 10, accuracy: 0 });
  assert.equal(updates.at(-1), null);
  monitor.receive({ trueHeading: 90, accuracy: 2 });
  time.advance(9000);
  assert.equal(updates.at(-1), 90);
  monitor.receive({ trueHeading: 180, accuracy: 2 });
  time.advance(9999);
  assert.equal(updates.at(-1), 180);
  time.advance(1);
  assert.equal(updates.at(-1), null);
  assert.equal(time.count(), 0);
});
test('heading cleanup cancels expiry and invalidated monitors cannot publish', () => {
  const time = clock();
  const { createHeadingMonitor } = load('headingMonitor', {}, time.globals);
  let valid = true;
  const updates = [];
  const monitor = createHeadingMonitor(
    (value) => updates.push(value),
    () => valid,
  );
  monitor.receive({ trueHeading: 90, accuracy: 2 });
  monitor.clear();
  assert.equal(updates.at(-1), null);
  assert.equal(time.count(), 0);
  monitor.receive({ trueHeading: 180, accuracy: 2 });
  valid = false;
  monitor.clear();
  const count = updates.length;
  monitor.receive({ trueHeading: 20, accuracy: 2 });
  time.advance(20000);
  assert.equal(updates.length, count);
  assert.equal(time.count(), 0);
});
