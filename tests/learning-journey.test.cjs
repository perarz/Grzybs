const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
process.env.TZ = 'Europe/Warsaw';
const exports_ = {};
vm.runInNewContext(
  ts.transpileModule(readFileSync('src/features/learn/journey.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText,
  { exports: exports_, Date },
);
const { learningJourney, roundXP } = exports_;
const date = (day, hour = 12) => new Date(2026, 10, day, hour).getTime();
const record = (day, score = 5) => ({ score, total: 5, completed_at: date(day) });
test('empty history starts at level one without inventing a streak', () => {
  const j = learningJourney([], date(20));
  assert.equal(j.xp, 0);
  assert.equal(j.levelNumber, 1);
  assert.equal(j.streak, 0);
  assert.equal(j.completedToday, false);
  assert.equal(j.week.length, 7);
});
test('multiple rounds grant XP but only one streak day', () => {
  const j = learningJourney([record(20), record(20, 0), record(19)], date(20, 18));
  assert.equal(j.streak, 2);
  assert.equal(j.xp, 70);
  assert.equal(j.completedToday, true);
  assert.equal(j.week.filter((day) => day.done).length, 2);
});
test('yesterday streak survives until today ends, then resets without removing XP', () => {
  const rows = [record(18), record(19)];
  assert.equal(learningJourney(rows, date(20, 23)).streak, 2);
  const j = learningJourney(rows, date(21, 0));
  assert.equal(j.streak, 0);
  assert.equal(j.bestStreak, 2);
  assert.equal(j.xp, 60);
});
test('level boundaries and final level are correct', () => {
  const rows = Array.from({ length: 10 }, () => record(20, 0));
  const j = learningJourney(rows, date(20, 18));
  assert.equal(j.levelNumber, 2);
  assert.equal(j.fraction, 0);
  const final = learningJourney(
    Array.from({ length: 50 }, () => record(20)),
    date(20, 18),
  );
  assert.equal(final.level.name, 'Zaawansowany');
  assert.equal(final.next, undefined);
  assert.equal(final.fraction, 1);
});
test('calendar streak survives Warsaw daylight-saving transition', () => {
  const rows = ['2026-10-24T22:30:00Z', '2026-10-25T23:30:00Z'].map((time) => ({
    score: 5,
    total: 5,
    completed_at: Date.parse(time),
  }));
  assert.equal(learningJourney(rows, Date.parse('2026-10-26T12:00:00Z')).streak, 2);
});
test('future and invalid records do not award XP', () => {
  const j = learningJourney([record(21), record(20, -1), { ...record(20), total: 0 }], date(20));
  assert.equal(j.xp, 0);
  assert.equal(j.streak, 0);
  assert.equal(roundXP(3, 5), 22);
});
