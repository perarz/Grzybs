const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const { createHookHost } = require('./helpers/weatherHookHost.cjs');
const flush = () => new Promise((resolve) => setImmediate(resolve));
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function setup(overrides = {}) {
  const host = createHookHost();
  let db = {};
  let reads = 0;
  const exports = {};
  const dependencies = {
    react: host.react,
    'expo-sqlite': { useSQLiteContext: () => db },
    './progressStorage': {
      EMPTY_STATS: { quiz: { sessions: 0, best: 0 } },
      readLearningStats: async (...args) => {
        reads++;
        return overrides.read?.(...args) ?? {};
      },
      recordLearningSession: async (...args) => overrides.record?.(...args),
    },
  };
  vm.runInNewContext(
    ts.transpileModule(readFileSync('src/features/learn/useLearningProgress.ts', 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    { exports, require: (name) => dependencies[name] },
  );
  return {
    host,
    reads: () => reads,
    render: () => host.render(exports.useLearningProgress),
    replaceDatabase: () => {
      db = {};
    },
  };
}
test('refresh completion after leaving learning does not update state', async () => {
  const pending = deferred();
  let count = 0;
  const context = setup({ read: () => (++count === 1 ? {} : pending.promise) });
  context.render();
  await flush();
  const refresh = context.render().refresh();
  context.host.unmount();
  const writes = context.host.writes();
  pending.resolve({ quiz: { sessions: 8, best: 100 } });
  await refresh;
  assert.equal(context.host.writes(), writes);
});
test('a persisted result still succeeds after leaving, without starting an orphan read', async () => {
  const pending = deferred();
  const context = setup({ record: () => pending.promise });
  context.render();
  await flush();
  const record = context.render().record('quiz', 4, 5, 'round');
  context.host.unmount();
  const writes = context.host.writes();
  pending.resolve();
  await record;
  assert.equal(context.reads(), 1);
  assert.equal(context.host.writes(), writes);
});
test('a delayed save from an old database cannot replace the current statistics', async () => {
  const pending = deferred();
  const currentStats = { quiz: { sessions: 2, best: 80 } };
  const context = setup({ record: () => pending.promise, read: () => currentStats });
  context.render();
  await flush();
  const record = context.render().record('quiz', 4, 5, 'round');
  context.replaceDatabase();
  context.render();
  await flush();
  pending.resolve();
  await record;
  assert.equal(context.reads(), 2);
  assert.equal(context.render().stats, currentStats);
  context.host.unmount();
});
test('a failed statistics refresh does not report a successful save as failed', async () => {
  let count = 0;
  const context = setup({
    read: async () => {
      if (++count > 1) throw new Error('read failed');
      return {};
    },
  });
  context.render();
  await flush();
  await context.render().record('quiz', 4, 5, 'round');
  assert.match(context.render().error, /odczytać/);
  assert.equal(context.render().loading, false);
  context.host.unmount();
});
