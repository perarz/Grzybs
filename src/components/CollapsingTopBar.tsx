import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing, typography, useTheme } from '@/theme';

type CollapsingTopBarProps = {
  /** How far the screen below is scrolled. */
  scrollY: SharedValue<number>;
  title: string;
  /** Scroll distance at which the large title has gone and the small one takes over. */
  revealAt: number;
  left?: ReactNode;
  right?: ReactNode;
};

export const TOP_BAR_HEIGHT = 52;
const FADE_DISTANCE = 28;
const TITLE_SLIDE = 8;

/**
 * Invisible at the top of the screen. Once the large title scrolls away, a paper bar
 * with a small title fades in – it also keeps content from sliding under the status bar.
 */
export function CollapsingTopBar({ scrollY, title, revealAt, left, right }: CollapsingTopBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.get(),
      [revealAt - FADE_DISTANCE, revealAt],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));
  const titleStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.get(),
      [revealAt - FADE_DISTANCE / 2, revealAt + FADE_DISTANCE / 2],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity: progress, transform: [{ translateY: (1 - progress) * TITLE_SLIDE }] };
  });

  return (
    <View style={[styles.bar, { height: insets.top + TOP_BAR_HEIGHT, paddingTop: insets.top }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.sky, borderBottomColor: colors.border },
          styles.background,
          backgroundStyle,
        ]}
      />
      <View pointerEvents="box-none" style={styles.side}>
        {left}
      </View>
      <Animated.Text
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        numberOfLines={1}
        style={[typography.heading, styles.title, { color: colors.text }, titleStyle]}
      >
        {title}
      </Animated.Text>
      <View pointerEvents="box-none" style={styles.right}>
        {right}
      </View>
    </View>
  );
}

const SIDE_WIDTH = 56;

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    // Touches pass through the empty bar to the content below, but not through the back button.
    pointerEvents: 'box-none',
  },
  background: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  right: { width: SIDE_WIDTH, alignItems: 'center' },
  side: {
    width: SIDE_WIDTH,
    paddingLeft: spacing.lg,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    pointerEvents: 'none',
  },
});
