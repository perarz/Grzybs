const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, modules = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports, require: (name) => modules[name] });
  return exports;
}
const { MIGRATIONS } = load('src/db/migrations.ts');
const draft = load('src/features/collection/findDraft.ts');
const storage = load('src/features/collection/storage.ts', { 'expo-file-system': {} });

const empty = { weight_grams: null, latitude: null, longitude: null, note: null };

test('an empty form saves no details', () => {
  assert.deepEqual({ ...draft.detailsFrom(draft.draftFrom(empty)) }, empty);
});

test('weight, place and note survive a round trip through the form', () => {
  const details = { weight_grams: 350, latitude: 52.2297, longitude: 21.0122, note: 'Pod bukiem' };
  assert.deepEqual({ ...draft.detailsFrom(draft.draftFrom(details)) }, details);
});

test('only whole grams in a sensible range count as a weight', () => {
  const form = (weight) => ({ weight, place: null, note: '' });
  assert.equal(draft.weightError(form('')), null);
  assert.equal(draft.weightError(form('250')), null);
  assert.match(draft.weightError(form('0')), /od 1/);
  assert.match(draft.weightError(form('12,5')), /gramach/);
  assert.match(draft.weightError(form('999999')), /gramach/);
  assert.equal(draft.detailsFrom(form('abc')).weight_grams, null);
});

test('weights read naturally in grams and kilograms', () => {
  assert.equal(draft.formatWeight(350), '350 g');
  assert.equal(draft.formatWeight(1250), '1,25 kg');
});

test('the migration keeps old finds and lets their details be added later', async (t) => {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  for (const migration of MIGRATIONS.slice(0, -1)) sqlite.exec(migration);
  sqlite
    .prepare('INSERT INTO finds (species_id, photo_uri, found_at, created_at) VALUES (?, ?, 1, 1)')
    .run('boletus-edulis', 'documents/finds/old.jpg');
  sqlite.exec(MIGRATIONS.at(-1));
  const db = {
    runAsync: async (sql, ...params) => sqlite.prepare(sql).run(...params),
    getAllAsync: async (sql, ...params) => sqlite.prepare(sql).all(...params),
  };
  const [old] = await storage.readFinds(db);
  assert.equal(old.weight_grams, null);
  const details = { weight_grams: 420, latitude: 50.06, longitude: 19.94, note: 'Kępka' };
  await storage.updateFindDetails(db, old.id, details);
  const [updated] = await storage.readFinds(db);
  assert.deepEqual({ ...updated }, { ...old, ...details });
  assert.throws(() => sqlite.prepare('UPDATE finds SET weight_grams = 0').run(), /CHECK/);
});
