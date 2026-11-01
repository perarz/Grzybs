import { StyleSheet, View } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';

import { PressableScale } from '@/components/PressableScale';
import type { SpeciesFilter } from '@/features/atlas/filterSpecies';
import { describeAnswer, KEY_QUESTIONS, KEY_STEPS } from '@/features/atlas/identificationKey';
import { durations, radius, spacing, useTheme } from '@/theme';

type KeyProgressProps = {
  currentIndex: number;
  filter: SpeciesFilter;
  onJump: (index: number) => void;
};

const SEGMENT_HEIGHT = 4;
const SEGMENT_TRANSITION: CSSTransitionProperties = {
  transitionProperty: 'backgroundColor',
  transitionDuration: durations.base,
};

/** One segment per question: amber – now, green – answered, grey – still open. Tap to jump. */
export function KeyProgress({ currentIndex, filter, onJump }: KeyProgressProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {KEY_STEPS.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isAnswered = describeAnswer(filter, step) !== null;
        const color = isCurrent ? colors.accent : isAnswered ? colors.season : colors.border;
        return (
          <PressableScale
            key={step}
            haptic="selection"
            accessibilityRole="button"
            accessibilityLabel={`Pytanie ${index + 1}: ${KEY_QUESTIONS[step].question}`}
            hitSlop={spacing.sm}
            onPress={() => onJump(index)}
            style={styles.segmentHitArea}
          >
            <Animated.View
              style={[styles.segment, SEGMENT_TRANSITION, { backgroundColor: color }]}
            />
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  segmentHitArea: {
    flex: 1,
  },
  segment: {
    height: SEGMENT_HEIGHT,
    borderRadius: radius.pill,
  },
});
