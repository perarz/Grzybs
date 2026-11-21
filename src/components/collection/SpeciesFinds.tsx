import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import type { Species } from '@/features/atlas/types';
import { useCollection } from '@/features/collection/CollectionProvider';
import type { Find } from '@/features/collection/storage';
import { spacing } from '@/theme';

import { PressableScale } from '@/components/PressableScale';

import { FindPhoto } from './FindPhoto';

export function SpeciesFinds({ species }: { species: Species }) {
  const collection = useCollection();
  const finds = collection.finds.filter((find) => find.species_id === species.id);
  const [removeError, setRemoveError] = useState<string | null>(null);
  function confirmRemove(find: Find) {
    Alert.alert('Usunąć to zdjęcie?', 'Zdjęcie zniknie z kolekcji i z pamięci telefonu.', [
      { text: 'Zostaw', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => {
          setRemoveError(null);
          collection.remove(find).catch(() => setRemoveError('Nie udało się usunąć zdjęcia.'));
        },
      },
    ]);
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
        <>
          {finds.map((find) => (
            <View key={find.id} style={styles.content}>
              <FindPhoto key={find.photo_uri} uri={find.photo_uri} />
              <View style={styles.row}>
                <AppText variant="label" color="textMuted">
                  {new Date(find.found_at).toLocaleDateString('pl-PL')}
                </AppText>
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel="Usuń to zdjęcie z kolekcji"
                  hitSlop={spacing.md}
                  onPress={() => confirmRemove(find)}
                >
                  <AppText variant="label" color="textMuted">
                    Usuń
                  </AppText>
                </PressableScale>
              </View>
            </View>
          ))}
          {removeError ? (
            <AppText color="danger" accessibilityRole="alert">
              {removeError}
            </AppText>
          ) : null}
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
