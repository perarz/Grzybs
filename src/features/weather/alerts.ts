import { isRunningInExpoGo } from 'expo';
import type { ComponentType } from 'react';

import type { WeatherForecast, WeatherPoint } from './types';

export type { AlertSettings } from './alertSettings';

type NativeAlerts = {
  setup: typeof import('./mushroomAlerts');
  settings: typeof import('./alertSettings');
  check: typeof import('./alertCheck');
};

const EXPO_GO_MESSAGE =
  'Alerty w tle wymagają własnej wersji aplikacji. W Expo Go nie można ich tutaj włączyć.';

// Background mushroom alerts need a development build, so Expo Go can never turn them on.
// There expo-notifications would only print warnings the moment it is imported – so the module
// behind it is loaded only outside Expo Go. Its import also registers the background task,
// which has to happen at app start – so this load is synchronous require, not import().
const nativeAlerts: NativeAlerts | null = isRunningInExpoGo()
  ? null
  : {
      /* eslint-disable @typescript-eslint/no-require-imports -- conditional, see above */
      setup: require('./mushroomAlerts'),
      settings: require('./alertSettings'),
      check: require('./alertCheck'),
      /* eslint-enable @typescript-eslint/no-require-imports */
    };

/** Listens for alert taps and checks conditions while the app is open; nothing to do in Expo Go. */
export const MushroomAlertsLifecycle: ComponentType | null = isRunningInExpoGo()
  ? null
  : // eslint-disable-next-line @typescript-eslint/no-require-imports -- conditional, see above
    require('./MushroomAlertsLifecycle').MushroomAlertsLifecycle;

export async function readAlertSettings() {
  return nativeAlerts ? nativeAlerts.settings.readAlertSettings() : null;
}

export async function setMushroomAlerts(enabled: boolean, point: WeatherPoint | null) {
  if (nativeAlerts) return nativeAlerts.setup.setMushroomAlerts(enabled, point);
  if (enabled) throw new Error(EXPO_GO_MESSAGE);
}

export async function updateAlertLocation(point: WeatherPoint) {
  await nativeAlerts?.settings.updateAlertLocation(point);
}

export async function checkMushroomAlert(forecast?: WeatherForecast) {
  await nativeAlerts?.check.checkMushroomAlert(forecast);
}
