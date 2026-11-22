import type { ReactNode } from 'react';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { durations } from '@/theme';

/** Rises into place a moment after the section above it – Start builds itself top to bottom. */
export function StaggeredIn({ order, children }: { order: number; children: ReactNode }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(order * durations.fast)
        .duration(durations.slow)
        .reduceMotion(ReduceMotion.System)}
    >
      {children}
    </Animated.View>
  );
}
