import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { setHapticsEnabled } from './haptics';
import { readSetting } from './settings';

/** Applies the saved vibration choice when the app starts. */
export function useHapticsPreference() {
  const db = useSQLiteContext();
  useEffect(() => {
    readSetting(db, 'haptics')
      .then(setHapticsEnabled)
      // Without the setting, vibrations simply stay on.
      .catch(() => undefined);
  }, [db]);
}
