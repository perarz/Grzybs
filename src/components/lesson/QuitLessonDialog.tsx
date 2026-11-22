import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { durations, layout, radius, spacing, springs, useTheme } from '@/theme';

type Props = {
  /** Share of the lesson already done, 0–1 – shown so leaving feels like a real loss. */
  progress: number;
  onStay: () => void;
  onQuit: () => void;
};

const DIALOG_MAX_WIDTH = 360;

export function QuitLessonDialog({ progress, onStay, onQuit }: Props) {
  const { colors } = useTheme();
  const percent = Math.round(progress * 100);
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={onStay}>
      <Animated.View
        entering={FadeIn.duration(durations.base)}
        style={[styles.backdrop, { backgroundColor: colors.backdrop }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ucz się dalej"
          onPress={onStay}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          entering={ZoomIn.springify()
            .damping(springs.sheet.damping)
            .stiffness(springs.sheet.stiffness)}
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[styles.symbol, { backgroundColor: colors.dangerMuted }]}>
            <FieldIcon name="close" size={layout.icon} color={colors.danger} />
          </View>
          <AppText variant="title" style={styles.center}>
            Przerwać lekcję?
          </AppText>
          <AppText color="textMuted" style={styles.center}>
            {percent > 0
              ? `Masz za sobą ${percent}% lekcji. Jeśli wyjdziesz, postęp przepadnie.`
              : 'Jeśli wyjdziesz, postęp tej lekcji przepadnie.'}
          </AppText>
          {percent > 0 && (
            <View style={[styles.track, { backgroundColor: colors.border }]}>
              <View style={[styles.fill, { backgroundColor: colors.glow, width: `${percent}%` }]} />
            </View>
          )}
          <View style={styles.actions}>
            <Button label="Ucz się dalej" onPress={onStay} />
            <Button label="Przerwij" variant="secondary" onPress={onQuit} />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  card: {
    width: '100%',
    maxWidth: DIALOG_MAX_WIDTH,
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  symbol: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  track: { alignSelf: 'stretch', height: spacing.xs, borderRadius: radius.xs, overflow: 'hidden' },
  fill: { height: '100%' },
  actions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.sm },
});
