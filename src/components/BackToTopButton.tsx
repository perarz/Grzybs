import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';
import { durations, layout, radius, spacing, useTheme } from '@/theme';
import { PressableScale } from './PressableScale';
import { FieldIcon } from './icons/FieldIcon';

/** A round button floating at the bottom of a long page. */
export function BackToTopButton({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(durations.fast).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(durations.fast).reduceMotion(ReduceMotion.System)}
      style={styles.toTop}
    >
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Wróć na górę atlasu"
        onPress={onPress}
        style={[styles.topButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <FieldIcon name="arrowUp" size={23} color={colors.text} />
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toTop: { position: 'absolute', bottom: spacing.lg, alignSelf: 'center' },
  topButton: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.pill,
    borderWidth: 1,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
