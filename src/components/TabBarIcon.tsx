import type { ReactNode } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { durations } from '@/theme';

type TabBarIconProps = {
  focused: boolean;
  children: ReactNode;
};

const FOCUSED_SCALE = 1.06;

export function TabBarIcon({ focused, children }: TabBarIconProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(focused ? FOCUSED_SCALE : 1, { duration: durations.base }) }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
