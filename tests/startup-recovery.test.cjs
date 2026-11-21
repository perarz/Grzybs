const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

// A file system stand-in: one in-memory file, or a disk that refuses every access.
function loadRecovery({ broken = false } = {}) {
  const disk = new Map();
  const reloads = [];
  class File {
    constructor(directory, name) {
      if (broken) throw new Error('no access');
      this.path = `${directory}/${name}`;
    }
    get exists() {
      return disk.has(this.path);
    }
    create() {
      disk.set(this.path, '');
    }
    textSync() {
      return disk.get(this.path);
    }
    writeSync(content) {
      disk.set(this.path, content);
    }
  }
  const modules = {
    'expo-file-system': { File, Paths: { cache: 'cache' } },
    'react-native': { DevSettings: { reload: (reason) => reloads.push(reason) } },
  };
  const exportsObject = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync('src/features/startup/recovery.ts', 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    { exports: exportsObject, require: (name) => modules[name] },
  );
  return { ...exportsObject, reloads };
}

test('the app reloads by itself once, then waits before trying again', () => {
  const { claimAutomaticRetry, RETRY_WINDOW_MS } = loadRecovery();
  const start = 1_000_000;
  assert.equal(claimAutomaticRetry(start), true);
  // The reload didn't help and the app came back without modules: no second automatic reload.
  assert.equal(claimAutomaticRetry(start + 2_000), false);
  assert.equal(claimAutomaticRetry(start + RETRY_WINDOW_MS - 1), false);
  // A problem on another day is a new situation, so one automatic reload is allowed again.
  assert.equal(claimAutomaticRetry(start + RETRY_WINDOW_MS), true);
});

test('without a place to remember the attempt the app never reloads by itself', () => {
  const { claimAutomaticRetry } = loadRecovery({ broken: true });
  assert.equal(claimAutomaticRetry(1_000_000), false);
});

test('a manual retry reloads the JS runtime', () => {
  const { reloadRuntime, reloads } = loadRecovery();
  reloadRuntime();
  assert.equal(reloads.length, 1);
});

test('the app entry checks native modules before loading the router or the database', () => {
  const entry = fs.readFileSync('index.ts', 'utf8');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.equal(packageJson.main, 'index.ts');
  // Only type imports and the module check may be static: anything else would load before the check.
  const staticImports = [...entry.matchAll(/^import .* from '([^']+)';$/gm)].map(
    (match) => match[1],
  );
  assert.deepEqual(staticImports, ['expo', './src/features/startup/nativeModules']);
  assert.match(entry, /if \(hasNativeModules\(\)\) \{\s*require\('expo-router\/entry'\);/);
  const check = fs.readFileSync('src/features/startup/nativeModules.ts', 'utf8');
  assert.doesNotMatch(check, /from 'expo-sqlite'|require\('expo-sqlite'\)/);
});
