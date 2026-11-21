import type { SQLiteDatabase } from 'expo-sqlite';

import { weatherKey } from './point';
import type { WeatherForecast, WeatherPoint } from './types';
import { parseForecast } from './validation';

export async function readWeatherCache(
  db: SQLiteDatabase,
  point: WeatherPoint,
): Promise<WeatherForecast | null> {
  const key = weatherKey(point);
  const row = await db.getFirstAsync<{ payload: string; fetched_at: number }>(
    'SELECT payload, fetched_at FROM weather_cache WHERE location_key = ?',
    key,
  );
  if (!row) return null;
  try {
    const forecast = parseForecast(JSON.parse(row.payload));
    return weatherKey(forecast.point) === key && forecast.fetchedAt === row.fetched_at
      ? forecast
      : null;
  } catch {
    return null;
  }
}
export async function writeWeatherCache(
  db: SQLiteDatabase,
  forecast: WeatherForecast,
): Promise<void> {
  const validated = parseForecast(forecast);
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO weather_cache (location_key, payload, fetched_at) VALUES (?, ?, ?)
       ON CONFLICT(location_key) DO UPDATE SET payload = excluded.payload, fetched_at = excluded.fetched_at
       WHERE excluded.fetched_at >= weather_cache.fetched_at`,
      weatherKey(validated.point),
      JSON.stringify(validated),
      validated.fetchedAt,
    );
    await db.runAsync(`DELETE FROM weather_cache WHERE location_key NOT IN
      (SELECT location_key FROM weather_cache ORDER BY fetched_at DESC, location_key ASC LIMIT 10)`);
  });
}
