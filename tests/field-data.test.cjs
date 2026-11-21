const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const { createHookHost } = require('./helpers/weatherHookHost.cjs');
const flush = () => new Promise((resolve) => setImmediate(resolve));
function setup(overrides = {}) {
  const host = createHookHost();
  const oldCar = { latitude: 50, longitude: 20, accuracy: 10, saved_at: 1 };
  let reads = 0;
  const storage = {
    readFieldData: async () => {
      reads++;
      if (reads > 1) throw new Error('Read failed');
      return { spots: [{ id: 1, name: 'Las' }], car: oldCar };
    },
    writeCar: async (db, position) => ({ ...position, saved_at: 2 }),
    deleteCar: async () => {},
    deleteSpot: async () => {},
    ...overrides,
  };
  const db = {};
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(readFileSync('src/features/spots/useFieldData.ts', 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    {
      exports,
      require: (name) =>
        ({
          react: host.react,
          'expo-sqlite': { useSQLiteContext: () => db },
          './storage': storage,
        })[name],
    },
  );
  return { host, oldCar, render: () => host.render(() => exports.useFieldData()) };
}
test('committed parking remains current when the following read fails', async () => {
  const app = setup();
  app.render();
  await flush();
  await app.render().park({ latitude: 51, longitude: 21, accuracy: 5, timestamp: Date.now() });
  const state = app.render();
  assert.equal(state.car.latitude, 51);
  assert.equal(state.car.saved_at, 2);
  assert.ok(state.error);
  app.host.unmount();
});
test('committed deletions do not leave a removed car or spot on the map after read failure', async () => {
  const app = setup();
  app.render();
  await flush();
  await app.render().clearCar();
  assert.equal(app.render().car, null);
  await app.render().removeSpot(1);
  assert.equal(app.render().spots.length, 0);
  app.host.unmount();
});
test('failed parking write preserves the previously saved car', async () => {
  const app = setup({
    writeCar: async () => {
      throw new Error('Disk full');
    },
  });
  app.render();
  await flush();
  await assert.rejects(app.render().park({ latitude: 51, longitude: 21 }), /Disk full/);
  assert.equal(app.render().car, app.oldCar);
  app.host.unmount();
});
test('refresh finishing after map unmount does not update state', async () => {
  let resolve;
  const app = setup({
    readFieldData: () =>
      new Promise((done) => {
        resolve = done;
      }),
  });
  app.render();
  const pending = app.render().refresh();
  app.host.unmount();
  const writes = app.host.writes();
  resolve({ spots: [], car: null });
  await pending;
  assert.equal(app.host.writes(), writes);
});
