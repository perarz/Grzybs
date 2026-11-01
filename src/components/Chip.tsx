import { StyleSheet, type TextStyle } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';

import { durations, radius, spacing, typography, useTheme } from '@/theme';

import { PressableScale } from './PressableScale';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

// Reanimated eases between the old and new colours instead of jumping.
const COLOR_TRANSITION: CSSTransitionProperties = {
  transitionProperty: ['backgroundColor', 'borderColor'],
  transitionDuration: durations.fast,
  transitionTimingFunction: 'ease-out',
};
const TEXT_TRANSITION: CSSTransitionProperties<TextStyle> = {
  transitionProperty: 'color',
  transitionDuration: durations.fast,
  transitionTimingFunction: 'ease-out',
};

/** A typewritten tag – filled with ink when selected. */
export function Chip({ label, selected, onPress }: ChipProps) {
  const { colors } = useTheme();

  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.chip,
          COLOR_TRANSITION,
          {
            backgroundColor: selected ? colors.primary : colors.surface,
            borderColor: selected ? colors.primary : colors.border,
          },
        ]}
      >
        <Animated.Text
          style={[
            typography.label,
            TEXT_TRANSITION,
            { color: selected ? colors.onPrimary : colors.text },
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
