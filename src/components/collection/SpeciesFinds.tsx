import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import type { Species } from '@/features/atlas/types';
import { useCollection } from '@/features/collection/CollectionProvider';
import { spacing } from '@/theme';

import { FindPhoto } from './FindPhoto';

export function SpeciesFinds({ species }: { species: Species }) {
  const collection = useCollection();
  const finds = collection.finds.filter((find) => find.species_id === species.id);
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
              <AppText variant="label" color="textMuted">
                {new Date(find.found_at).toLocaleDateString('pl-PL')}
              </AppText>
            </View>
          ))}
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.md },
});
