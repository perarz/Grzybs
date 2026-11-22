import * as Location from 'expo-location';
import type { Place } from './findDraft';

const RECENT_FIX_AGE = 2 * 60 * 1000;
const RECENT_FIX_ACCURACY = 200;
const FIX_TIMEOUT = 15000;
const NO_FIX = 'Nie udało się ustalić pozycji. Sprawdź GPS i spróbuj na otwartej przestrzeni.';

/** One position for a find: a recent known fix if there is one, otherwise a fresh reading. */
export async function readCurrentPlace(): Promise<Place> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Brak zgody na lokalizację. Możesz ją włączyć w ustawieniach telefonu.');
  }
  const recent = await Location.getLastKnownPositionAsync({
    maxAge: RECENT_FIX_AGE,
    requiredAccuracy: RECENT_FIX_ACCURACY,
  });
  const fix = recent ?? (await freshFix());
  return { latitude: fix.coords.latitude, longitude: fix.coords.longitude };
}

async function freshFix() {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(NO_FIX)), FIX_TIMEOUT);
  });
  try {
    return await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        mayShowUserSettingsDialog: false,
      }),
      timeout,
    ]);
  } catch {
    // The system's own messages are in English and technical – the user gets one clear sentence.
    throw new Error(NO_FIX);
  } finally {
    clearTimeout(timer);
  }
}
