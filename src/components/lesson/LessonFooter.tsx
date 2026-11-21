import { StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { isComboMilestone } from '@/features/learn/lessonSession';
import { durations, layout, radius, spacing, springs, useTheme } from '@/theme';

type LessonFooterProps = {
  mode: 'teach' | 'answering' | 'correct' | 'wrong';
  canCheck: boolean;
  explanation?: string;
  combo: number;
  onCheck: () => void;
  onNext: () => void;
};

const PRAISE = ['Dobrze!', 'Świetnie!', 'Brawo!', 'Tak jest!'];
// The panel rises only a little: if the animation ever stalls, "Dalej" stays on screen.
const PANEL_RISE = spacing.xxl;

/** "Sprawdź" while answering; after checking, a coloured panel slides up with the explanation. */
export function LessonFooter({
  mode,
  canCheck,
  explanation,
  combo,
  onCheck,
  onNext,
}: LessonFooterProps) {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const padding = { paddingBottom: bottom + spacing.lg };
  const checked = mode === 'correct' || mode === 'wrong';
  const rise = useSharedValue<number>(PANEL_RISE);
  useEffect(() => {
    rise.set(checked ? withSpring(0, springs.sheet) : PANEL_RISE);
  }, [checked, rise]);
  const riseStyle = useAnimatedStyle(() => ({ transform: [{ translateY: rise.get() }] }));

  if (!checked) {
    return (
      <View style={[styles.footer, padding, { borderTopColor: colors.border }]}>
        {mode === 'teach' ? (
          <Button label="Dalej" onPress={onNext} />
        ) : (
          <Button label="Sprawdź" disabled={!canCheck} onPress={onCheck} />
        )}
      </View>
    );
  }

  const correct = mode === 'correct';
  const accent = correct ? colors.edible : colors.danger;
  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[
        riseStyle,
        styles.panel,
        padding,
        {
          backgroundColor: correct ? colors.primaryMuted : colors.dangerMuted,
          borderTopColor: accent,
        },
      ]}
    >
      <View style={styles.heading}>
        <Animated.View
          entering={ZoomIn.delay(durations.fast).springify()}
          style={[styles.badge, { backgroundColor: accent }]}
        >
          <FieldIcon
            name={correct ? 'check' : 'refresh'}
            size={layout.icon}
            color={colors.onPrimary}
          />
        </Animated.View>
        <AppText variant="title" style={{ color: accent }}>
          {correct ? PRAISE[combo % PRAISE.length] : 'Nie tym razem'}
        </AppText>
        {correct && isComboMilestone(combo) ? (
          <Animated.View entering={ZoomIn.delay(durations.base).springify()} style={styles.combo}>
            <FieldIcon name="flame" size={layout.icon} color={colors.glow} />
            <AppText variant="label" color="accent">
              {combo} z rzędu
            </AppText>
          </Animated.View>
        ) : null}
      </View>
      {explanation ? <AppText>{explanation}</AppText> : null}
      {!correct ? (
        <AppText variant="caption" color="textMuted">
          To pytanie wróci na końcu lekcji.
        </AppText>
      ) : null}
      <Button label="Dalej" onPress={onNext} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  panel: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 2,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  heading: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: {
    width: layout.touchTarget - spacing.sm,
    height: layout.touchTarget - spacing.sm,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  combo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginLeft: 'auto' },
});
