import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { COURSE_STAGES } from '@/data/courseStages';
import { COURSE_LENGTH, LESSONS_PER_STAGE } from '@/features/learn/course';
import { layout, radius, spacing, useTheme } from '@/theme';
import { CourseTrail } from './CourseTrail';

export function CoursePath({ completed }: { completed: number[] }) {
  const { colors } = useTheme();
  const next = completed.length;
  const currentStage = Math.min(COURSE_STAGES.length - 1, Math.floor(next / LESSONS_PER_STAGE));
  const [selected, setSelected] = useState<number | null>(null);
  const shown = selected ?? currentStage;
  return (
    <View style={styles.content}>
      {next === COURSE_LENGTH && (
        <View style={styles.achievement}>
          <FieldIcon name="trophy" size={spacing.xxl} color={colors.glow} />
          <AppText variant="heading" color="accent">
            Egzamin zdany – jesteś grzybiarzem!
          </AppText>
        </View>
      )}
      {COURSE_STAGES.map((stage, index) => {
        const expanded = shown === index;
        const locked = index > currentStage;
        // Stages ahead stay visible, fading into the fog the further away they are.
        const distance = index - currentStage;
        const trailShown = expanded || (distance > 0 && shown === currentStage);
        const count = Math.min(LESSONS_PER_STAGE, Math.max(0, next - index * LESSONS_PER_STAGE));
        return (
          <View key={stage.title} style={styles.content}>
            <PressableScale
              accessibilityRole="button"
              accessibilityState={{ expanded, disabled: locked }}
              disabled={locked}
              onPress={() => setSelected(index === currentStage ? null : index)}
              style={[
                styles.header,
                {
                  backgroundColor: expanded ? colors.surface : colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.headline}>
                <View
                  style={[
                    styles.stageNumber,
                    { backgroundColor: expanded ? colors.glow : colors.surfaceMuted },
                  ]}
                >
                  {locked ? (
                    <FieldIcon name="lock" size={layout.icon} color={colors.textMuted} />
                  ) : (
                    <AppText variant="heading" color={expanded ? 'onGlow' : 'text'}>
                      {String(index + 1).padStart(2, '0')}
                    </AppText>
                  )}
                </View>
                <View style={styles.title}>
                  <AppText variant="heading" color={locked ? 'textMuted' : 'text'}>
                    {stage.title}
                  </AppText>
                  <AppText variant="caption" color="textMuted">
                    {stage.subtitle}
                  </AppText>
                </View>
                <AppText variant="label" color={expanded ? 'accent' : 'textMuted'}>
                  {count}/{LESSONS_PER_STAGE}
                </AppText>
              </View>
              {expanded && (
                <View
                  style={styles.progress}
                  accessibilityRole="progressbar"
                  accessibilityValue={{ min: 0, max: LESSONS_PER_STAGE, now: count }}
                >
                  {Array.from({ length: LESSONS_PER_STAGE }, (_, step) => (
                    <View
                      key={step}
                      style={[
                        styles.segment,
                        { backgroundColor: step < count ? colors.season : colors.border },
                      ]}
                    />
                  ))}
                </View>
              )}
            </PressableScale>
            {trailShown && <CourseTrail stage={index} next={next} fog={Math.max(0, distance)} />}
          </View>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.md },
  achievement: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  header: {
    padding: spacing.lg,
    gap: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: layout.touchTarget,
  },
  headline: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stageNumber: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, gap: spacing.xs },
  progress: { flexDirection: 'row', gap: spacing.xs },
  segment: { flex: 1, height: spacing.xs, borderRadius: radius.pill },
});
