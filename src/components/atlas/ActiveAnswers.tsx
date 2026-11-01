import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { CloseIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import { clearFeatureFilters, type SpeciesFilter } from '@/features/atlas/filterSpecies';
import { clearAnswer, describeAnswer, KEY_STEPS } from '@/features/atlas/identificationKey';
import { durations, radius, spacing, useTheme } from '@/theme';

type ActiveAnswersProps = {
  filter: SpeciesFilter;
  onChange: (filter: SpeciesFilter) => void;
};

const ICON_SIZE = 14;

/** The key's answers as small tags – tap one to drop it, or clear them all. */
export function ActiveAnswers({ filter, onChange }: ActiveAnswersProps) {
  const { colors } = useTheme();
  const answers = KEY_STEPS.flatMap((step) => {
    const label = describeAnswer(filter, step);
    return label ? [{ step, label }] : [];
  });

  if (answers.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {answers.map(({ step, label }) => (
        <Animated.View
          key={step}
          entering={FadeIn.duration(durations.fast)}
          exiting={FadeOut.duration(durations.fast)}
          layout={LinearTransition.duration(durations.base)}
        >
          <PressableScale
            haptic="selection"
            accessibilityRole="button"
            accessibilityLabel={`Usuń: ${label}`}
            onPress={() => onChange(clearAnswer(filter, step))}
            style={[styles.tag, { backgroundColor: colors.primaryMuted }]}
          >
            <AppText variant="label">{label}</AppText>
            <CloseIcon color={colors.textMuted} size={ICON_SIZE} />
          </PressableScale>
        </Animated.View>
      ))}
      <PressableScale
        haptic="selection"
        accessibilityRole="button"
        onPress={() => onChange(clearFeatureFilters(filter))}
        style={styles.clear}
      >
        <AppText variant="label" color="accent">
          Wyczyść
        </AppText>
      </PressableScale>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
  },
  clear: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
