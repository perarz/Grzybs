import { requireOptionalNativeModule } from 'expo';

/**
 * Expo Go 58 on Android hands the new-style ("v2") Expo modules – SQLite, haptics – to only one
 * JS runtime per process: expo-modules-core's ExpoModulesV2Host keeps a single runtime and skips
 * the next one with "Expo Modules v2 was already installed". So when Expo Go already holds another
 * runtime (another project, this one from a different address, or one restored with an emulator
 * snapshot), this app starts without them and its first `import 'expo-sqlite'` throws.
 * The modules are installed together, so SQLite stands for all of them.
 */
export function hasNativeModules(): boolean {
  return requireOptionalNativeModule('ExpoSQLite') !== null;
}
