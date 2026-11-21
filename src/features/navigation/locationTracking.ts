import * as Location from 'expo-location';

import { isCoordinate, type LocationFix } from './geo';
import { createHeadingMonitor } from './headingMonitor';

export type FieldLocationState = {
  position: LocationFix | null;
  heading: number | null;
  status: 'idle' | 'requesting' | 'tracking' | 'denied' | 'error';
  error: string | null;
};
export const INITIAL_LOCATION: FieldLocationState = {
  position: null,
  heading: null,
  status: 'idle',
  error: null,
};
const START_TIMEOUT = 30_000;

export function createLocationTracker(update: (patch: Partial<FieldLocationState>) => void) {
  let version = 0;
  let newestTimestamp = -Infinity;
  let clearHeading = () => {};
  let phase: FieldLocationState['status'] = 'idle';
  let subscriptions: Location.LocationSubscription[] = [];
  let cancel: (() => void) | undefined;
  function release() {
    version++;
    cancel?.();
    cancel = undefined;
    clearHeading();
    for (const subscription of subscriptions) subscription.remove();
    subscriptions = [];
  }
  function stop() {
    release();
    phase = 'idle';
    update({ status: 'idle', heading: null, error: null });
  }
  async function start(reuseTracking = false) {
    if (phase === 'requesting' || (reuseTracking && phase === 'tracking')) return;
    release();
    const current = version;
    const valid = () => current === version;
    const compass = createHeadingMonitor((heading) => update({ heading }), valid);
    clearHeading = compass.clear;
    phase = 'requesting';
    update({ status: phase, error: null, heading: null });
    let resolveFix: () => void = () => undefined;
    const firstFix = new Promise<void>((resolve) => {
      resolveFix = resolve;
    });
    let timeout: ReturnType<typeof setTimeout>;
    const canceled = new Promise<void>((_, reject) => {
      cancel = () => reject(new Error('Tracking canceled'));
      timeout = setTimeout(() => reject(new Error('GPS timeout')), START_TIMEOUT);
    });
    const fail = () => {
      if (!valid()) return;
      release();
      phase = 'error';
      update({
        status: 'error',
        heading: null,
        error:
          'Nie udało się ustalić pozycji. Sprawdź GPS i spróbuj ponownie na otwartej przestrzeni.',
      });
    };
    const retain = (subscription: Location.LocationSubscription) => {
      if (valid()) subscriptions.push(subscription);
      else subscription.remove();
    };
    async function subscribe() {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!valid()) return;
      if (!permission.granted) {
        phase = 'denied';
        update({
          status: 'denied',
          error: 'Brak zgody na lokalizację. Możesz ją włączyć w ustawieniach telefonu.',
        });
        return;
      }
      if (!(await Location.hasServicesEnabledAsync())) throw new Error('GPS disabled');
      if (!valid()) return;
      const watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 2,
          mayShowUserSettingsDialog: false,
        },
        ({ coords, timestamp }) => {
          if (
            !valid() ||
            !isCoordinate(coords) ||
            !Number.isFinite(timestamp) ||
            timestamp > Date.now() + 5000 ||
            timestamp < newestTimestamp
          )
            return;
          newestTimestamp = timestamp;
          phase = 'tracking';
          update({
            status: 'tracking',
            error: null,
            position: {
              latitude: coords.latitude,
              longitude: coords.longitude,
              accuracy: coords.accuracy,
              timestamp,
            },
          });
          resolveFix();
        },
        fail,
      );
      retain(watcher);
      if (!valid()) return;
      void Location.watchHeadingAsync(compass.receive, compass.clear)
        .then(retain)
        .catch(compass.clear);
      await firstFix;
    }
    try {
      await Promise.race([subscribe(), canceled]);
    } catch {
      fail();
    } finally {
      clearTimeout(timeout!);
      if (valid()) cancel = undefined;
    }
  }
  return {
    start,
    stop,
    pauseIfTracking: () => {
      if (phase === 'tracking') stop();
    },
  };
}
