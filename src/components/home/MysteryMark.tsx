import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { durations } from '@/theme';

// A short wiggle every few seconds – enough to invite a tap, too rare to be annoying.
const PAUSE = 3200;
const TILT = 10;
const swing = (angle: number) =>
  withTiming(angle, { duration: durations.fast, easing: Easing.inOut(Easing.quad) });

/** The question mark of the hidden daily mushroom, now and then shaking like a curious leaf. */
export function MysteryMark() {
  const reducedMotion = useReducedMotion();
  const tilt = useSharedValue<number>(0);
  useEffect(() => {
    if (reducedMotion) return;
    tilt.set(
      withRepeat(
        withSequence(withDelay(PAUSE, swing(-TILT)), swing(TILT), swing(-TILT / 2), swing(0)),
        -1,
      ),
    );
  }, [reducedMotion, tilt]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${tilt.get()}deg` }] }));
  return (
    <Animated.View style={style}>
      <AppText variant="title" color="accent">
        ?
      </AppText>
    </Animated.View>
  );
}
