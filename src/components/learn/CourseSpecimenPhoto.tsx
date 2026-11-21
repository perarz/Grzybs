import { useState } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PhotoCredit } from '@/components/PhotoCredit';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { getSpecies } from '@/data/species';
import type { SpeciesId } from '@/features/atlas/types';
import { radius, spacing, useTheme } from '@/theme';

export function CourseSpecimenPhoto({
  id,
  revealName = true,
}: {
  id: SpeciesId;
  revealName?: boolean;
}) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const species = getSpecies(id);
  const photo = SPECIES_PHOTOS[id];
  return (
    <View style={styles.content}>
      {failed ? (
        <AppText color="danger">Nie udało się wczytać zdjęcia. Otwórz ponownie lekcję.</AppText>
      ) : (
        <Image
          source={photo.source}
          contentFit="cover"
          style={[styles.photo, { backgroundColor: colors.surface }]}
          accessibilityLabel={revealName ? species.namePl : 'Gatunek do rozpoznania'}
          onError={() => setFailed(true)}
        />
      )}
      {revealName && <AppText variant="heading">{species.namePl}</AppText>}
      <PhotoCredit photo={photo} />
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.xs },
  photo: { width: '100%', aspectRatio: 1.8, borderRadius: radius.lg },
});
