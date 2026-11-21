const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
function load(path) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(readFileSync(path, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    { exports },
  );
  return exports;
}
const { MIGRATIONS } = load('src/db/migrations.ts');
const { readFieldData, writeSpot, deleteSpot, writeCar, deleteCar } = load(
  'src/features/spots/storage.ts',
);
function setup(t) {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  sqlite.exec('PRAGMA foreign_keys = ON');
  for (const migration of MIGRATIONS) sqlite.exec(migration);
  const db = {
    runAsync: async (sql, ...params) => sqlite.prepare(sql).run(...params),
    getAllAsync: async (sql, ...params) => sqlite.prepare(sql).all(...params),
    getFirstAsync: async (sql, ...params) => sqlite.prepare(sql).get(...params) ?? null,
  };
  return { db, sqlite };
}
const spot = {
  name: '  Pod brzozami  ',
  note: "Ścieżka 'za potokiem'",
  latitude: 49.65,
  longitude: 19.82,
};
const fix = () => ({ latitude: 49.65, longitude: 19.82, accuracy: 8, timestamp: Date.now() });

test('spot names and notes persist and edits retain identity', async (t) => {
  const { db } = setup(t);
  await writeSpot(db, spot);
  const first = (await readFieldData(db)).spots[0];
  assert.equal(first.name, 'Pod brzozami');
  assert.equal(first.note, spot.note);
  await writeSpot(db, { ...spot, id: first.id, name: 'Przy lesie', note: '' });
  const data = await readFieldData(db);
  assert.equal(data.spots.length, 1);
  assert.equal(data.spots[0].id, first.id);
  assert.equal(data.spots[0].name, 'Przy lesie');
  assert.equal(data.spots[0].note, null);
});

test('deleting a spot preserves its observations and removes their link', async (t) => {
  const { db, sqlite } = setup(t);
  await writeSpot(db, spot);
  const { id } = (await readFieldData(db)).spots[0];
  sqlite
    .prepare('INSERT INTO finds (species_id, found_at, created_at, spot_id) VALUES (?, ?, ?, ?)')
    .run('boletus-edulis', 1, 1, id);
  await deleteSpot(db, id);
  assert.equal((await readFieldData(db)).spots.length, 0);
  assert.equal(sqlite.prepare('SELECT spot_id FROM finds').get().spot_id, null);
});

test('invalid coordinates and names cannot be stored', async (t) => {
  const { db } = setup(t);
  for (const input of [
    { ...spot, latitude: NaN },
    { ...spot, latitude: 91 },
    { ...spot, longitude: -181 },
    { ...spot, name: ' ' },
    { ...spot, note: 'x'.repeat(501) },
  ]) {
    await assert.rejects(writeSpot(db, input));
  }
  assert.equal((await readFieldData(db)).spots.length, 0);
});

test('editing missing spot reports a failure instead of silently succeeding', async (t) => {
  const { db } = setup(t);
  await assert.rejects(writeSpot(db, { ...spot, id: 999 }));
});

test('parking replaces only the single car point and can be cleared', async (t) => {
  const { db, sqlite } = setup(t);
  await writeCar(db, fix());
  await writeCar(db, { ...fix(), latitude: 50 });
  assert.equal((await readFieldData(db)).car.latitude, 50);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM car_location').get().count, 1);
  await deleteCar(db);
  assert.equal((await readFieldData(db)).car, null);
});

test('stale or inaccurate GPS cannot overwrite a saved car', async (t) => {
  const { db } = setup(t);
  await writeCar(db, fix());
  for (const override of [
    { timestamp: Date.now() - 61000 },
    { timestamp: Date.now() + 60000 },
    { accuracy: 101 },
    { accuracy: null },
    { accuracy: NaN },
  ]) {
    await assert.rejects(writeCar(db, { ...fix(), latitude: 51, ...override }));
  }
  assert.equal((await readFieldData(db)).car.latitude, 49.65);
});
