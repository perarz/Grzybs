import type { SQLiteDatabase } from 'expo-sqlite';

import { MIGRATIONS } from './migrations';

export const DATABASE_NAME = 'grzybnik.db';

export async function initDatabase(db: SQLiteDatabase): Promise<void> {
  // SQLite keeps foreign keys off by default and the setting lives per connection,
  // so it has to be enabled every time the app opens the database.
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  await runMigrations(db);
}

async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = row?.user_version ?? 0;

  for (let version = currentVersion + 1; version <= MIGRATIONS.length; version++) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[version - 1]);
      await db.execAsync(`PRAGMA user_version = ${version}`);
    });
  }
}
