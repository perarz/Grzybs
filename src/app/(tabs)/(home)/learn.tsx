import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { CoursePath } from '@/components/learn/CoursePath';
import { StreakCalendar } from '@/components/learn/StreakCalendar';
import { XpGuide } from '@/components/learn/XpGuide';
import { PressableScale } from '@/components/PressableScale';
import { useCourseProgress } from '@/features/learn/useCourseProgress';
import { useLearningJourney } from '@/features/learn/useLearningJourney';
import { rankIndex } from '@/features/learn/ranks';
import { LEVELS } from '@/features/learn/journey';
import { layout, spacing, useTheme } from '@/theme';

export default function LearnScreen() {
  const course = useCourseProgress();
  const { journey, error: streakError, retry } = useLearningJourney(false);
  const { colors } = useTheme();
  const [open, setOpen] = useState<'calendar' | 'xp' | null>(null);
  const completed = course.completed?.length ?? 0;
  const rank = LEVELS[rankIndex(completed)];
  return (
    <Screen title="Nauka" eyebrow="Krok po kroku" showBack>
      <View style={styles.summary}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Pokaż kalendarz passy"
          disabled={!journey}
          onPress={() => setOpen('calendar')}
          style={styles.stat}
        >
          <FieldIcon name="flame" size={spacing.xl} color={colors.glow} />
          <AppText variant="heading">{streakError ? '—' : (journey?.streak ?? '…')}</AppText>
          <AppText color="textMuted">{journey?.streak === 1 ? 'dzień passy' : 'dni passy'}</AppText>
        </PressableScale>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`${course.xp} XP – za co i po co`}
          disabled={!course.completed}
          onPress={() => setOpen('xp')}
          style={styles.stat}
        >
          <FieldIcon name="mushrooms" size={spacing.lg} color={colors.glow} />
          <AppText variant="bodyStrong">{course.completed ? `${course.xp} XP` : '…'}</AppText>
        </PressableScale>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Ranga: ${rank.name}. Pokaż wszystkie rangi`}
          disabled={!course.completed}
          onPress={() => setOpen('xp')}
          style={styles.stat}
        >
          <FieldIcon name="trophy" size={spacing.lg} color={colors.glow} />
          <AppText variant="bodyStrong">{course.completed ? rank.name : '…'}</AppText>
        </PressableScale>
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
      {open === 'calendar' && journey && (
        <StreakCalendar journey={journey} onClose={() => setOpen(null)} />
      )}
      {open === 'xp' && (
        <XpGuide xp={course.xp} completed={completed} onClose={() => setOpen(null)} />
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
