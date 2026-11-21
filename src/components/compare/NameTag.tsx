import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { radius, spacing, useTheme } from '@/theme';

type NameTagProps = {
  label: string;
  side: 'left' | 'right';
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

/** A species name pinned to the bottom corner of a photo. */
export function NameTag({ label, side, style }: NameTagProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      style={[
        styles.tag,
        side === 'left' ? styles.left : styles.right,
        { backgroundColor: colors.surface },
        style,
      ]}
    >
      <AppText variant="label" numberOfLines={2}>
        {label}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tag: {
    position: 'absolute',
    bottom: spacing.sm,
    maxWidth: '45%',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    pointerEvents: 'none',
  },
  left: {
    left: spacing.sm,
  },
  right: {
    right: spacing.sm,
  },
});
