import type { ReactNode } from 'react';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

type TabBarIconProps = {
  focused: boolean;
  children: ReactNode;
};

const FOCUSED_SCALE = 1.15;

export function TabBarIcon({ focused, children }: TabBarIconProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? FOCUSED_SCALE : 1, { damping: 12 }) }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
