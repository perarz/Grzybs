const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const forecast = {};
vm.runInNewContext(
  ts.transpileModule(readFileSync('src/features/learn/streakForecast.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText,
  { exports: forecast },
);

test("today's first lesson makes the streak one day longer", () => {
  assert.deepEqual(
    { ...forecast.streakAfterLesson({ streak: 2, completedToday: false }) },
    { before: 2, after: 3, grows: true },
  );
});

test('another lesson on the same day keeps the streak as it is', () => {
  assert.deepEqual(
    { ...forecast.streakAfterLesson({ streak: 3, completedToday: true }) },
    { before: 3, after: 3, grows: false },
  );
});
