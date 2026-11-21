const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function load(path) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports });
  return exports;
}
const { MIGRATIONS } = load('src/db/migrations.ts');
const { readLearningStats, recordLearningSession } = load('src/features/learn/progressStorage.ts');
function setup(t) {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  for (const migration of MIGRATIONS) sqlite.exec(migration);
  const db = {
    runAsync: async (sql, ...params) => sqlite.prepare(sql).run(...params),
    getAllAsync: async (sql, ...params) => sqlite.prepare(sql).all(...params),
  };
  return { sqlite, db };
}

test('migration retains existing observations when adding learning tables', (t) => {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  sqlite.exec(MIGRATIONS[0]);
  sqlite.exec(
    "INSERT INTO finds (species_id, found_at, created_at) VALUES ('boletus-edulis', 1, 1)",
  );
  for (const migration of MIGRATIONS.slice(1)) sqlite.exec(migration);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM finds').get().count, 1);
});

test('fresh database returns zero stats for both modes', async (t) => {
  const { db } = setup(t);
  const stats = await readLearningStats(db);
  assert.equal(stats.quiz.sessions, 0);
  assert.equal(stats.lookalikes.best, 0);
});

test('retrying the same session records it once', async (t) => {
  const { db } = setup(t);
  await recordLearningSession(db, 'quiz', 4, 5, 'round-1');
  await recordLearningSession(db, 'quiz', 4, 5, 'round-1');
  const stats = await readLearningStats(db);
  assert.equal(stats.quiz.sessions, 1);
  assert.equal(stats.quiz.best, 80);
});

test('best results are percentages and modes remain separate', async (t) => {
  const { db } = setup(t);
  await recordLearningSession(db, 'quiz', 4, 5, 'quiz-1');
  await recordLearningSession(db, 'quiz', 2, 5, 'quiz-2');
  await recordLearningSession(db, 'lookalikes', 1, 2, 'lookalikes-1');
  const stats = await readLearningStats(db);
  assert.equal(stats.quiz.sessions, 2);
  assert.equal(stats.quiz.best, 80);
  assert.equal(stats.lookalikes.sessions, 1);
  assert.equal(stats.lookalikes.best, 50);
});

test('invalid scores cannot be persisted', async (t) => {
  const { db } = setup(t);
  for (const [score, total] of [
    [6, 5],
    [-1, 5],
    [0, 0],
    [1.5, 5],
    [NaN, 5],
  ]) {
    await assert.rejects(recordLearningSession(db, 'quiz', score, total, 'invalid'));
  }
  assert.equal((await readLearningStats(db)).quiz.sessions, 0);
});
