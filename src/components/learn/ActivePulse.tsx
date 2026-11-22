import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { radius, useTheme } from '@/theme';

const PULSE_DURATION = 1600;

/** A soft ring that keeps growing out of the lesson waiting for the learner. */
export function ActivePulse() {
  const { colors } = useTheme();
  const progress = useSharedValue<number>(0);
  useEffect(() => {
    progress.set(
      withRepeat(withTiming(1, { duration: PULSE_DURATION, easing: Easing.out(Easing.quad) }), -1),
    );
  }, [progress]);
  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.55 * (1 - progress.get()),
    transform: [{ scale: 1 + progress.get() * 0.35 }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.ring, { backgroundColor: colors.glow }, ringStyle]}
    />
  );
}

const styles = StyleSheet.create({
  ring: { borderRadius: radius.pill },
});
