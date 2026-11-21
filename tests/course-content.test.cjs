const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  vm.runInNewContext(
    ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    {
      exports,
      require: (name) =>
        load(
          (name.startsWith('@/')
            ? path.resolve('src', name.slice(2))
            : path.resolve(path.dirname(file), name)) + '.ts',
        ),
    },
  );
  return exports;
}
const { courseStep, courseQuestions, courseUnits, COURSE_LENGTH } = load(
  'src/features/learn/course.ts',
);
test('50 sequential steps form five stages of ten with several task kinds', () => {
  assert.equal(COURSE_LENGTH, 50);
  for (let stage = 0; stage < 5; stage++) {
    const steps = Array.from({ length: 10 }, (_, i) => courseStep(stage * 10 + i, 8));
    assert.ok(steps.every((s) => s.stage === stage));
    assert.ok(new Set(steps.map((s) => s.kind)).size >= 6);
    assert.equal(steps[9].kind, 'checkpoint');
  }
  for (const id of [-1, 50, NaN, 1.5]) assert.equal(courseStep(id), null);
});
test('photo steps use an atlas exercise outside the reference species season', () => {
  for (let stage = 0; stage < 5; stage++) {
    assert.equal(courseStep(stage * 10 + 7, 1).kind, 'identify');
    assert.equal(courseStep(stage * 10 + 7, 8).kind, 'photo');
  }
});
test('every exercise has unique answers and a correct answer in its choices', () => {
  for (let id = 0; id < 50; id++) {
    for (const month of [1, 8]) {
      const step = courseStep(id, month);
      if (step.kind === 'photo') continue;
      const questions = courseQuestions(step);
      assert.ok(questions.length > 0);
      for (const q of questions) {
        assert.ok(
          q.options.some((o) => o.id === q.correctOptionId),
          q.id,
        );
        assert.equal(new Set(q.options.map((o) => o.id)).size, q.options.length, q.id);
        assert.ok(q.options.length >= 2, q.id);
        assert.ok(q.explanation);
      }
    }
  }
});

test('early stages teach visible features before Latin names and only cap-bearing species use underside tasks', () => {
  for (let id = 0; id < 50; id++) {
    const step = courseStep(id, 1);
    if (step.kind === 'observe' || step.kind === 'underside')
      assert.notEqual(step.species.features.underside, 'none');
    if (step.stage < 2 && ['quiz', 'checkpoint'].includes(step.kind)) {
      const questions = courseQuestions(step);
      assert.equal(questions.length, step.kind === 'checkpoint' ? 5 : step.position === 0 ? 2 : 3);
      assert.ok(questions.every((q) => !q.id.startsWith('quiz:latin:')));
    }
  }
});

test('every question has matching teaching material and checkpoints only revisit taught units', () => {
  for (let stage = 0; stage < 5; stage++) {
    const taught = new Set();
    for (let position = 0; position < 10; position++) {
      const step = courseStep(stage * 10 + position, 1);
      const units = courseUnits(step);
      const questions = courseQuestions(step);
      assert.equal(questions.length, units.length);
      questions.forEach((question, index) => {
        const unit = units[index];
        assert.equal(question.id, unit.question.id);
        assert.ok(unit.facts.length >= 2);
        assert.ok(unit.facts.every((fact) => fact.label && fact.text));
        assert.equal(question.correctOptionId, unit.question.correctOptionId);
        if (position >= 8) assert.ok(taught.has(unit.id), `untaught checkpoint fact: ${unit.id}`);
        else taught.add(unit.id);
      });
    }
  }
});
const { startCourseSession, reduceCourseSession } = load('src/features/learn/courseSession.ts');
function act(state, action) {
  return reduceCourseSession(state, { revision: state.revision, ...action });
}
test('all lesson cards precede questions and unanswered questions cannot be skipped', () => {
  let state = startCourseSession(2);
  state = act(state, { type: 'next' });
  assert.equal(state.phase, 'learn');
  assert.equal(state.page, 1);
  state = act(state, { type: 'next' });
  assert.equal(state.phase, 'quiz');
  assert.equal(state.page, 0);
  assert.equal(act(state, { type: 'next' }), state);
});
test('double taps cannot skip a lesson or score an answer twice', () => {
  let state = startCourseSession(2);
  const next = { type: 'next', revision: state.revision };
  state = reduceCourseSession(state, next);
  assert.equal(reduceCourseSession(state, next), state);
  state = act(state, { type: 'next' });
  const answer = { type: 'answer', option: 'right', correct: true, revision: state.revision };
  state = reduceCourseSession(state, answer);
  state = reduceCourseSession(state, answer);
  assert.equal(state.score, 1);
  const advance = { type: 'next', revision: state.revision };
  state = reduceCourseSession(state, advance);
  assert.equal(reduceCourseSession(state, advance), state);
  assert.equal(state.page, 1);
});
test('a reminder preserves the answer and failed attempts return to teaching without awarding progress', () => {
  let state = act(startCourseSession(1), { type: 'next' });
  state = act(state, { type: 'answer', option: 'wrong', correct: false });
  state = act(state, { type: 'review' });
  assert.equal(state.phase, 'review');
  state = act(state, { type: 'return' });
  assert.equal(state.selected, 'wrong');
  assert.equal(state.score, 0);
  state = act(state, { type: 'next' });
  assert.equal(state.phase, 'result');
  state = act(state, { type: 'restart' });
  assert.equal(state.phase, 'learn');
  assert.equal(state.selected, null);
  assert.equal(state.score, 0);
});
