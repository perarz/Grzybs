import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { durations, spacing } from '@/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

// The bar is always on screen, so its motion stays calm: no springs, no press bounce.
const NO_PRESS_SCALE = 1;
const ACTIVE_ICON_SCALE = 1.15;

type Props = {
  label: string;
  focused: boolean;
  color: string;
  icon: ReactNode;
  onPress: () => void;
};

/** One tab: its icon grows a little and lifts when the tab is open. */
export function TabBarItem({ label, focused, color, icon, onPress }: Props) {
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(focused ? ACTIVE_ICON_SCALE : 1, { duration: durations.base }) },
      { translateY: withTiming(focused ? -spacing.xs / 2 : 0, { duration: durations.base }) },
    ],
  }));
  return (
    <PressableScale
      haptic="none"
      pressedScale={NO_PRESS_SCALE}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.tab}
    >
      <Animated.View style={iconStyle}>{icon}</Animated.View>
      <AppText variant="label" style={{ color }}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
});
