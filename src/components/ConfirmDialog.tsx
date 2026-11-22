import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { FieldIcon, type FieldIconName } from '@/components/icons/FieldIcon';
import { durations, layout, radius, spacing, useTheme } from '@/theme';

type Props = {
  title: string;
  message: string;
  /** The safe choice – the highlighted button, also chosen by tapping outside or going back. */
  cancelLabel: string;
  confirmLabel: string;
  icon?: FieldIconName;
  /** Extra content under the message, e.g. a progress bar. */
  children?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
};

const DIALOG_MAX_WIDTH = 360;

/** An in-app question before something that can't be undone. */
export function ConfirmDialog({
  title,
  message,
  cancelLabel,
  confirmLabel,
  icon = 'close',
  children,
  onCancel,
  onConfirm,
}: Props) {
  const { colors } = useTheme();
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={onCancel}>
      <Animated.View
        entering={FadeIn.duration(durations.fast)}
        style={[styles.backdrop, { backgroundColor: colors.backdrop }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          onPress={onCancel}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          entering={ZoomIn.duration(durations.fast)}
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[styles.symbol, { backgroundColor: colors.dangerMuted }]}>
            <FieldIcon name={icon} size={layout.icon} color={colors.danger} />
          </View>
          <AppText variant="title" style={styles.center}>
            {title}
          </AppText>
          <AppText color="textMuted" style={styles.center}>
            {message}
          </AppText>
          {children}
          <View style={styles.actions}>
            <Button label={cancelLabel} onPress={onCancel} />
            <Button label={confirmLabel} variant="secondary" onPress={onConfirm} />
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
  actions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.sm },
});
