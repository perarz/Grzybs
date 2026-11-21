import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import type { CourseStep } from '@/features/learn/course';
import { layout, radius, spacing, useTheme } from '@/theme';

type Props = { step: CourseStep; done: boolean; active: boolean; width: number };

export function CourseTrailNode({ step, done, active, width }: Props) {
  const { colors } = useTheme();
  const locked = !done && !active;
  const nodeColor = active ? colors.glow : done ? colors.primary : colors.surfaceMuted;
  return (
    <View style={[styles.container, { width }]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${step.position + 1}. ${step.title}${done ? ', ukończono, powtórz lekcję' : active ? ', rozpocznij lekcję' : ', zablokowane'}`}
        accessibilityState={{ disabled: locked }}
        disabled={locked}
        onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: String(step.id) } })}
        style={[styles.halo, { borderColor: active ? colors.glow : 'transparent' }]}
      >
        <View style={[styles.base, { backgroundColor: colors.treeNear }]}>
          <View
            style={[
              styles.face,
              {
                backgroundColor: nodeColor,
                borderColor: active || done ? colors.background : colors.border,
              },
            ]}
          >
            <FieldIcon
              name={step.icon}
              size={spacing.xxl}
              color={active || done ? colors.onGlow : colors.textMuted}
            />
          </View>
        </View>
        {done || locked ? (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: done ? colors.primary : colors.background,
                borderColor: colors.background,
              },
            ]}
          >
            <FieldIcon
              name={done ? 'check' : 'lock'}
              size={spacing.lg}
              color={done ? colors.onPrimary : colors.textMuted}
            />
          </View>
        ) : null}
      </PressableScale>
      <View style={[styles.caption, { backgroundColor: colors.background }]}>
        <AppText
          variant={active ? 'bodyStrong' : 'caption'}
          color={locked ? 'textMuted' : 'text'}
          style={styles.center}
        >
          {step.title}
        </AppText>
        {active && (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Rozpocznij: ${step.title}`}
            onPress={() =>
              router.push({ pathname: '/lesson/[id]', params: { id: String(step.id) } })
            }
            style={styles.action}
          >
            <AppText variant="label" color="accent">
              Ucz się
            </AppText>
            <FieldIcon name="arrowRight" size={spacing.lg} color={colors.glow} />
          </PressableScale>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  halo: {
    width: layout.courseNode + spacing.lg,
    height: layout.courseNode + spacing.lg,
    borderRadius: radius.pill,
    borderWidth: layout.courseStroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  base: {
    width: layout.courseNode,
    height: layout.courseNode,
    borderRadius: radius.pill,
  },
  face: {
    width: layout.courseNode,
    height: layout.courseNode - spacing.xs,
    borderRadius: radius.pill,
    borderWidth: layout.courseStroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: spacing.xs,
    padding: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: layout.courseStroke,
  },
  caption: { alignItems: 'center', paddingHorizontal: spacing.xs, paddingBottom: spacing.xs },
  center: { textAlign: 'center' },
  action: {
    minHeight: layout.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
