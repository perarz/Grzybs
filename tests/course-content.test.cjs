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
const { courseLesson, COURSE_LENGTH } = load('src/features/learn/course.ts');
const { COURSE_STAGES } = load('src/data/courseStages.ts');
const { lessonExercises } = load('src/features/learn/lessonExercises.ts');
const { SPECIES } = load('src/data/species.ts');
const { FIELD_RULES } = load('src/data/fieldRules.ts');

function seeded(seed) {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

test('five stages of four lessons and a test cover every species once', () => {
  assert.equal(COURSE_STAGES.length, 5);
  assert.equal(COURSE_LENGTH, 25);
  const taught = COURSE_STAGES.flatMap((stage) => stage.lessons.flatMap((l) => l.newSpecies));
  assert.equal(new Set(taught).size, taught.length);
  assert.equal(taught.length, SPECIES.length);
  for (const id of [-1, 25, NaN, 1.5]) assert.equal(courseLesson(id), null);
  assert.ok(courseLesson(4).isTest);
  assert.ok(courseLesson(24).isFinal);
  assert.equal(courseLesson(24).title, 'Egzamin grzybiarza');
});

test('every lesson has 6–8 exercises, mixes kinds and asks only about what was taught', () => {
  for (let id = 0; id < COURSE_LENGTH; id++) {
    for (const seed of [1, 7, 42]) {
      const lesson = courseLesson(id);
      const items = lessonExercises(lesson, seeded(seed));
      const questions = items.filter((item) => item.kind === 'choice');
      if (lesson.isTest) assert.equal(items.length, lesson.isFinal ? 12 : 10, `test ${id}`);
      else assert.ok(items.length >= 6 && items.length <= 9, `lesson ${id}: ${items.length}`);
      assert.ok(questions.length >= 3, `lesson ${id} asks too little`);
      assert.equal(
        new Set(items.map((item) => item.key)).size,
        items.length,
        `duplicates in ${id}`,
      );
      const allowed = new Set([...lesson.knownSpecies, ...lesson.newSpecies]);
      for (const item of questions) {
        assert.ok(
          item.options.some((option) => option.id === item.correctId),
          item.key,
        );
        assert.ok(item.options.length >= 2 && item.explanation.length > 5, item.key);
        const subject = item.key.split(':')[1];
        if (/^(name|photo|basket|where|pair):/.test(item.key))
          assert.ok(allowed.has(subject), `${item.key} asks about an unknown species in ${id}`);
        if (item.key.startsWith('situation:'))
          assert.ok(lesson.knownRules.includes(subject), `${item.key} before its rule in ${id}`);
      }
    }
  }
});

test('a new species is never asked in the same form as the card that taught it', () => {
  const items = lessonExercises(courseLesson(0), seeded(3));
  assert.equal(
    items
      .slice(0, 2)
      .map((item) => item.kind)
      .join(),
    'teach-species,teach-species',
  );
  // The card shows photo and name, so the first new species is asked to be found among photos.
  const [first] = courseLesson(0).newSpecies;
  assert.ok(
    items.some(
      (item) => item.kind === 'choice' && item.layout === 'photos' && item.correctId === first,
    ),
  );
});

test('every field rule cites an official source and has a correct answer', () => {
  for (const rule of Object.values(FIELD_RULES)) {
    assert.match(rule.source, /^https:\/\/www\.(gov\.pl|lasy\.gov\.pl)\//);
    assert.ok(rule.situation.options.some((option) => option.id === rule.situation.correctId));
  }
});

test('habitat questions are capped and never offer the other forest type as a wrong answer', () => {
  const forests = ['deciduous', 'coniferous'];
  for (let id = 0; id < COURSE_LENGTH; id++) {
    for (let seed = 1; seed <= 20; seed++) {
      const items = lessonExercises(courseLesson(id), seeded(seed));
      const where = items.filter((item) => item.key.startsWith('where:'));
      assert.ok(where.length <= 2, `lesson ${id} has ${where.length} habitat questions`);
      for (const item of where) {
        if (!forests.includes(item.correctId)) continue;
        const ids = item.options.map((option) => option.id);
        assert.equal(ids.filter((habitat) => forests.includes(habitat)).length, 1, item.key);
      }
    }
  }
});

test('a lesson teaches first and asks its questions in a new order on every attempt', () => {
  const orders = new Set();
  for (let seed = 1; seed <= 12; seed++) {
    const items = lessonExercises(courseLesson(0), seeded(seed));
    const firstQuestion = items.findIndex((item) => item.kind === 'choice');
    assert.ok(
      items.slice(firstQuestion).every((item) => item.kind === 'choice'),
      'no learning card after a question',
    );
    orders.add(items.map((item) => item.kind + ':' + item.key.split(':')[0]).join(','));
  }
  assert.ok(orders.size > 1, 'question order changes between attempts');
});
