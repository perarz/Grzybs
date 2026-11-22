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
const { dailyRiddle } = load('src/features/learn/dailyRiddle.ts');

test('every species makes a fair riddle: three different answers, one of them right', () => {
  for (const species of SPECIES) {
    const riddle = dailyRiddle(species, SPECIES);
    const ids = riddle.options.map((option) => option.id);
    assert.equal(new Set(ids).size, 3, species.id);
    assert.ok(ids.includes(species.id), species.id);
    assert.ok(riddle.fact.length > 0, species.id);
  }
});

test('hints never name the species they describe', () => {
  for (const species of SPECIES) {
    const names = [species.namePl, species.nameCommon, ...species.otherNames]
      .filter(Boolean)
      .map((name) => name.toLowerCase());
    for (const clue of dailyRiddle(species, SPECIES).clues) {
      for (const name of names)
        assert.ok(!clue.toLowerCase().includes(name), `${species.id}: ${clue}`);
    }
  }
});

test('the answer is not always in the same place', () => {
  const places = new Set(
    SPECIES.map((species) =>
      dailyRiddle(species, SPECIES).options.findIndex((option) => option.id === species.id),
    ),
  );
  assert.equal(places.size, 3);
});
