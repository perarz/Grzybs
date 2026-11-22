import { useEffect, useState } from 'react';
import { Modal, StyleSheet, useWindowDimensions, View } from 'react-native';
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

// Appear over Start, wait a moment once the path is drawn, then lift away to show it.
const RISE = durations.base;
// How far below its place the curtain starts, as a share of the screen.
const RISE_SHARE = 0.1;
const HOLD = durations.slow;
const LIFT = durations.slow + durations.base;
// If the path takes longer than this (a slow phone), the curtain lifts anyway.
const MAX_WAIT = 3000;
const BADGE = layout.courseNode * 1.4;

/** The way into Nauka: a full-screen lake-blue curtain with the book, lifting once the path is `ready`. */
export function LearnCurtain({ ready }: { ready: SharedValue<boolean> }) {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(!reducedMotion);
  const rise = useSharedValue<number>(1);
  const lift = useSharedValue<number>(0);
  const appear = useSharedValue<number>(0);
  const wave = useSharedValue<number>(0);

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
    if (!visible) return;
    rise.set(withTiming(0, { duration: RISE, easing: Easing.out(Easing.cubic) }));
    appear.set(withDelay(RISE / 2, withSpring(1, springs.settle)));
    wave.set(withDelay(RISE / 2, withTiming(1, { duration: RISE + HOLD + LIFT })));
    liftAfter(RISE + MAX_WAIT);
    // Runs once on mount; the reaction below takes over when the path is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useAnimatedReaction(
    () => ready.get(),
    (isReady, wasReady) => {
      if (isReady && !wasReady) liftAfter(RISE + HOLD);
    },
  );

  // It fades in while rising a little – a full slide would show Start's header above it.
  const curtainStyle = useAnimatedStyle(() => ({
    opacity: 1 - rise.get(),
    transform: [{ translateY: (rise.get() * RISE_SHARE - lift.get()) * height }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: appear.get(),
    transform: [{ scale: 0.6 + appear.get() * 0.4 }],
  }));
  const waveStyle = useAnimatedStyle(() => ({
    opacity: 0.7 * (1 - wave.get()),
    transform: [{ scale: 1 + wave.get() * 2 }],
  }));

  if (!visible) return null;
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent navigationBarTranslucent>
      {/* A solid colour under the gradient: nothing shows through before the SVG is drawn. */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.learnMiddle }, curtainStyle]}
      >
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="learnCurtain" x1="0" y1="0" x2="0.4" y2="1">
              <Stop offset="0" stopColor={colors.learnStart} />
              <Stop offset="0.5" stopColor={colors.learnMiddle} />
              <Stop offset="1" stopColor={colors.learnEnd} />
            </LinearGradient>
            {/* Water rising from the bottom – the curtain reads as clearly blue, not black. */}
            <LinearGradient id="learnWater" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.2" stopColor={colors.aqua} stopOpacity="0" />
              <Stop offset="1" stopColor={colors.aqua} stopOpacity="0.45" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#learnCurtain)" />
          <Rect width="100%" height="100%" fill="url(#learnWater)" />
        </Svg>
        <View style={styles.center}>
          <Animated.View style={[styles.badge, { borderColor: colors.aqua }, waveStyle]} />
          <Animated.View style={[styles.badge, { borderColor: colors.aqua }, badgeStyle]}>
            <FieldIcon name="book" size={spacing.xxl + spacing.md} color={colors.aqua} />
          </Animated.View>
          <Animated.View style={[styles.title, badgeStyle]}>
            <AppText variant="display">Nauka</AppText>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    width: BADGE,
    height: BADGE,
    borderRadius: radius.lg,
    borderWidth: layout.accentStroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: BADGE + spacing.xxl * 2 },
});
