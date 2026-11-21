import { File, Paths } from 'expo-file-system';
import { DevSettings } from 'react-native';

const ATTEMPT_FILE = 'startup-recovery-attempt.txt';
// Missing modules again this soon after a reload means the reload didn't help – stop and explain.
export const RETRY_WINDOW_MS = 30_000;

/**
 * Restarts this JS runtime. Destroying it makes Expo Go release the modules held by the stale
 * runtime (ExpoModulesV2Host.uninstall clears the whole process), so the reloaded app gets them.
 */
export function reloadRuntime() {
  DevSettings.reload('Grzybnik: brak modułów natywnych');
}

/** Pure decision, kept apart from the file so it can be tested. */
export function mayRetryAutomatically(lastAttemptAt: number, now: number): boolean {
  return now - lastAttemptAt >= RETRY_WINDOW_MS;
}

/**
 * True when the app may reload by itself now, and remembers the attempt.
 * False after a recent attempt, so a failing recovery never loops.
 */
export function claimAutomaticRetry(now = Date.now()): boolean {
  try {
    // expo-file-system uses the older module system, so it works even in an incomplete runtime.
    const file = new File(Paths.cache, ATTEMPT_FILE);
    const lastAttemptAt = file.exists ? Number(file.textSync()) || 0 : 0;
    if (!mayRetryAutomatically(lastAttemptAt, now)) return false;
    if (!file.exists) file.create();
    file.writeSync(String(now));
    return true;
  } catch {
    // Without a place to remember the attempt, an automatic reload could repeat forever.
    return false;
  }
}
