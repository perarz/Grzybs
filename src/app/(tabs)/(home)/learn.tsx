import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { CoursePath } from '@/components/learn/CoursePath';
import { StreakCalendar } from '@/components/learn/StreakCalendar';
import { PressableScale } from '@/components/PressableScale';
import { useCourseProgress } from '@/features/learn/useCourseProgress';
import { useLearningJourney } from '@/features/learn/useLearningJourney';
import { LESSONS_PER_STAGE } from '@/features/learn/course';
import { LEVELS } from '@/features/learn/journey';
import { layout, spacing, useTheme } from '@/theme';

export default function LearnScreen() {
  const course = useCourseProgress();
  const { journey, error: streakError, retry } = useLearningJourney(false);
  const { colors } = useTheme();
  const [calendarOpen, setCalendarOpen] = useState(false);
  // Every finished stage (four lessons and its test) earns the next rank.
  const rank = LEVELS[Math.min(5, Math.floor((course.completed?.length ?? 0) / LESSONS_PER_STAGE))];
  return (
    <Screen title="Nauka" eyebrow="Krok po kroku" showBack>
      <View style={styles.summary}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Pokaż kalendarz passy"
          disabled={!journey}
          onPress={() => setCalendarOpen(true)}
          style={styles.stat}
        >
          <FieldIcon name="flame" size={spacing.xl} color={colors.glow} />
          <AppText variant="heading">{streakError ? '—' : (journey?.streak ?? '…')}</AppText>
          <AppText color="textMuted">{journey?.streak === 1 ? 'dzień passy' : 'dni passy'}</AppText>
        </PressableScale>
        <View style={styles.stat}>
          <FieldIcon name="mushrooms" size={spacing.lg} color={colors.glow} />
          <AppText variant="bodyStrong">{course.completed ? `${course.xp} XP` : '…'}</AppText>
        </View>
        <View style={styles.stat}>
          <FieldIcon name="trophy" size={spacing.lg} color={colors.glow} />
          <AppText variant="bodyStrong">{course.completed ? rank.name : '…'}</AppText>
        </View>
      </View>
      {streakError && <Button label="Odśwież passę" variant="secondary" onPress={retry} />}
      {course.error ? (
        <View style={styles.error}>
          <AppText color="danger">Nie udało się odczytać ścieżki.</AppText>
          <Button label="Spróbuj ponownie" onPress={course.retry} />
        </View>
      ) : course.completed ? (
        <CoursePath completed={course.completed} />
      ) : (
        <AppText color="textMuted">Wczytuję ścieżkę…</AppText>
      )}
      {calendarOpen && journey && (
        <StreakCalendar journey={journey} onClose={() => setCalendarOpen(false)} />
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: layout.touchTarget,
  },
  error: { gap: spacing.md },
});
