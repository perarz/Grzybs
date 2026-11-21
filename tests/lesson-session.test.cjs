const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const sessionApi = {};
vm.runInNewContext(
  ts.transpileModule(readFileSync('src/features/learn/lessonSession.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText,
  { exports: sessionApi },
);
const { startLesson, reduceLesson, currentExercise, isFinished, lessonProgress, lessonXP } =
  sessionApi;
const teach = { kind: 'teach-rule', key: 'rule:a', ruleId: 'sure' };
const question = (key) => ({
  kind: 'choice',
  key,
  prompt: '?',
  layout: 'list',
  options: [
    { id: 'ok', label: 'ok' },
    { id: 'bad', label: 'bad' },
  ],
  correctId: 'ok',
  explanation: 'because',
});
const answer = (session, id) =>
  reduceLesson(
    reduceLesson(reduceLesson(session, { type: 'select', optionId: id }), { type: 'check' }),
    {
      type: 'next',
    },
  );

test('a wrong answer comes back at the end and the lesson ends only when it is right', () => {
  let session = startLesson([teach, question('q1'), question('q2')]);
  session = reduceLesson(session, { type: 'next' });
  session = answer(session, 'bad');
  assert.equal(session.mistakes, 1);
  assert.equal(lessonProgress(session), 1 / 3);
  session = answer(session, 'ok');
  assert.equal(currentExercise(session).key, 'q1');
  assert.equal(currentExercise(session).options.map((option) => option.id).join(), 'bad,ok');
  assert.equal(isFinished(session), false);
  session = answer(session, 'ok');
  assert.equal(isFinished(session), true);
  assert.equal(lessonProgress(session), 1);
});

test('nothing advances before an answer is checked, and a checked answer cannot change', () => {
  let session = startLesson([question('q1')]);
  assert.equal(reduceLesson(session, { type: 'next' }), session);
  assert.equal(reduceLesson(session, { type: 'check' }), session);
  session = reduceLesson(session, { type: 'select', optionId: 'ok' });
  session = reduceLesson(session, { type: 'check' });
  assert.equal(reduceLesson(session, { type: 'select', optionId: 'bad' }), session);
  assert.equal(reduceLesson(session, { type: 'check' }), session);
});

test('combo counts answers in a row and resets on a mistake', () => {
  let session = startLesson([question('a'), question('b'), question('c')]);
  session = answer(session, 'ok');
  session = answer(session, 'ok');
  assert.equal(session.combo, 2);
  session = answer(session, 'bad');
  assert.equal(session.combo, 0);
  assert.equal(session.bestCombo, 2);
});

test('tests earn more XP and a lesson without mistakes earns a bonus', () => {
  assert.equal(lessonXP(false, 0), 15);
  assert.equal(lessonXP(false, 2), 10);
  assert.equal(lessonXP(true, 0), 25);
});
