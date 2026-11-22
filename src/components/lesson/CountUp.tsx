import { useEffect, useState } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { durations, springs } from '@/theme';

type Props = { to: number; prefix?: string; delay?: number };

// The whole count takes about as long as the result cards take to settle.
const COUNT_DURATION = durations.slow * 2;
const POP_SCALE = 1.25;

/** A number that counts up from zero and gives a small pop when it arrives. */
export function CountUp({ to, prefix = '', delay = 0 }: Props) {
  const [value, setValue] = useState(0);
  const scale = useSharedValue<number>(1);
  useEffect(() => {
    if (to <= 0) return;
    const step = Math.max(1, Math.ceil(to / 20));
    let current = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      timer = setInterval(
        () => {
          current = Math.min(to, current + step);
          setValue(current);
          if (current >= to) {
            clearInterval(timer);
            scale.set(
              withSequence(
                withTiming(POP_SCALE, { duration: durations.fast }),
                withSpring(1, springs.press),
              ),
            );
          }
        },
        COUNT_DURATION / Math.ceil(to / step),
      );
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [to, delay, scale]);
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return (
    <Animated.View style={popStyle}>
      <AppText variant="title">
        {prefix}
        {value}
      </AppText>
    </Animated.View>
  );
}
