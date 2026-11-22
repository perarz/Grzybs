import type { SQLiteDatabase } from 'expo-sqlite';

const REVEAL_KEY = 'daily_riddle_solved';

/** The local calendar day – the daily species changes at midnight. */
export function todayKey(now = new Date()) {
  return now.toDateString();
}

/** The day on which the user last uncovered the daily species. */
export async function readRevealedDay(db: SQLiteDatabase): Promise<string | null> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    REVEAL_KEY,
  );
  return row?.value ?? null;
}

export async function saveRevealedDay(db: SQLiteDatabase, day: string): Promise<void> {
  await db.runAsync(
    `INSERT INTO app_settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    REVEAL_KEY,
    day,
  );
}
