import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { readSoundsEnabled, saveSoundsEnabled } from '@/features/feedback/settings';
import { spacing, useTheme } from '@/theme';

/** Turns the lesson sounds on or off; the choice is kept on the phone. */
export function SettingsSounds() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    readSoundsEnabled(db)
      .then((value) => {
        if (active) setEnabled(value);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [db]);

  function toggle(value: boolean) {
    const previous = enabled;
    setEnabled(value);
    setError(false);
    saveSoundsEnabled(db, value).catch(() => {
      setEnabled(previous);
      setError(true);
    });
  }

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <AppText variant="bodyStrong" style={styles.label}>
          Dźwięki w lekcjach
        </AppText>
        <Switch
          accessibilityLabel="Dźwięki w lekcjach"
          value={enabled ?? false}
          disabled={enabled === null}
          onValueChange={toggle}
          trackColor={{ true: colors.primary, false: colors.border }}
        />
      </View>
      <AppText variant="caption" color="textMuted">
        Krótki sygnał przy dobrej i złej odpowiedzi oraz na koniec lekcji.
      </AppText>
      {error ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          Nie udało się zapisać ustawienia.
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { flex: 1 },
});
