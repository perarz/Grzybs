import { Directory, File, Paths } from 'expo-file-system';
import type { SQLiteDatabase } from 'expo-sqlite';

import type { SpeciesId } from '@/features/atlas/types';

export type Find = { id: number; species_id: SpeciesId; photo_uri: string; found_at: number };

export function readFinds(db: SQLiteDatabase) {
  return db.getAllAsync<Find>(
    'SELECT id, species_id, photo_uri, found_at FROM finds WHERE photo_uri IS NOT NULL ORDER BY found_at DESC, id DESC',
  );
}

export async function saveFind(
  db: SQLiteDatabase,
  speciesId: SpeciesId,
  uri: string,
): Promise<Find> {
  const directory = new Directory(Paths.document, 'finds');
  directory.create({ idempotent: true, intermediates: true });
  const source = new File(uri);
  const now = Date.now();
  const photo = new File(
    directory,
    `${now}-${Math.random().toString(36).slice(2)}${source.extension || '.jpg'}`,
  );
  try {
    await source.copy(photo);
    const result = await db.runAsync(
      'INSERT INTO finds (species_id, photo_uri, found_at, created_at) VALUES (?, ?, ?, ?)',
      speciesId,
      photo.uri,
      now,
      now,
    );
    return {
      id: result.lastInsertRowId,
      species_id: speciesId,
      photo_uri: photo.uri,
      found_at: now,
    };
  } catch (error) {
    // A failed database write must not leave an unused photo behind.
    try {
      if (photo.exists) photo.delete();
    } catch {
      /* Preserve the original save error. */
    }
    throw error;
  }
}

/** Removes a find and its photo. The row goes first: a leftover file is harmless, a row without a photo is not. */
export async function deleteFind(db: SQLiteDatabase, find: Find): Promise<void> {
  await db.runAsync('DELETE FROM finds WHERE id = ?', find.id);
  try {
    const photo = new File(find.photo_uri);
    if (photo.exists) photo.delete();
  } catch {
    // The find is already gone from the collection; a photo left on disk only takes space.
  }
}
