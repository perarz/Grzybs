import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { LearnGradient } from '@/components/learn/LearnGradient';
import { COURSE_LENGTH } from '@/features/learn/course';
import { useCourseProgress } from '@/features/learn/useCourseProgress';
import { durations, layout, radius, spacing, useTheme } from '@/theme';

/** The way into the course: a lake-coloured card with the learner's progress. */
export function LearnCard() {
  const { colors } = useTheme();
  const course = useCourseProgress();
  const done = course.completed?.length ?? 0;
  const share = Math.min(1, done / COURSE_LENGTH);
  // The bar fills up from empty each time Start opens – progress you can see growing.
  const fill = useSharedValue<number>(0);
  useEffect(() => {
    fill.set(withTiming(share, { duration: durations.slow * 3 }));
  }, [fill, share]);
  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.get() * 100}%` }));
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Otwórz naukę"
      onPress={() => router.push('/learn')}
      style={[styles.card, { borderColor: colors.aqua }]}
    >
      <LearnGradient />
      <View style={[styles.symbol, { borderColor: colors.aqua }]}>
        <FieldIcon name="book" size={layout.icon} color={colors.aqua} />
      </View>
      <View style={styles.label}>
        <AppText variant="heading">Nauka</AppText>
        <AppText variant="caption" color="textMuted">
          {done
            ? `Ukończono ${done} z ${COURSE_LENGTH} · ${course.xp} XP`
            : 'Krótkie lekcje krok po kroku.'}
        </AppText>
        <View style={[styles.track, { backgroundColor: colors.background }]}>
          <Animated.View style={[styles.fill, { backgroundColor: colors.aqua }, fillStyle]} />
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: layout.accentStroke,
    overflow: 'hidden',
  },
  symbol: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.md,
    borderWidth: layout.accentStroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, gap: spacing.xs },
  track: { height: spacing.xs, borderRadius: radius.xs, overflow: 'hidden', marginTop: spacing.xs },
  fill: { height: '100%' },
});
