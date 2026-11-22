import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { successHaptic } from '@/features/feedback/haptics';
import { useDailySpecies } from '@/features/learn/useDailySpecies';
import { layout, radius, spacing, useTheme } from '@/theme';
import { DailySpeciesDialog } from './DailySpeciesDialog';

/** Today's mushroom is always a question mark on Start; a tap opens it in its own window. */
export function DailyDiscovery() {
  const species = useDailySpecies();
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <AppText variant="label" color="textMuted">
        Grzyb dnia
      </AppText>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Odkryj grzyb dnia"
        onPress={() => {
          successHaptic();
          setOpen(true);
        }}
        style={styles.row}
      >
        <View style={[styles.mystery, { backgroundColor: colors.surfaceMuted }]}>
          <AppText variant="title" color="accent">
            ?
          </AppText>
        </View>
        <View style={styles.copy}>
          <AppText variant="heading">Jaki grzyb dziś?</AppText>
          <AppText variant="caption" color="textMuted">
            Dotknij, aby odkryć
          </AppText>
        </View>
      </PressableScale>
      <View style={[styles.rule, { backgroundColor: colors.border }]} />
      {open && <DailySpeciesDialog species={species} onClose={() => setOpen(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  mystery: {
    width: layout.thumbnail,
    height: layout.thumbnail,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rule: { height: StyleSheet.hairlineWidth, marginTop: spacing.xs },
});
