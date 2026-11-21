import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { CloseIcon } from '@/components/icons/UiIcons';
import { layout, palette, radius, spacing } from '@/theme';
import { fieldPanel as ink } from '@/theme/field';

type Props = {
  replacing: boolean;
  busy: boolean;
  canSave: boolean;
  error: string | null;
  onClose: () => void;
  onSave: () => void;
};

export function ParkingDialog({ replacing, busy, canSave, error, onClose, onSave }: Props) {
  const close = () => {
    if (!busy) onClose();
  };
  return (
    <Modal transparent visible animationType="fade" statusBarTranslucent onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable accessible={false} onPress={close} style={StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal style={styles.card}>
          <View style={styles.header}>
            <View style={styles.icon}>
              <FieldIcon name="car" size={28} color={palette.dark.glow} />
            </View>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Zamknij zapis auta"
              disabled={busy}
              onPress={close}
              style={styles.close}
            >
              <CloseIcon size={22} color={ink.muted} />
            </PressableScale>
          </View>
          <ScrollView contentContainerStyle={styles.content} bounces={false}>
            <AppText variant="title" accessibilityRole="header">
              {replacing ? 'Auto stoi gdzie indziej?' : 'Tu zostawiasz auto?'}
            </AppText>
            <AppText color="textMuted">
              {replacing
                ? 'Zastąpimy poprzedni parking Twoją obecną pozycją.'
                : 'Zapisz obecną pozycję, żeby łatwo wrócić do auta.'}
            </AppText>
            {!canSave && (
              <AppText variant="caption" color="textMuted">
                Czekamy na dokładną pozycję GPS…
              </AppText>
            )}
            {error && (
              <AppText variant="caption" color="danger" accessibilityRole="alert">
                {error}
              </AppText>
            )}
            <Button
              label={busy ? 'Zapisywanie…' : 'Zapisz auto tutaj'}
              disabled={busy || !canSave}
              onPress={onSave}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: palette.dark.backdrop,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '90%',
    backgroundColor: ink.background,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: ink.rule,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  icon: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    backgroundColor: palette.dark.surface,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { gap: spacing.md },
});
