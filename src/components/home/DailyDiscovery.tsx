import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { successHaptic } from '@/features/feedback/haptics';
import { useDailySpecies } from '@/features/learn/useDailySpecies';
import { layout, radius, spacing, useTheme } from '@/theme';
import { DailySpeciesDialog } from './DailySpeciesDialog';
import { MysteryMark } from './MysteryMark';

/** Today's mushroom is always a question mark on Start; a tap opens it in its own window. */
export function DailyDiscovery() {
  const species = useDailySpecies();
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  return (
    <>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Odkryj grzyb dnia"
        onPress={() => {
          successHaptic();
          setOpen(true);
        }}
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        {/* An empty specimen frame waiting for today's find. */}
        <View style={[styles.frame, { borderColor: colors.glow }]}>
          <MysteryMark />
        </View>
        <View style={styles.copy}>
          <AppText variant="label" color="accent">
            Grzyb dnia
          </AppText>
          <AppText variant="heading">Jaki grzyb dziś?</AppText>
          <AppText variant="caption" color="textMuted">
            Dotknij, aby odkryć
          </AppText>
        </View>
        <FieldIcon name="mushroom" size={layout.icon} color={colors.border} />
      </PressableScale>
      {open && <DailySpeciesDialog species={species} onClose={() => setOpen(false)} />}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  frame: {
    width: layout.thumbnail,
    height: layout.thumbnail,
    borderRadius: radius.md,
    borderWidth: layout.accentStroke,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: spacing.xs },
});
