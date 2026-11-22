import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PressableScale } from '@/components/PressableScale';
import type { Species } from '@/features/atlas/types';
import { useCollection } from '@/features/collection/CollectionProvider';
import { draftFrom, formatPlace, formatWeight } from '@/features/collection/findDraft';
import type { Find } from '@/features/collection/storage';
import { spacing } from '@/theme';

import { EditFindSheet } from './EditFindSheet';
import { FindPhoto } from './FindPhoto';

/** Date, weight and place in one short line under the photo. */
function summary(find: Find) {
  const place = draftFrom(find).place;
  return [
    new Date(find.found_at).toLocaleDateString('pl-PL'),
    find.weight_grams ? formatWeight(find.weight_grams) : null,
    place ? formatPlace(place) : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export function SpeciesFinds({ species }: { species: Species }) {
  const collection = useCollection();
  const finds = collection.finds.filter((find) => find.species_id === species.id);
  const [removing, setRemoving] = useState<Find | null>(null);
  const [editing, setEditing] = useState<Find | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  function remove(find: Find) {
    setRemoving(null);
    setRemoveError(null);
    collection.remove(find).catch(() => setRemoveError('Nie udało się usunąć zdjęcia.'));
  }
  return (
    <View style={styles.content}>
      <AppText variant="heading">Twoje znaleziska · {finds.length}</AppText>
      {collection.error ? (
        <>
          <AppText color="danger">{collection.error}</AppText>
          <Button label="Ponów odczyt" onPress={() => void collection.reload()} />
        </>
      ) : (
        finds.map((find) => (
          <View key={find.id} style={styles.content}>
            <FindPhoto key={find.photo_uri} uri={find.photo_uri} />
            <AppText variant="caption" color="textMuted">
              {summary(find)}
            </AppText>
            {find.note ? <AppText>{find.note}</AppText> : null}
            <View style={styles.actions}>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Edytuj szczegóły znaleziska"
                hitSlop={spacing.md}
                onPress={() => setEditing(find)}
              >
                <AppText variant="label" color="accent">
                  Edytuj
                </AppText>
              </PressableScale>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Usuń to zdjęcie z kolekcji"
                hitSlop={spacing.md}
                onPress={() => setRemoving(find)}
              >
                <AppText variant="label" color="textMuted">
                  Usuń
                </AppText>
              </PressableScale>
            </View>
          </View>
        ))
      )}
      {removeError ? (
        <AppText color="danger" accessibilityRole="alert">
          {removeError}
        </AppText>
      ) : null}
      {editing && <EditFindSheet find={editing} onClose={() => setEditing(null)} />}
      {removing && (
        <ConfirmDialog
          title="Usunąć to zdjęcie?"
          message="Zdjęcie zniknie z kolekcji i z pamięci telefonu."
          cancelLabel="Zostaw"
          confirmLabel="Usuń"
          icon="camera"
          onCancel={() => setRemoving(null)}
          onConfirm={() => remove(removing)}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.xl },
});
