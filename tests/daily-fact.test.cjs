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
const { SPECIES } = load('src/data/species.ts');
const { dailyFact } = load('src/features/learn/dailyFact.ts');

test('every species has one short sentence worth knowing, taken from the atlas', () => {
  for (const species of SPECIES) {
    const fact = dailyFact(species);
    const source = [
      species.poisoning,
      species.edibilityNote,
      species.protectionNote,
      species.description,
    ];
    assert.match(fact, /[.!?]$/, species.id);
    assert.ok(
      source.some((text) => text && text.startsWith(fact)),
      species.id,
    );
  }
});
