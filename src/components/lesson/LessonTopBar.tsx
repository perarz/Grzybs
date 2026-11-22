import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { CloseIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import { layout, radius, spacing, springs, useTheme } from '@/theme';

type LessonTopBarProps = {
  progress: number;
  combo: number;
  onClose: () => void;
};

const BAR_HEIGHT = 14;
const CLOSE_ICON_SIZE = 26;

/** Close, a progress bar that fills with every finished card, and the current answer streak. */
export function LessonTopBar({ progress, combo, onClose }: LessonTopBarProps) {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  const fill = useSharedValue(progress);

  useEffect(() => {
    fill.set(withSpring(progress, springs.settle));
  }, [fill, progress]);
  const fillStyle = useAnimatedStyle(() => ({ width: `${Math.max(0, fill.get()) * 100}%` }));

  return (
    <View style={[styles.bar, { paddingTop: top + spacing.sm }]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Przerwij lekcję"
        hitSlop={spacing.md}
        onPress={onClose}
        style={styles.close}
      >
        <CloseIcon color={colors.textMuted} size={CLOSE_ICON_SIZE} />
      </PressableScale>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        style={[styles.track, { backgroundColor: colors.surfaceMuted }]}
      >
        <Animated.View style={[styles.fill, fillStyle]}>
          {/* Moss green flowing into aqua – the colour of learning, as a light accent. */}
          <Svg style={StyleSheet.absoluteFill} accessible={false}>
            <Defs>
              <LinearGradient id="lessonProgress" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={colors.glow} />
                <Stop offset="1" stopColor={colors.aqua} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#lessonProgress)" />
          </Svg>
          <View style={[styles.shine, { backgroundColor: colors.onForest }]} />
        </Animated.View>
      </View>
      <View style={styles.combo}>
        {combo >= 2 ? (
          <Animated.View
            key={combo}
            entering={ZoomIn.springify().damping(springs.press.damping)}
            exiting={ZoomOut}
            style={styles.comboRow}
            accessibilityLabel={`${combo} poprawne z rzędu`}
          >
            <FieldIcon name="flame" size={layout.icon} color={colors.glow} />
            <AppText variant="bodyStrong" color="accent">
              {combo}
            </AppText>
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  close: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { flex: 1, height: BAR_HEIGHT, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, overflow: 'hidden' },
  // A light streak on top of the fill, like the gloss on a progress bar in a game.
  shine: {
    height: BAR_HEIGHT / 4,
    marginTop: BAR_HEIGHT / 5,
    marginHorizontal: spacing.sm,
    borderRadius: radius.pill,
    opacity: 0.35,
  },
  combo: { width: layout.touchTarget, alignItems: 'flex-end' },
  comboRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
