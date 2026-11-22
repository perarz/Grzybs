const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
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
      require: (name) => {
        const base = name.startsWith('@/')
          ? path.resolve('src', name.slice(2))
          : path.resolve(path.dirname(file), name);
        return load(`${base}.ts`);
      },
    },
  );
  return exports;
}
const { rankIndex, XP_RULES } = load('src/features/learn/ranks.ts');

test('each finished stage brings the next rank, and the last one stays', () => {
  assert.equal(rankIndex(0), 0);
  assert.equal(rankIndex(4), 0);
  assert.equal(rankIndex(5), 1);
  assert.equal(rankIndex(25), 5);
  assert.equal(rankIndex(99), 5);
});

test('the XP guide shows the same numbers the lessons give', () => {
  assert.deepEqual({ ...XP_RULES }, { lesson: 10, test: 20, perfectBonus: 5 });
});
