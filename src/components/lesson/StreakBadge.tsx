import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { LearnGradient } from '@/components/learn/LearnGradient';
import { durations, layout, radius, spacing, springs, useTheme } from '@/theme';

type Props = { before: number; after: number; grows: boolean; delay: number };

const HOP = spacing.md;

function days(count: number) {
  return count === 1 ? 'dzień' : 'dni';
}

/** The daily streak on the result screen; the flame hops when this lesson made it longer. */
export function StreakBadge({ before, after, grows, delay }: Props) {
  const { colors } = useTheme();
  const hop = useSharedValue<number>(0);
  useEffect(() => {
    if (!grows) return;
    hop.set(
      withDelay(
        delay,
        withRepeat(
          withSequence(withTiming(1, { duration: durations.base }), withSpring(0, springs.press)),
          2,
        ),
      ),
    );
  }, [grows, delay, hop]);
  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -hop.get() * HOP }, { scale: 1 + hop.get() * 0.3 }],
  }));
  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      {grows && <LearnGradient />}
      <Animated.View style={flameStyle}>
        <FieldIcon name="flame" size={layout.icon} color={colors.glow} />
      </Animated.View>
      <View style={styles.text}>
        <AppText variant="bodyStrong">
          {grows
            ? `Passa rośnie: ${before} → ${after} ${days(after)}`
            : `Passa: ${after} ${days(after)}`}
        </AppText>
        <AppText variant="caption" color="textMuted">
          {grows
            ? 'Pierwsza lekcja dzisiaj – wróć jutro, by ją przedłużyć.'
            : 'Dzisiejszy dzień już się liczy.'}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  text: { flex: 1, gap: spacing.xs },
});
