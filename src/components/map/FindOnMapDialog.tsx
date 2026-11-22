import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { DialogCard } from '@/components/DialogCard';
import { FindPhoto } from '@/components/collection/FindPhoto';
import { findSpecies } from '@/data/species';
import { formatWeight } from '@/features/collection/findDraft';
import type { Find } from '@/features/collection/storage';
import { spacing } from '@/theme';

type Props = { find: Find; onClose: () => void };

/** A find tapped on the map: its photo, the species and when it was found. */
export function FindOnMapDialog({ find, onClose }: Props) {
  const species = findSpecies(find.species_id);
  const details = [
    new Date(find.found_at).toLocaleDateString('pl-PL'),
    find.weight_grams ? formatWeight(find.weight_grams) : null,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <DialogCard closeLabel="Zamknij" onClose={onClose}>
      <FindPhoto uri={find.photo_uri} />
      <View style={styles.names}>
        <AppText variant="title">{species?.nameCommon ?? species?.namePl ?? 'Znalezisko'}</AppText>
        <AppText variant="caption" color="textMuted">
          {details}
        </AppText>
        {find.note ? <AppText>{find.note}</AppText> : null}
      </View>
      <View style={styles.actions}>
        {species && (
          <Button
            label="Zobacz gatunek"
            onPress={() => {
              onClose();
              router.push({ pathname: '/species/[id]', params: { id: species.id } });
            }}
          />
        )}
        <Button label="Zamknij" variant="secondary" onPress={onClose} />
      </View>
    </DialogCard>
  );
}

const styles = StyleSheet.create({
  names: { gap: spacing.xs },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
});
