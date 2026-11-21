import type { SQLiteDatabase } from 'expo-sqlite';

const SOUND_KEY = 'lesson_sounds';

/** Lesson sounds are on unless the user turned them off. */
export async function readSoundsEnabled(db: SQLiteDatabase): Promise<boolean> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    SOUND_KEY,
  );
  return row?.value !== 'off';
}

export async function saveSoundsEnabled(db: SQLiteDatabase, enabled: boolean): Promise<void> {
  await db.runAsync(
    `INSERT INTO app_settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    SOUND_KEY,
    enabled ? 'on' : 'off',
  );
}
