import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { selectionHaptic, tapHaptic } from '@/features/feedback/haptics';
import { PRESSED_SCALE, springs } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  haptic?: 'tap' | 'selection' | 'none';
  /** Big elements should shrink less than small ones. */
  pressedScale?: number;
};

/** The app's only pressable: it gives way under the finger and answers with a haptic. */
export function PressableScale({
  style,
  children,
  haptic = 'tap',
  pressedScale = PRESSED_SCALE,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(event) => {
        scale.set(withSpring(pressedScale, springs.press));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, springs.press));
        onPressOut?.(event);
      }}
      onPress={(event) => {
        if (haptic === 'tap') tapHaptic();
        if (haptic === 'selection') selectionHaptic();
        onPress?.(event);
      }}
      style={[style, scaleStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
