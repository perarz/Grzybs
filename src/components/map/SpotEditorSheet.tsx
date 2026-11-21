import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { CloseIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import { Button } from '@/components/Button';
import type { SpotInput } from '@/features/spots/storage';
import { useSpotEditor, type SpotDraft } from '@/features/spots/useSpotEditor';
import { layout, radius, spacing, typography, useTheme } from '@/theme';

type Props = {
  draft: SpotDraft;
  saveSpot: (input: SpotInput) => Promise<void>;
  onClose: () => void;
};

export function SpotEditorSheet({ draft, saveSpot, onClose }: Props) {
  const { colors } = useTheme();
  const editor = useSpotEditor(draft, saveSpot, onClose);
  return (
    <BottomSheet
      dismissible={!editor.busy}
      onClose={onClose}
      header={(close) => (
        <View style={styles.header}>
          <AppText variant="title" style={styles.title}>
            {draft.spot ? 'Edytuj miejscówkę' : 'Zapisz miejscówkę'}
          </AppText>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Zamknij miejscówkę"
            disabled={editor.busy}
            onPress={close}
            style={styles.close}
          >
            <CloseIcon size={22} color={colors.textMuted} />
          </PressableScale>
        </View>
      )}
    >
      {() => (
        <KeyboardAvoidingView
          style={styles.root}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <AppText variant="heading">Nazwa miejsca</AppText>
            <TextInput
              value={editor.name}
              onChangeText={editor.setName}
              maxLength={80}
              editable={!editor.busy}
              placeholder="np. Polana za strumieniem"
              placeholderTextColor={colors.textMuted}
              accessibilityLabel="Nazwa miejscówki"
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            />
            <AppText variant="heading">Notatka</AppText>
            <TextInput
              value={editor.note}
              onChangeText={editor.setNote}
              maxLength={500}
              multiline
              numberOfLines={5}
              editable={!editor.busy}
              placeholder="Co tu rośnie? Jak trafić ponownie?"
              placeholderTextColor={colors.textMuted}
              accessibilityLabel="Notatka o miejscówce"
              style={[
                styles.input,
                styles.note,
                { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            />
            {editor.error ? (
              <AppText accessibilityRole="alert" color="danger">
                {editor.error}
              </AppText>
            ) : null}
            <Button
              label={editor.busy ? 'Zapisuję…' : draft.spot ? 'Zapisz zmiany' : 'Zapisz miejscówkę'}
              disabled={editor.busy}
              onPress={() => void editor.save()}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flex: 1 },
  close: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { gap: spacing.lg, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  input: {
    ...typography.body,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  note: { minHeight: spacing.xxl * 4, textAlignVertical: 'top' },
});
