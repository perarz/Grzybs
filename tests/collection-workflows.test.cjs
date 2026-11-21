const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

function load(path, dependencies) {
  const exports = {};
  vm.runInNewContext(
    ts.transpileModule(readFileSync(path, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    { exports, require: (name) => dependencies[name] },
  );
  return exports;
}

function hookHost() {
  const slots = [];
  const effects = [];
  const cleanups = [];
  let cursor = 0;
  let writes = 0;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [
        slots[index],
        (value) => {
          writes++;
          slots[index] = typeof value === 'function' ? value(slots[index]) : value;
        },
      ];
    },
    useRef(initial) {
      const index = cursor++;
      return slots[index] ?? (slots[index] = { current: initial });
    },
    useEffect(effect) {
      const index = cursor++;
      if (!(index in slots)) {
        slots[index] = true;
        effects.push(effect);
      }
    },
  };
  return {
    react,
    render(callback) {
      cursor = 0;
      const result = callback();
      effects.splice(0).forEach((effect) => cleanups.push(effect()));
      return result;
    },
    unmount() {
      cleanups.forEach((cleanup) => cleanup?.());
    },
    writes: () => writes,
  };
}

const { photoUri } = load('src/features/collection/photoResult.ts', {});

test('photo results distinguish cancellation, failed recovery and invalid assets', () => {
  assert.equal(photoUri(null), null);
  assert.equal(photoUri({ canceled: true, assets: null }), null);
  assert.equal(
    photoUri({ canceled: false, assets: [{ uri: 'file://photo.jpg' }] }),
    'file://photo.jpg',
  );
  assert.throws(() => photoUri({ code: 'camera_failed' }), /odzyskać/);
  assert.throws(() => photoUri({ canceled: false, assets: [] }), /niedostępne/);
});

function findSetup() {
  const host = hookHost();
  const picker = deferred();
  const write = deferred();
  let writes = 0;
  const { useAddFind } = load('src/features/collection/useAddFind.ts', {
    react: host.react,
    './CollectionContext': {
      useCollection: () => ({
        finds: [],
        add: () => {
          writes++;
          return write.promise;
        },
      }),
    },
    './pickPhoto': { pickPhoto: () => picker.promise },
  });
  return {
    host,
    picker,
    write,
    writes: () => writes,
    render: () => host.render(() => useAddFind({ id: 'boletus-edulis' }, 'file://original.jpg')),
  };
}

test('double save submits once and a successful draft cannot be saved again', async () => {
  const context = findSetup();
  const draft = context.render();
  const pending = draft.save();
  await draft.save();
  assert.equal(context.writes(), 1);
  context.write.resolve();
  await pending;
  const saved = context.render();
  assert.equal(saved.saved, true);
  await saved.save();
  assert.equal(context.writes(), 1);
});

test('unreadable photo blocks saving until explicitly replaced', async () => {
  const context = findSetup();
  context.render().photoFailed();
  const failed = context.render();
  assert.equal(failed.photoUnavailable, true);
  await failed.save();
  assert.equal(context.writes(), 0);
  failed.setPhoto('file://replacement.jpg');
  const replaced = context.render();
  assert.equal(replaced.photoUnavailable, false);
  assert.equal(replaced.error, null);
});

test('picker cancellation preserves selected photo', async () => {
  const context = findSetup();
  const pending = context.render().choosePhoto(false);
  context.picker.resolve(null);
  await pending;
  assert.equal(context.render().photo, 'file://original.jpg');
});

test('picker and save completions do not update a closed draft', async () => {
  for (const action of ['choosePhoto', 'save']) {
    const context = findSetup();
    const pending = context.render()[action](false);
    context.host.unmount();
    const before = context.host.writes();
    context.picker.resolve('file://new.jpg');
    context.write.resolve();
    await pending;
    assert.equal(context.host.writes(), before);
  }
});

test('startup recovery exposes a draft without opening the add-photo sheet first', async () => {
  const host = hookHost();
  const pending = deferred();
  const { useRecoveredPhoto } = load('src/features/collection/useRecoveredPhoto.ts', {
    react: host.react,
    'expo-image-picker': { getPendingResultAsync: () => pending.promise },
    './photoResult': { photoUri },
  });
  assert.equal(host.render(useRecoveredPhoto).checking, true);
  pending.resolve({ canceled: false, assets: [{ uri: 'file://recovered.jpg' }] });
  await new Promise((resolve) => setImmediate(resolve));
  const result = host.render(useRecoveredPhoto);
  assert.equal(result.checking, false);
  assert.equal(result.pending.photo, 'file://recovered.jpg');
  result.clear();
  assert.equal(host.render(useRecoveredPhoto).pending, null);
});

test('failed recovery unlocks collection and exposes a retryable photo draft', async () => {
  const host = hookHost();
  const pending = deferred();
  const { useRecoveredPhoto } = load('src/features/collection/useRecoveredPhoto.ts', {
    react: host.react,
    'expo-image-picker': { getPendingResultAsync: () => pending.promise },
    './photoResult': { photoUri },
  });
  host.render(useRecoveredPhoto);
  pending.reject(new Error('camera result unavailable'));
  await new Promise((resolve) => setImmediate(resolve));
  const result = host.render(useRecoveredPhoto);
  assert.equal(result.checking, false);
  assert.equal(result.pending.photo, null);
  assert.match(result.pending.error, /ponownie/);
});
