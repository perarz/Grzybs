import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { AddFindSheet } from '@/components/collection/AddFindSheet';
import { FindPhoto } from '@/components/collection/FindPhoto';
import { useCollection } from '@/features/collection/CollectionProvider';
import { findSpecies } from '@/data/species';
import { layout, spacing } from '@/theme';

export default function CollectionScreen() {
  const { finds, loading, error, reload } = useCollection();
  const [adding, setAdding] = useState(false);
  const { width, fontScale } = useWindowDimensions();
  const available = Math.min(width, layout.contentMaxWidth) - spacing.lg * 2;
  const columns = Math.max(
    1,
    Math.min(
      3,
      Math.floor((available + spacing.md) / (layout.minimumCardWidth * fontScale + spacing.md)),
    ),
  );
  const tileWidth = (available - spacing.md * (columns - 1)) / columns;
  return (
    <Screen title="Twoje odkrycia" eyebrow="Wspomnienia z lasu" showBack>
      <Button
        label="Dodaj zdjęcie"
        disabled={loading || Boolean(error)}
        onPress={() => setAdding(true)}
      />
      {loading ? (
        <AppText color="textMuted">Wczytuję zdjęcia…</AppText>
      ) : error ? (
        <>
          <AppText color="danger" accessibilityRole="alert">
            {error}
          </AppText>
          <Button label="Spróbuj ponownie" onPress={() => void reload()} />
        </>
      ) : !finds.length ? (
        <AppText color="textMuted">
          Tu pojawią się Twoje znaleziska. Dodaj zdjęcie i samodzielnie wybierz gatunek.
        </AppText>
      ) : (
        <View style={styles.grid}>
          {finds.map((find) => {
            const species = findSpecies(find.species_id);
            return (
              <PressableScale
                key={find.id}
                accessibilityRole="button"
                accessibilityLabel={`Otwórz znalezisko: ${species?.nameCommon ?? species?.namePl ?? 'grzyb'}`}
                onPress={() =>
                  router.push({ pathname: '/species/[id]', params: { id: find.species_id } })
                }
                style={[styles.tile, { width: tileWidth }]}
              >
                <FindPhoto uri={find.photo_uri} />
                <AppText variant="bodyStrong">{species?.nameCommon ?? species?.namePl}</AppText>
                <AppText variant="caption" color="textMuted">
                  {new Date(find.found_at).toLocaleDateString('pl-PL', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </AppText>
              </PressableScale>
            );
          })}
        </View>
      )}
      {adding && <AddFindSheet onClose={() => setAdding(false)} />}
    </Screen>
  );
}
const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: { maxWidth: '100%', gap: spacing.xs },
});
