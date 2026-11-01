import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { PhotoCredit } from '@/components/PhotoCredit';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { Species } from '@/features/atlas/types';
import { spacing, useTheme } from '@/theme';

type SpeciesHeroProps = {
  species: Species;
};

const PHOTO_ASPECT_RATIO = 4 / 3;

/** Full-width photo with a back button on top and the author credit below. */
export function SpeciesHero({ species }: SpeciesHeroProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const photo = SPECIES_PHOTOS[species.id];

  return (
    <View style={styles.hero}>
      <Image
        source={photo.source}
        style={[styles.photo, { backgroundColor: colors.surfaceMuted }]}
        contentFit="cover"
        transition={200}
        accessibilityLabel={`Zdjęcie: ${species.namePl}`}
      />
      <View style={[styles.back, { top: insets.top + spacing.sm }]}>
        <BackButton />
      </View>
      <View style={styles.credit}>
        <PhotoCredit photo={photo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.sm,
  },
  photo: {
    width: '100%',
    aspectRatio: PHOTO_ASPECT_RATIO,
  },
  back: {
    position: 'absolute',
    left: spacing.lg,
  },
  credit: {
    paddingHorizontal: spacing.lg,
  },
});
