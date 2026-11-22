import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { COURSE_LENGTH } from '@/features/learn/course';
import { useCourseProgress } from '@/features/learn/useCourseProgress';
import { layout, radius, spacing, useTheme } from '@/theme';

/** The way into the course: a lake-coloured card with the learner's progress. */
export function LearnCard() {
  const { colors } = useTheme();
  const course = useCourseProgress();
  const done = course.completed?.length ?? 0;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Otwórz naukę"
      onPress={() => router.push('/learn')}
      style={[styles.card, { borderColor: colors.aqua }]}
    >
      <Svg style={StyleSheet.absoluteFill} accessible={false}>
        <Defs>
          <LinearGradient id="learnCard" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.learnStart} />
            <Stop offset="0.55" stopColor={colors.learnMiddle} />
            <Stop offset="1" stopColor={colors.learnEnd} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#learnCard)" />
      </Svg>
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
          <View
            style={[
              styles.fill,
              {
                backgroundColor: colors.aqua,
                width: `${Math.min(1, done / COURSE_LENGTH) * 100}%`,
              },
            ]}
          />
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
