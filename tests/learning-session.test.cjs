const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function scenario(record = async () => undefined) {
  const cells = [];
  let cursor = 0;
  const react = {
    useState(initial) {
      const slot = cursor++;
      if (!(slot in cells)) cells[slot] = typeof initial === 'function' ? initial() : initial;
      return [
        cells[slot],
        (value) => {
          cells[slot] = typeof value === 'function' ? value(cells[slot]) : value;
        },
      ];
    },
    useRef(initial) {
      const slot = cursor++;
      if (!(slot in cells)) cells[slot] = { current: initial };
      return cells[slot];
    },
  };
  const questions = ['one', 'two'].map((id) => ({
    id,
    options: [{ id: 'yes' }, { id: 'no' }],
    correctOptionId: 'yes',
  }));
  const exports = {};
  const code = ts.transpileModule(
    readFileSync('src/features/learn/useLearningSession.ts', 'utf8'),
    {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    },
  ).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => (name === 'react' ? react : { createSession: () => questions }),
  });
  return () => {
    cursor = 0;
    return exports.useLearningSession('quiz', record);
  };
}

test('a queued answer from the previous question cannot answer the next question', () => {
  const render = scenario();
  let session = render();
  session.answer('yes');
  const oldQuestion = render();
  oldQuestion.next();
  oldQuestion.answer('no');
  session = render();
  assert.equal(session.index, 1);
  assert.equal(session.selected, undefined);
  session.answer('yes');
  session = render();
  assert.equal(session.selected, 'yes');
  assert.equal(session.score, 2);
});

test('old handlers cannot change a restarted round before the next render', () => {
  const render = scenario();
  const oldRound = render();
  oldRound.restart();
  oldRound.answer('yes');
  assert.equal(render().selected, undefined);
});

test('double taps cannot skip questions or record a finished round twice', async () => {
  const calls = [];
  const render = scenario(async (...args) => {
    calls.push(args);
  });
  let session = render();
  session.answer('yes');
  session.answer('no');
  session = render();
  session.next();
  session.next();
  session = render();
  assert.equal(session.index, 1);
  assert.equal(session.score, 1);
  session.answer('yes');
  session = render();
  session.next();
  session.next();
  await new Promise(setImmediate);
  session = render();
  assert.equal(session.finished, true);
  assert.equal(session.saveState, 'saved');
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], 2);
});

test('failed save can retry with the same round id and score', async () => {
  const calls = [];
  const render = scenario(async (...args) => {
    calls.push(args);
    if (calls.length === 1) throw new Error('disk busy');
  });
  let session = render();
  session.answer('yes');
  session = render();
  session.next();
  session = render();
  session.answer('no');
  session = render();
  session.next();
  await new Promise(setImmediate);
  session = render();
  assert.equal(session.saveState, 'error');
  await session.save();
  assert.equal(render().saveState, 'saved');
  assert.equal(calls[0][3], calls[1][3]);
  assert.equal(calls[1][1], 1);
});
