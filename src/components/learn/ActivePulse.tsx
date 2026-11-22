import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { layout, radius, useTheme } from '@/theme';

const WAVE_DURATION = 1800;
const BLINK_DURATION = 700;

function useWave(progress: SharedValue<number>, delay: number) {
  useEffect(() => {
    progress.set(
      withDelay(
        delay,
        withRepeat(withTiming(1, { duration: WAVE_DURATION, easing: Easing.out(Easing.quad) }), -1),
      ),
    );
  }, [progress, delay]);
  return useAnimatedStyle(() => ({
    opacity: 0.6 * (1 - progress.get()),
    transform: [{ scale: 1 + progress.get() * 0.6 }],
  }));
}

/** The lesson waiting for the learner: a blinking rim and two waves rolling out of it. */
export function ActivePulse() {
  const { colors } = useTheme();
  const first = useSharedValue<number>(0);
  const second = useSharedValue<number>(0);
  const blink = useSharedValue<number>(1);
  const firstWave = useWave(first, 0);
  const secondWave = useWave(second, WAVE_DURATION / 2);
  useEffect(() => {
    blink.set(
      withRepeat(
        withTiming(0.25, { duration: BLINK_DURATION, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
  }, [blink]);
  const rimStyle = useAnimatedStyle(() => ({ opacity: blink.get() }));
  const fill = [StyleSheet.absoluteFill, styles.round];
  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[fill, { backgroundColor: colors.glow }, firstWave]}
      />
      <Animated.View
        pointerEvents="none"
        style={[fill, { backgroundColor: colors.glow }, secondWave]}
      />
      <Animated.View
        pointerEvents="none"
        style={[fill, styles.rim, { borderColor: colors.glow }, rimStyle]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  round: { borderRadius: radius.pill },
  rim: { borderWidth: layout.courseStroke },
});
