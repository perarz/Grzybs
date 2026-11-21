import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import type { Species } from '@/features/atlas/types';
import { durations, layout, spacing, useTheme } from '@/theme';
import { FeatureSummary } from './FeatureSummary';

export function SpeciesDetails({ species }: { species: Species }) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  return (
    <View style={[styles.section, { borderColor: colors.border }]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={styles.toggle}
      >
        <AppText variant="button">{open ? 'Zwiń szczegóły' : 'Więcej o gatunku'}</AppText>
        <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <FieldIcon name="chevron" size={18} color={colors.primary} />
        </View>
      </PressableScale>
      {open && (
        <Animated.View
          entering={FadeIn.duration(durations.fast).reduceMotion(ReduceMotion.System)}
          style={styles.content}
        >
          <AppText>{species.description}</AppText>
          <FeatureSummary species={species} />
        </Animated.View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  section: { borderTopWidth: StyleSheet.hairlineWidth },
  toggle: {
    minHeight: layout.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  content: { gap: spacing.lg, paddingTop: spacing.sm },
});
