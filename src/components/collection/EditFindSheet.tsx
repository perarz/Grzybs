import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { useCollection } from '@/features/collection/CollectionProvider';
import { detailsFrom, draftFrom, weightError } from '@/features/collection/findDraft';
import type { Find } from '@/features/collection/storage';
import { spacing } from '@/theme';
import { FindDetailsForm } from './FindDetailsForm';

export function EditFindSheet({ find, onClose }: { find: Find; onClose: () => void }) {
  const collection = useCollection();
  const [draft, setDraft] = useState(() => draftFrom(find));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function save(close: () => void) {
    setBusy(true);
    setError(null);
    try {
      await collection.update(find, detailsFrom(draft));
      close();
    } catch {
      setError('Nie udało się zapisać zmian. Spróbuj ponownie.');
      setBusy(false);
    }
  }
  return (
    <BottomSheet
      onClose={onClose}
      dismissible={!busy}
      header={() => (
        <AppText variant="heading">
          Znalezisko z {new Date(find.found_at).toLocaleDateString('pl-PL')}
        </AppText>
      )}
    >
      {(close) => (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
          <FindDetailsForm draft={draft} onChange={setDraft} disabled={busy} />
          {error ? (
            <AppText color="danger" accessibilityRole="alert">
              {error}
            </AppText>
          ) : null}
          <View style={styles.actions}>
            <Button
              label={busy ? 'Zapisuję…' : 'Zapisz zmiany'}
              disabled={busy || Boolean(weightError(draft))}
              onPress={() => void save(close)}
            />
          </View>
        </ScrollView>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  actions: { gap: spacing.sm },
});
