import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { MushroomAlertControl } from '@/components/weather/MushroomAlertControl';
import { AppText } from '@/components/AppText';
import { parseForecast } from '@/features/weather/validation';
import type { WeatherForecast } from '@/features/weather/types';

export function SettingsNotifications() {
  const db = useSQLiteContext();
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    db.getFirstAsync<{ payload: string }>(
      'SELECT payload FROM weather_cache ORDER BY fetched_at DESC LIMIT 1',
    )
      .then((row) => {
        if (!active || !row) return;
        const saved = parseForecast(JSON.parse(row.payload));
        if (Date.now() - saved.fetchedAt < 7 * 86400000) setForecast(saved);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [db]);
  if (loading) return <AppText color="textMuted">Wczytuję ustawienia…</AppText>;
  return (
    <>
      <MushroomAlertControl forecast={forecast} />
      {error && (
        <AppText variant="caption" color="danger">
          Nie udało się odczytać okolicy. Otwórz mapę, aby ją odświeżyć.
        </AppText>
      )}
    </>
  );
}
