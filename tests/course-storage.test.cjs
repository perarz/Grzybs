const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
let clock = Date.now();
class TestDate extends Date {
  static now() {
    return clock;
  }
}
const nodePath = require('node:path');
function load(file) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    {
      exports,
      Date: TestDate,
      // Storage reads lesson metadata from the course; relative and @/ imports load the same way.
      require: (name) =>
        load(
          name.startsWith('@/')
            ? nodePath.resolve('src', `${name.slice(2)}.ts`)
            : nodePath.resolve(nodePath.dirname(file), `${name}.ts`),
        ),
    },
  );
  return exports;
}
const { MIGRATIONS } = load('src/db/migrations.ts');
const { readCourseSteps, completeCourseStep, courseXP } = load(
  'src/features/learn/courseStorage.ts',
);
function setup(t, migrate = true) {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  if (migrate) for (const migration of MIGRATIONS) sqlite.exec(migration);
  const transaction = {
    runAsync: async (sql, ...params) => sqlite.prepare(sql).run(...params),
    getFirstAsync: async (sql, ...params) => sqlite.prepare(sql).get(...params) ?? null,
  };
  const db = {
    getAllAsync: async (sql, ...params) => sqlite.prepare(sql).all(...params),
    withExclusiveTransactionAsync: async (task) => {
      sqlite.exec('BEGIN IMMEDIATE');
      try {
        await task(transaction);
        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };
  return { sqlite, db, transaction };
}
test('course migration preserves old results, profile and observations without granting steps', async (t) => {
  const { sqlite, db } = setup(t, false);
  for (const migration of MIGRATIONS.slice(0, 6)) sqlite.exec(migration);
  sqlite.exec(`
    INSERT INTO learning_sessions VALUES ('old-quiz', 'quiz', 4, 5, 123);
    INSERT INTO user_profile VALUES (1, 'expert', 5);
    INSERT INTO finds (species_id, found_at, created_at) VALUES ('boletus-edulis', 123, 123);
  `);
  for (const migration of MIGRATIONS.slice(6)) sqlite.exec(migration);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM course_activity').get().count, 0);
  assert.equal(sqlite.prepare('SELECT score FROM learning_sessions').get().score, 4);
  assert.equal(sqlite.prepare('SELECT experience FROM user_profile').get().experience, 'expert');
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM finds').get().count, 1);
  assert.equal((await readCourseSteps(db)).length, 0);
});
test('course refuses skipping the first or an intermediate step', async (t) => {
  const { db } = setup(t);
  await assert.rejects(completeCourseStep(db, 1), /wcześniejsze/);
  await completeCourseStep(db, 0);
  await assert.rejects(completeCourseStep(db, 2), /wcześniejsze/);
  assert.equal((await readCourseSteps(db)).map((row) => row.step_id).join(), '0');
});
test('all 25 lessons can be completed sequentially without recording free practice results', async (t) => {
  const { sqlite, db } = setup(t);
  for (let step = 0; step < 25; step++) await completeCourseStep(db, step);
  const steps = await readCourseSteps(db);
  assert.equal(steps.length, 25);
  assert.equal(
    steps.map((row) => row.step_id).join(),
    Array.from({ length: 25 }, (_, i) => i).join(),
  );
  assert.ok(steps.every((row) => Number.isInteger(row.completed_at) && row.completed_at > 0));
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM learning_sessions').get().count, 0);
});
test('retry preserves the original completion date, including after later steps', async (t) => {
  const { sqlite, db } = setup(t);
  await completeCourseStep(db, 0);
  sqlite.exec('UPDATE course_steps SET completed_at = 123 WHERE step_id = 0');
  await completeCourseStep(db, 1);
  await completeCourseStep(db, 0);
  const rows = await readCourseSteps(db);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].completed_at, 123);
});
test('invalid step IDs cannot reach storage and schema rejects out-of-range writes', async (t) => {
  const { sqlite, db } = setup(t);
  for (const step of [-1, 25, 50, 1.5, NaN, Infinity, '0', null]) {
    await assert.rejects(completeCourseStep(db, step), /Nieprawidłowy/);
  }
  assert.throws(() => sqlite.exec('INSERT INTO course_steps VALUES (50, 123)'));
  assert.equal((await readCourseSteps(db)).length, 0);
});
test('failure inside the transaction rolls the completed step back', async (t) => {
  const { db, transaction } = setup(t);
  transaction.getFirstAsync = async () => {
    throw new Error('read failure');
  };
  await assert.rejects(completeCourseStep(db, 0), /read failure/);
  assert.equal((await readCourseSteps(db)).length, 0);
});

test('course activity counts one day once and replays keep the streak without unlocking steps', async (t) => {
  const { sqlite, db } = setup(t);
  const originalClock = clock;
  t.after(() => {
    clock = originalClock;
  });
  clock = new Date(2026, 5, 10, 12).getTime();
  await completeCourseStep(db, 0);
  await completeCourseStep(db, 0);
  await completeCourseStep(db, 1);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM course_activity').get().count, 1);
  clock = new Date(2026, 5, 11, 12).getTime();
  await completeCourseStep(db, 0);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM course_activity').get().count, 2);
  const steps = await readCourseSteps(db);
  assert.equal(steps.length, 2);
  assert.equal(steps[0].completed_at, new Date(2026, 5, 10, 12).getTime());
  clock = new Date(2026, 5, 12, 12).getTime();
  await assert.rejects(completeCourseStep(db, 3));
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM course_activity').get().count, 2);
});

test('daily activity write failure rolls back progression as one transaction', async (t) => {
  const { db, transaction } = setup(t);
  const run = transaction.runAsync;
  transaction.runAsync = async (sql, ...params) => {
    if (sql.includes('INSERT INTO course_activity')) throw new Error('activity write failed');
    return run(sql, ...params);
  };
  await assert.rejects(completeCourseStep(db, 0), /activity write failed/);
  assert.equal((await readCourseSteps(db)).length, 0);
});

test('the rebuilt course starts over but keeps the daily streak history', async (t) => {
  const { sqlite } = setup(t, false);
  for (const migration of MIGRATIONS.slice(0, 8)) sqlite.exec(migration);
  sqlite.exec(`
    INSERT INTO course_steps VALUES (0, 123), (1, 124);
    INSERT INTO course_activity VALUES ('2026-11-20', 124);
  `);
  for (const migration of MIGRATIONS.slice(8)) sqlite.exec(migration);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM course_steps').get().count, 0);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM course_activity').get().count, 1);
});

test('a replay keeps the best result and XP rewards tests and lessons without mistakes', async (t) => {
  const { db } = setup(t);
  await completeCourseStep(db, 0, 2);
  await completeCourseStep(db, 0, 0);
  await completeCourseStep(db, 0, 3);
  for (let step = 1; step <= 4; step++) await completeCourseStep(db, step, 1);
  const rows = await readCourseSteps(db);
  assert.equal(rows[0].mistakes, 0);
  // Lesson 0 without mistakes 15, lessons 1–3 with mistakes 10 each, test 4 with a mistake 20.
  assert.equal(courseXP(rows), 15 + 30 + 20);
});
