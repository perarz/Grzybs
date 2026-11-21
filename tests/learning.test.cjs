const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const modules = new Map();
function loadModule(filename) {
  const absolute = path.resolve(filename);
  if (modules.has(absolute)) return modules.get(absolute);
  const exports = {};
  modules.set(absolute, exports);
  const code = ts.transpileModule(readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) =>
      loadModule(
        `${name.startsWith('@/') ? path.join('src', name.slice(2)) : path.resolve(path.dirname(absolute), name)}.ts`,
      ),
  });
  return exports;
}

const { createSession, getDailySpecies } = loadModule('src/features/learn/learning.ts');
const { SPECIES } = loadModule('src/data/species.ts');
const { LOOKALIKE_PAIRS } = loadModule('src/data/lookalikes.ts');
const snapshot = JSON.stringify({ SPECIES, LOOKALIKE_PAIRS });

function seededRandom(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

test('daily species stays the same throughout a local calendar day', () => {
  const morning = new Date(2026, 10, 6, 0, 1);
  const evening = new Date(2026, 10, 6, 23, 59);
  assert.equal(getDailySpecies(morning).id, getDailySpecies(evening).id);
});

test('daily rotation visits each species once, including across the DST weekend', () => {
  const dates = Array.from(
    { length: SPECIES.length },
    (_, index) => new Date(2026, 9, 20 + index, 12),
  );
  const selected = dates.map((date) => getDailySpecies(date).id);
  assert.equal(new Set(selected).size, SPECIES.length);
  assert.equal(getDailySpecies(new Date(2026, 9, 20 + SPECIES.length, 12)).id, selected[0]);
});

test('default sessions contain five unique subjects and exactly one correct option', () => {
  for (const mode of ['quiz', 'lookalikes']) {
    for (let seed = 0; seed < 50; seed++) {
      const questions = createSession(mode, undefined, seededRandom(seed));
      assert.equal(questions.length, 5);
      assert.equal(new Set(questions.map((question) => question.speciesIds.join(':'))).size, 5);
      for (const question of questions) {
        assert.equal(
          question.options.filter((option) => option.id === question.correctOptionId).length,
          1,
        );
        assert.equal(
          new Set(question.options.map((option) => option.id)).size,
          question.options.length,
        );
        assert.equal(
          new Set(question.options.map((option) => option.label)).size,
          question.options.length,
        );
        assert.ok(question.explanation.length > 0);
      }
    }
  }
});

test('lookalike answers match the named species and stored pair in both directions', () => {
  const sides = new Set();
  for (let seed = 0; seed < 30; seed++) {
    for (const question of createSession('lookalikes', 100, seededRandom(seed))) {
      const pair = LOOKALIKE_PAIRS.find(
        (candidate) => candidate.species.join(':') === question.speciesIds.join(':'),
      );
      const parts = question.id.split(':');
      const difference = pair.differences[Number(parts[3])];
      const targetId = parts[4];
      const first = targetId === pair.species[0];
      sides.add(first ? 'first' : 'second');
      assert.equal(question.correctOptionId, targetId);
      assert.equal(
        question.options.find((option) => option.id === targetId).label,
        first ? difference.first : difference.second,
      );
      assert.notEqual(difference.trait, 'Smak');
      assert.ok(
        question.prompt.includes(SPECIES.find((species) => species.id === targetId).namePl),
      );
    }
  }
  assert.equal(sides.size, 2);
});

test('quiz answers match atlas data', () => {
  for (let seed = 0; seed < 20; seed++) {
    for (const question of createSession('quiz', 100, seededRandom(seed))) {
      const species = SPECIES.find((item) => item.id === question.speciesIds[0]);
      const answer = question.options.find((option) => option.id === question.correctOptionId);
      if (question.id.startsWith('quiz:latin:')) assert.equal(answer.label, species.nameLatin);
      else assert.equal(answer.id, species.features.underside);
    }
  }
});

test('session limits handle empty, fractional and oversized requests without repeated subjects', () => {
  for (const count of [0, -1, NaN, Infinity]) assert.equal(createSession('quiz', count).length, 0);
  assert.equal(createSession('quiz', 2.9).length, 2);
  assert.equal(createSession('quiz', 1000).length, SPECIES.length);
  assert.equal(createSession('lookalikes', 1000).length, LOOKALIKE_PAIRS.length);
});

test('randomization is repeatable when seeded and never mutates catalogue data', () => {
  const first = JSON.stringify(createSession('lookalikes', 5, seededRandom(42)));
  const repeat = JSON.stringify(createSession('lookalikes', 5, seededRandom(42)));
  const different = JSON.stringify(createSession('lookalikes', 5, seededRandom(43)));
  assert.equal(first, repeat);
  assert.notEqual(first, different);
  assert.equal(JSON.stringify({ SPECIES, LOOKALIKE_PAIRS }), snapshot);
});
