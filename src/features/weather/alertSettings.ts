import { openDatabaseAsync } from 'expo-sqlite';
import { DATABASE_NAME, initDatabase } from '@/db/initDatabase';
import { isCoordinate } from '@/features/navigation/geo';
import { getWeatherPoint } from './forecast';
import type { WeatherPoint } from './types';

export type AlertSettings = {
  enabled: number;
  latitude: number | null;
  longitude: number | null;
  location_updated_at: number | null;
  last_sent_at: number | null;
};
export async function database() {
  const db = await openDatabaseAsync(DATABASE_NAME);
  await initDatabase(db);
  return db;
}
export async function readAlertSettings() {
  return (await database()).getFirstAsync<AlertSettings>(
    'SELECT * FROM mushroom_alerts WHERE id = 1',
  );
}
export async function updateAlertLocation(point: WeatherPoint) {
  const rounded = getWeatherPoint(point);
  if (!isCoordinate(rounded)) return;
  await (
    await database()
  ).runAsync(
    'UPDATE mushroom_alerts SET latitude = ?, longitude = ?, location_updated_at = ? WHERE id = 1 AND enabled = 1',
    rounded.latitude,
    rounded.longitude,
    Date.now(),
  );
}
