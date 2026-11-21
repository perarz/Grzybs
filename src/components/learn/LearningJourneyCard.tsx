import { JourneyLevels } from './JourneyLevels';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import type { LearningJourney } from '@/features/learn/journey';
import { LEVELS } from '@/features/learn/journey';
import { radius, spacing, useTheme } from '@/theme';

type Props = { journey: LearningJourney; onPractice: () => void };
export function LearningJourneyCard({ journey: j, onPractice }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.row}>
        <AppText variant="label" color="accent">
          Twoja leśna ścieżka
        </AppText>
        <AppText variant="label" color="textMuted">
          Poziom {j.levelNumber} / {LEVELS.length}
        </AppText>
      </View>
      <AppText variant="title">{j.level.name}</AppText>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Postęp poziomu"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(j.fraction * 100) }}
        style={[styles.track, { backgroundColor: colors.surfaceMuted }]}
      >
        <View
          style={[styles.fill, { backgroundColor: colors.glow, width: `${j.fraction * 100}%` }]}
        />
      </View>
      <View style={styles.row}>
        <AppText variant="bodyStrong" color="accent">
          {j.xp} XP
        </AppText>
        <AppText variant="caption" color="textMuted">
          {j.next ? `${j.next.xp - j.xp} XP do: ${j.next.name}` : 'Ostatni poziom osiągnięty'}
        </AppText>
      </View>
      <View style={[styles.streak, { borderColor: colors.border }]}>
        <View style={styles.row}>
          <View>
            <AppText variant="display" color="accent">
              {j.streak}
            </AppText>
            <AppText variant="caption">{j.streak === 1 ? 'dzień z rzędu' : 'dni z rzędu'}</AppText>
          </View>
          <View style={styles.status}>
            <AppText variant="bodyStrong">
              {j.completedToday
                ? 'Dzisiaj zrobione'
                : j.streak
                  ? 'Podtrzymaj serię'
                  : 'Zacznij swoją serię'}
            </AppText>
            <AppText variant="caption" color="textMuted">
              Rekord: {j.bestStreak} {j.bestStreak === 1 ? 'dzień' : 'dni'}
            </AppText>
          </View>
        </View>
        <View style={styles.week} accessibilityLabel="Ostatnie siedem dni">
          {j.week.map((day, index) => (
            <View
              key={day.day}
              style={styles.day}
              accessible
              accessibilityLabel={`${index === 6 ? 'Dzisiaj' : `${6 - index} dni temu`}: ${day.done ? 'runda ukończona' : 'bez rundy'}`}
            >
              <AppText variant="caption" color="textMuted">
                {day.label}
              </AppText>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: day.done ? colors.glow : colors.surfaceMuted,
                    borderColor: index === 6 ? colors.glow : colors.border,
                  },
                ]}
              >
                <AppText
                  variant="bodyStrong"
                  style={{ color: day.done ? colors.onGlow : colors.textMuted }}
                >
                  {day.done ? '✓' : '·'}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Button
        label={j.completedToday ? 'Ćwicz dalej' : 'Zrób dzisiejszy quiz'}
        onPress={onPractice}
      />
      <AppText variant="caption" color="textMuted">
        Jedna pełna runda dziennie utrzymuje serię. Runda daje 10 XP + do 20 XP za poprawne
        odpowiedzi.
      </AppText>
      <JourneyLevels xp={j.xp} />
    </View>
  );
}
const styles = StyleSheet.create({
  card: { padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderRadius: radius.lg },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  track: { height: spacing.sm, borderRadius: radius.sm, overflow: 'hidden' },
  fill: { height: '100%' },
  streak: { borderTopWidth: 1, paddingTop: spacing.md, gap: spacing.md },
  status: { flexShrink: 1, gap: spacing.xs },
  week: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs },
  day: { flex: 1, alignItems: 'center', gap: spacing.xs },
  dot: {
    minWidth: spacing.xl,
    minHeight: spacing.xl,
    borderWidth: 1,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
