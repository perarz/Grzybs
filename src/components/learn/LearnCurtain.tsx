import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';
import { AppText } from '@/components/AppText';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { durations, layout, radius, spacing, springs, useTheme } from '@/theme';

// How long the curtain stays, then how long it takes to lift away.
const HOLD = durations.slow + durations.fast;
const LIFT = durations.slow + durations.base;
// If the path takes longer than this (a slow phone), the curtain lifts anyway.
const MAX_WAIT = 3000;

/** The way into Nauka: a lake-blue curtain with the book, lifting once the path is `ready`. */
export function LearnCurtain({ ready }: { ready: SharedValue<boolean> }) {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(!reducedMotion);
  const appear = useSharedValue<number>(0);
  const wave = useSharedValue<number>(0);
  const lift = useSharedValue<number>(0);

  useEffect(() => {
    if (!visible) return;
    appear.set(withSpring(1, springs.settle));
    wave.set(withTiming(1, { duration: HOLD + LIFT, easing: Easing.out(Easing.quad) }));
  }, [visible, appear, wave]);

  // Lifts after a short hold once the path is drawn – or after MAX_WAIT on a slow phone.
  function liftAfter(delay: number) {
    'worklet';
    lift.set(
      withDelay(
        delay,
        withTiming(1, { duration: LIFT, easing: Easing.inOut(Easing.cubic) }, (finished) => {
          if (finished) scheduleOnRN(setVisible, false);
        }),
      ),
    );
  }
  useEffect(() => {
    if (visible) liftAfter(MAX_WAIT);
    // Runs once on mount; the reaction below takes over when the path is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useAnimatedReaction(
    () => ready.get(),
    (isReady, wasReady) => {
      if (isReady && !wasReady) liftAfter(HOLD);
    },
  );

  const curtainStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -lift.get() * height }],
  }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: appear.get(),
    transform: [{ scale: 0.7 + appear.get() * 0.3 }],
  }));
  const waveStyle = useAnimatedStyle(() => ({
    opacity: 0.7 * (1 - wave.get()),
    transform: [{ scale: 1 + wave.get() * 1.6 }],
  }));

  if (!visible) return null;
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, curtainStyle]}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="learnCurtain" x1="0" y1="0" x2="0.4" y2="1">
            <Stop offset="0" stopColor={colors.learnStart} />
            <Stop offset="0.5" stopColor={colors.learnMiddle} />
            <Stop offset="1" stopColor={colors.learnEnd} />
          </LinearGradient>
          {/* Water rising from the bottom – the curtain should read as clearly blue, not black. */}
          <LinearGradient id="learnWater" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0.2" stopColor={colors.aqua} stopOpacity="0" />
            <Stop offset="1" stopColor={colors.aqua} stopOpacity="0.45" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#learnCurtain)" />
        <Rect width="100%" height="100%" fill="url(#learnWater)" />
      </Svg>
      <View style={styles.center}>
        <View style={styles.badgeBox}>
          <Animated.View style={[styles.badge, { borderColor: colors.aqua }, waveStyle]} />
          <Animated.View style={[styles.badge, { borderColor: colors.aqua }, contentStyle]}>
            <FieldIcon name="book" size={spacing.xxl} color={colors.aqua} />
          </Animated.View>
        </View>
        <Animated.View style={[styles.title, contentStyle]}>
          <AppText variant="display">Nauka</AppText>
          <AppText variant="label" color="textMuted">
            Krok po kroku
          </AppText>
        </Animated.View>
      </View>
      <View style={[styles.edge, { backgroundColor: colors.aqua }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  badgeBox: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    width: layout.courseNode,
    height: layout.courseNode,
    borderRadius: radius.lg,
    borderWidth: layout.accentStroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { alignItems: 'center', gap: spacing.xs, marginTop: layout.courseNode },
  edge: { height: layout.accentStroke },
});
