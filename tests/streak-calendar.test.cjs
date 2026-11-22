const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const calendar = {};
vm.runInNewContext(
  ts.transpileModule(readFileSync('src/features/learn/streakCalendar.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText,
  { exports: calendar },
);
const DAY = 86_400_000;

test('a month starting on Sunday puts the 1st in the last column', () => {
  const weeks = calendar.monthWeeks(2026, 10); // November 2026 starts on a Sunday
  assert.equal(
    weeks[0].slice(0, 6).every((cell) => cell === null),
    true,
  );
  assert.equal(weeks[0][6].date, 1);
  assert.equal(weeks.flat().filter(Boolean).length, 30);
  assert.equal(
    weeks.every((week) => week.length === 7),
    true,
  );
});

test('calendar cells use the same day numbers as the streak', () => {
  const [week] = calendar.monthWeeks(2026, 1); // February 2026 also starts on a Sunday
  assert.equal(week[6].day, Date.UTC(2026, 1, 1) / DAY);
  assert.deepEqual({ ...calendar.monthOf(week[6].day) }, { year: 2026, month: 1 });
  assert.equal(calendar.localDate(week[6].day).getDate(), 1);
});
