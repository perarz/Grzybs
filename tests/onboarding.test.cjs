const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync('src/features/onboarding/questions.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  { exports: exportsObject },
);
const { onboardingQuestions, onboardingScore } = exportsObject;
test('expert gets extra questions, humorous answer never affects score', () => {
  for (const level of ['new', 'regular', 'expert']) {
    const questions = onboardingQuestions(level);
    assert.equal(questions.length, level === 'expert' ? 6 : 4);
    const answers = Array.from(questions, (q) => q.correct);
    const expected = level === 'expert' ? 5 : level === 'new' ? 4 : 3;
    assert.equal(onboardingScore(level, answers), expected);
    if (level !== 'new') {
      answers[3] = 2;
      assert.equal(onboardingScore(level, answers), expected);
    }
    assert.equal(onboardingScore(level, []), 0);
  }
});
test('profile migration preserves existing data and supports completing or skipping onboarding', () => {
  const { DatabaseSync } = require('node:sqlite');
  const migrationExports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync('src/db/migrations.ts', 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    { exports: migrationExports },
  );
  const db = new DatabaseSync(':memory:');
  for (const sql of migrationExports.MIGRATIONS) db.exec(sql);
  assert.equal(db.prepare('SELECT * FROM user_profile').get(), undefined);
  db.prepare('INSERT INTO user_profile (id, experience, score) VALUES (1, ?, ?)').run('expert', 4);
  assert.equal(db.prepare('SELECT score FROM user_profile').get().score, 4);
  db.prepare('UPDATE user_profile SET experience = ?, score = NULL WHERE id = 1').run('new');
  assert.equal(db.prepare('SELECT score FROM user_profile').get().score, null);
  assert.equal(db.prepare('SELECT count(*) AS n FROM mushroom_alerts').get().n, 1);
  db.exec('DROP TABLE user_profile');
  // Version 6 repairs the profile table; newer migrations are unrelated.
  db.exec(migrationExports.MIGRATIONS[5]);
  assert.equal(db.prepare('SELECT * FROM user_profile').get(), undefined);
  db.close();
});
test('beginner has varied formats and every photo option has a bundled asset', () => {
  const questions = onboardingQuestions('new');
  assert.deepEqual(
    Array.from(questions, (q) => q.format || 'choice'),
    ['photo', 'boolean', 'scenario', 'choice'],
  );
  for (const question of questions) {
    assert.ok(question.correct >= 0 && question.correct < question.answers.length);
    if (question.format === 'boolean') assert.equal(question.answers.length, 2);
    if (question.format === 'photo') {
      assert.equal(question.photos.length, question.answers.length);
      for (const id of question.photos) assert.ok(fs.existsSync(`assets/images/species/${id}.jpg`));
    }
  }
  assert.equal(onboardingScore('new', [0, 0, 1, 0]), 0);
});
