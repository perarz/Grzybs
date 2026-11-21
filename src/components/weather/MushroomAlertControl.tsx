import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { AppText } from '@/components/AppText';
import {
  checkMushroomAlert,
  readAlertSettings,
  setMushroomAlerts,
} from '@/features/weather/alerts';
import type { WeatherForecast } from '@/features/weather/types';
import { spacing, useTheme } from '@/theme';

export function MushroomAlertControl({ forecast }: { forecast: WeatherForecast | null }) {
  const { colors } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  useEffect(() => {
    let active = true;
    readAlertSettings()
      .then((value) => {
        if (active) setEnabled(Boolean(value?.enabled));
      })
      .catch(() => {
        if (active) setError('Nie udało się odczytać ustawień alertów.');
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function toggle(value: boolean) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      await setMushroomAlerts(value, forecast?.point ?? null);
      setEnabled(value);
      if (value) void checkMushroomAlert(forecast ?? undefined).catch(() => undefined);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Nie udało się zmienić ustawień.');
      const current = await readAlertSettings().catch(() => null);
      setEnabled(Boolean(current?.enabled));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <AppText variant="bodyStrong" style={styles.label}>
          Daj znać, gdy warto
        </AppText>
        <Switch
          accessibilityLabel="Powiadomienia o dobrych warunkach na grzyby"
          value={enabled}
          disabled={busy}
          onValueChange={(value) => void toggle(value)}
          trackColor={{ true: colors.primary, false: colors.border }}
        />
      </View>
      <AppText variant="caption" color="textMuted">
        Od 7/10 · raz dziennie · 8–17, minimum godzinę przed zachodem. Dla ostatnio wybranej
        okolicy; aktualizuj ją na mapie co tydzień.
      </AppText>
      {error && (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          {error}
        </AppText>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  section: { gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { flex: 1 },
});
