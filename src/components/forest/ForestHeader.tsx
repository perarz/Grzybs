import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText } from '@/components/AppText';
import { spacing, typography, useTheme, type ThemeColors } from '@/theme';

import type { TreelineLayer as Layer } from './treeline';
import { TreelineLayer } from './TreelineLayer';

type ForestHeaderProps = {
  scrollY: SharedValue<number>;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  /** Space above the text – the status bar, and the back button if there is one. */
  topPadding: number;
};

const TREELINE_HEIGHT = 64;
// The sun (or the moon at night): a soft disc with a halo fading into the sky.
const SUN_GLOW_RADIUS = 64;
const SUN_OFFSET = 36;
const OVERSCROLL_DISTANCE = 120;
const OVERSCROLL_TITLE_SCALE = 1.08;

// Three rows of spruces, from the misty far one to the dark one right in front of you.
const LAYERS: { name: string; color: keyof ThemeColors; parallax: number; layer: Layer }[] = [
  {
    name: 'far',
    color: 'treeFar',
    parallax: 0.45,
    layer: { groundY: 44, minTreeHeight: 22, maxTreeHeight: 44, spacing: 14, seed: 7 },
  },
  {
    name: 'mid',
    color: 'treeMid',
    parallax: 0.22,
    layer: { groundY: 56, minTreeHeight: 28, maxTreeHeight: 54, spacing: 21, seed: 23 },
  },
  {
    name: 'near',
    color: 'treeNear',
    parallax: 0,
    layer: {
      groundY: TREELINE_HEIGHT,
      minTreeHeight: 32,
      maxTreeHeight: 52,
      spacing: 30,
      seed: 51,
    },
  },
];

/** The top of every main screen: a misty sky with the title, and a forest edge below it. */
export function ForestHeader({ scrollY, title, eyebrow, subtitle, topPadding }: ForestHeaderProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  // Pulling past the top (iOS bounce) gently enlarges the title.
  const titleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollY.get(),
          [-OVERSCROLL_DISTANCE, 0],
          [OVERSCROLL_TITLE_SCALE, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.sky} />
            <Stop offset="1" stopColor={colors.skyHorizon} />
          </LinearGradient>
          <RadialGradient id="sun" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.sun} stopOpacity={1} />
            <Stop offset="0.38" stopColor={colors.sun} stopOpacity={1} />
            <Stop offset="0.48" stopColor={colors.sun} stopOpacity={0.45} />
            <Stop offset="1" stopColor={colors.sun} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#sky)" />
        <Circle
          cx={width - spacing.xl - SUN_OFFSET}
          cy={topPadding + SUN_OFFSET}
          r={SUN_GLOW_RADIUS}
          fill="url(#sun)"
        />
      </Svg>
      <View style={[styles.text, { paddingTop: topPadding }]}>
        {eyebrow ? (
          <AppText variant="label" color="accent">
            {eyebrow}
          </AppText>
        ) : null}
        <Animated.Text
          accessibilityRole="header"
          style={[typography.display, styles.title, { color: colors.text }, titleStyle]}
        >
          {title}
        </Animated.Text>
        {subtitle ? (
          <AppText variant="caption" color="textMuted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={[styles.treeline, { height: TREELINE_HEIGHT }]}>
        {LAYERS.map(({ name, color, parallax, layer }) => (
          <TreelineLayer
            key={name}
            layer={layer}
            color={colors[color]}
            width={width}
            height={TREELINE_HEIGHT}
            scrollY={scrollY}
            parallax={parallax}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  title: {
    transformOrigin: 'left center',
  },
  treeline: {
    overflow: 'hidden',
  },
});
