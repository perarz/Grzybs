import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PhotoCredit } from '@/components/PhotoCredit';
import { getSpecies } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { SpeciesId } from '@/features/atlas/types';
import { durations, radius, spacing, useTheme } from '@/theme';

function SpeciesPhoto({ id }: { id: SpeciesId }) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const species = getSpecies(id);
  const photo = SPECIES_PHOTOS[id];
  return (
    <View style={styles.item}>
      {failed ? (
        <AppText variant="caption">Zdjęcie niedostępne</AppText>
      ) : (
        <Image
          source={photo.source}
          style={[styles.photo, { backgroundColor: colors.surfaceMuted }]}
          contentFit="cover"
          transition={durations.fast}
          accessibilityLabel={species.namePl}
          onError={() => setFailed(true)}
        />
      )}
      <AppText variant="heading">{species.namePl}</AppText>
      <PhotoCredit photo={photo} />
    </View>
  );
}

export function LearningPairPhotos({ ids }: { ids: SpeciesId[] }) {
  return (
    <View style={styles.row}>
      {ids.map((id) => (
        <SpeciesPhoto key={id} id={id} />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  item: { flex: 1, gap: spacing.sm },
  photo: { width: '100%', aspectRatio: 1, borderRadius: radius.sm },
});
