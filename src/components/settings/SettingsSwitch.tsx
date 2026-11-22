import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { readSetting, saveSetting, type FeedbackSetting } from '@/features/feedback/settings';
import { spacing, useTheme } from '@/theme';

type Props = {
  setting: FeedbackSetting;
  title: string;
  description: string;
  /** Called after a change, e.g. to apply it right away. */
  onChange?: (enabled: boolean) => void;
};

/** One on/off preference; the choice is kept on the phone. */
export function SettingsSwitch({ setting, title, description, onChange }: Props) {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    readSetting(db, setting)
      .then((value) => {
        if (active) setEnabled(value);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [db, setting]);

  function toggle(value: boolean) {
    const previous = enabled;
    setEnabled(value);
    setError(false);
    onChange?.(value);
    saveSetting(db, setting, value).catch(() => {
      setEnabled(previous);
      if (previous !== null) onChange?.(previous);
      setError(true);
    });
  }

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <AppText variant="bodyStrong" style={styles.label}>
          {title}
        </AppText>
        <Switch
          accessibilityLabel={title}
          value={enabled ?? false}
          disabled={enabled === null}
          onValueChange={toggle}
          trackColor={{ true: colors.season, false: colors.border }}
          thumbColor={enabled ? colors.glow : colors.textMuted}
        />
      </View>
      <AppText variant="caption" color="textMuted">
        {description}
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
