import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { durations, radius, spacing, useTheme } from '@/theme';

const DIALOG_MAX_WIDTH = 360;

type Props = { closeLabel: string; onClose: () => void; children: ReactNode };

/** A small card in the middle of a dimmed screen; tapping outside or going back closes it. */
export function DialogCard({ closeLabel, onClose, children }: Props) {
  const { colors } = useTheme();
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(durations.fast)}
        style={[styles.backdrop, { backgroundColor: colors.backdrop }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          entering={ZoomIn.duration(durations.fast)}
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          {children}
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
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
