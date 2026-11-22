import type { SQLiteDatabase } from 'expo-sqlite';

/** On/off preferences kept in `app_settings`; each is on until the user turns it off. */
export type FeedbackSetting = 'lesson_sounds' | 'haptics';

export async function readSetting(db: SQLiteDatabase, key: FeedbackSetting): Promise<boolean> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    key,
  );
  return row?.value !== 'off';
}

export async function saveSetting(
  db: SQLiteDatabase,
  key: FeedbackSetting,
  enabled: boolean,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO app_settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    key,
    enabled ? 'on' : 'off',
  );
}
