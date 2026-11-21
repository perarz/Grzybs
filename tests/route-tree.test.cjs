const assert = require('node:assert/strict');
const { test } = require('node:test');
const path = require('node:path');
const { getRoutes } = require('expo-router/internal/routing');
const { requireContext } = require('expo-router/internal/testing');

// Use Expo's route discovery on the actual files, without loading native components.
for (const platform of ['android', 'ios']) {
  test(`${platform}: two tabs contain all guide screens, preserving public URLs`, () => {
    const tree = getRoutes(requireContext(path.resolve('src/app'), true, /\.[jt]sx?$/), {
      platform,
      importMode: 'async',
      ignoreEntryPoints: true,
      ignoreRequireErrors: true,
      skipGenerated: true,
    });
    assert.deepEqual(
      tree.children.map((route) => route.route),
      ['(tabs)'],
    );
    const tabs = tree.children[0];
    assert.deepEqual(tabs.children.map((route) => route.route).sort(), ['(home)', 'map']);
    const home = tabs.children.find((route) => route.route === '(home)');
    assert.deepEqual(home.children.map((route) => route.route).sort(), [
      'atlas',
      'collection',
      'compare',
      'index',
      'learn',
      'lesson/[id]',
      'settings',
      'species/[id]',
    ]);
    assert.equal(
      home.children.find((route) => route.route === 'species/[id]').dynamic[0].name,
      'id',
    );
  });
}
