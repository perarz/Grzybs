// https://docs.expo.dev/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// three's CommonJS entry only calls Node's process.emitWarning and then re-exports
// the ES module. React Native has no process.emitWarning, so that entry crashes the app.
// Resolve every `three` import straight to the ES module (also keeps a single Three.js copy).
const threeEsModule = path.join(path.dirname(require.resolve('three')), 'three.module.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'three') {
    return { type: 'sourceFile', filePath: threeEsModule };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
