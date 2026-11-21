const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const cache = new Map();
function load(filename) {
  const absolute = path.resolve(filename);
  if (cache.has(absolute)) return cache.get(absolute);
  const exports = {};
  cache.set(absolute, exports);
  const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (request) => {
      const target = request.startsWith('@/')
        ? path.resolve('src', request.slice(2))
        : path.resolve(path.dirname(absolute), request);
      if (/\.(jpg|png)$/.test(target)) {
        assert.ok(fs.statSync(target).size > 0, `Missing or empty bundled photo: ${target}`);
        return target;
      }
      return load(`${target}.ts`);
    },
  });
  return exports;
}
const { SPECIES } = load('src/data/species.ts');
const { LOOKALIKE_PAIRS } = load('src/data/lookalikes.ts');
const { SPECIES_PHOTOS } = load('src/data/speciesPhotos.ts');
const { KNOWLEDGE_SOURCES, FONT_SOURCES } = load('src/data/sources.ts');

test('every catalogue species has one bundled photo with attribution and HTTPS original', () => {
  assert.equal(new Set(SPECIES.map((species) => species.id)).size, SPECIES.length);
  assert.equal(Object.keys(SPECIES_PHOTOS).length, SPECIES.length);
  for (const species of SPECIES) {
    const photo = SPECIES_PHOTOS[species.id];
    assert.ok(photo, species.id);
    assert.ok(photo.author.trim());
    assert.match(photo.license, /^CC BY/);
    const url = new URL(photo.url);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'commons.wikimedia.org');
  }
});

test('lookalike pairs only reference existing distinct species and have usable differences', () => {
  const ids = new Set(SPECIES.map((species) => species.id));
  const pairs = new Set();
  for (const pair of LOOKALIKE_PAIRS) {
    assert.equal(pair.species.length, 2);
    assert.notEqual(pair.species[0], pair.species[1]);
    pair.species.forEach((id) => assert.ok(ids.has(id), id));
    const key = [...pair.species].sort().join(':');
    assert.ok(!pairs.has(key), `Duplicate pair ${key}`);
    pairs.add(key);
    assert.ok(pair.differences.length > 0);
    for (const difference of pair.differences) {
      assert.ok(difference.trait.trim() && difference.first.trim() && difference.second.trim());
    }
  }
});

test('seasons and feature data are valid for filters and daily learning', () => {
  for (const species of SPECIES) {
    assert.ok(species.keyFeatures.length > 0, species.id);
    assert.ok(species.habitats.length > 0, species.id);
    assert.ok(
      species.months.every((month) => Number.isInteger(month) && month >= 1 && month <= 12),
    );
    assert.equal(new Set(species.months).size, species.months.length);
    assert.ok(['gills', 'pores', 'ridges', 'none'].includes(species.features.underside));
  }
});

test('about-panel external sources only use HTTPS and have readable labels', () => {
  for (const source of [...KNOWLEDGE_SOURCES, ...FONT_SOURCES]) {
    assert.ok(source.title.trim());
    assert.equal(new URL(source.url).protocol, 'https:');
  }
});
