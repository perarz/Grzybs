import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { durations, layout, radius, spacing, springs, useTheme } from '@/theme';

type LessonResultProps = {
  title: string;
  passed: boolean;
  xp: number;
  accuracy: number;
  bestCombo: number;
  perfect: boolean;
  saving: boolean;
  error: string | null;
  onContinue: () => void;
  onRetry: () => void;
};

const TROPHY_SIZE = 64;

/** The end of a lesson: experience earned, accuracy and best streak, popping in one by one. */
export function LessonResult(props: LessonResultProps) {
  const { colors } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const stats = [
    { icon: 'flame' as const, value: `+${props.xp}`, label: 'XP' },
    { icon: 'check' as const, value: `${Math.round(props.accuracy * 100)}%`, label: 'celność' },
    { icon: 'trophy' as const, value: String(props.bestCombo), label: 'z rzędu' },
  ];
  return (
    <View
      style={[styles.screen, { paddingTop: top + spacing.xxl, paddingBottom: bottom + spacing.lg }]}
    >
      <View style={styles.body}>
        <View style={styles.hero}>
          <Animated.View
            entering={ZoomIn.springify().damping(springs.press.damping)}
            style={[
              styles.trophy,
              { backgroundColor: props.passed ? colors.glow : colors.surfaceMuted },
            ]}
          >
            <FieldIcon
              name={props.passed ? 'trophy' : 'refresh'}
              size={TROPHY_SIZE}
              color={props.passed ? colors.onGlow : colors.textMuted}
            />
          </Animated.View>
          <AppText variant="display" style={styles.center}>
            {props.passed ? (props.perfect ? 'Bezbłędnie!' : 'Udało się!') : 'Jeszcze raz'}
          </AppText>
          <AppText color="textMuted" style={styles.center}>
            {props.passed
              ? `${props.title} – ukończone.`
              : 'Do zaliczenia testu potrzeba co najmniej 80% poprawnych odpowiedzi za pierwszym razem.'}
          </AppText>
        </View>
        {props.passed ? (
          <View style={styles.stats}>
            {stats.map((stat, index) => (
              <Animated.View
                key={stat.label}
                entering={FadeInDown.delay(durations.slow + index * durations.fast)}
                style={[
                  styles.stat,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <FieldIcon name={stat.icon} size={layout.icon} color={colors.glow} />
                <AppText variant="title">{stat.value}</AppText>
                <AppText variant="label" color="textMuted">
                  {stat.label}
                </AppText>
              </Animated.View>
            ))}
          </View>
        ) : null}
      </View>
      <View style={styles.actions}>
        {props.error ? (
          <AppText color="danger" accessibilityRole="alert">
            {props.error}
          </AppText>
        ) : null}
        {props.passed ? (
          <Button
            label={props.saving ? 'Zapisuję…' : props.error ? 'Spróbuj zapisać ponownie' : 'Dalej'}
            disabled={props.saving}
            onPress={props.onContinue}
          />
        ) : (
          <>
            <Button label="Spróbuj ponownie" onPress={props.onRetry} />
            <Button label="Wróć do ścieżki" variant="secondary" onPress={props.onContinue} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: spacing.lg },
  body: { flex: 1, justifyContent: 'center', gap: spacing.xxl },
  hero: { alignItems: 'center', gap: spacing.md },
  trophy: {
    width: TROPHY_SIZE * 2,
    height: TROPHY_SIZE * 2,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  center: { textAlign: 'center' },
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actions: { gap: spacing.sm },
});
