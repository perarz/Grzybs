const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function setup({ copyFails = false, insertFails = false } = {}) {
  const files = [];
  class File {
    constructor(...parts) {
      this.uri = parts.map((part) => part.uri ?? part).join('/');
      this.extension = '.heic';
      this.exists = false;
      files.push(this);
    }
    async copy(target) {
      target.exists = true;
      if (copyFails) throw new Error('copy failed');
    }
    delete() {
      this.exists = false;
    }
  }
  class Directory {
    constructor() {
      this.uri = 'documents/finds';
    }
    create() {}
  }
  const exports = {};
  const code = ts.transpileModule(readFileSync('src/features/collection/storage.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: () => ({ File, Directory, Paths: { document: 'documents' } }),
  });
  let parameters;
  const db = {
    async runAsync(...args) {
      parameters = args;
      if (insertFails) throw new Error('database full');
      return { lastInsertRowId: 12 };
    },
  };
  return { api: exports, db, files, parameters: () => parameters };
}

test('persists a photo before inserting a parameterized observation', async () => {
  const context = setup();
  const result = await context.api.saveFind(context.db, 'boletus-edulis', 'cache/photo.heic');
  assert.equal(result.id, 12);
  assert.equal(result.species_id, 'boletus-edulis');
  assert.match(result.photo_uri, /^documents\/finds\/.*\.heic$/);
  assert.equal(context.files[1].exists, true);
  assert.equal(context.parameters()[1], 'boletus-edulis');
  assert.equal(context.parameters()[2], result.photo_uri);
});

test('removes the copied photo when the database write fails', async () => {
  const context = setup({ insertFails: true });
  await assert.rejects(
    context.api.saveFind(context.db, 'boletus-edulis', 'cache/photo.heic'),
    /database full/,
  );
  assert.equal(context.files[1].exists, false);
});

test('cleans a partial copy and never inserts when copying fails', async () => {
  const context = setup({ copyFails: true });
  await assert.rejects(
    context.api.saveFind(context.db, 'boletus-edulis', 'cache/photo.heic'),
    /copy failed/,
  );
  assert.equal(context.files[1].exists, false);
  assert.equal(context.parameters(), undefined);
});

test('multiple observations retain separate photos', async () => {
  const context = setup();
  const first = await context.api.saveFind(context.db, 'boletus-edulis', 'cache/photo.heic');
  const second = await context.api.saveFind(context.db, 'boletus-edulis', 'cache/photo.heic');
  assert.notEqual(first.photo_uri, second.photo_uri);
});
