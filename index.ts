import { registerRootComponent } from 'expo';

import { hasNativeModules } from './src/features/startup/nativeModules';

// The app is loaded only once this JS runtime has its native modules – see nativeModules.ts for
// why Expo Go can start it without them. Static imports of the app would run too early, so both
// paths use require: the router and the database load only on a healthy start.
if (hasNativeModules()) {
  require('expo-router/entry');
} else {
  const {
    StartupRecovery,
  }: typeof import('./src/components/startup/StartupRecovery') = require('./src/components/startup/StartupRecovery');
  registerRootComponent(StartupRecovery);
}
