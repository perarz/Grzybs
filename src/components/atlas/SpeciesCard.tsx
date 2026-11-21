import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { EDIBILITY_LABELS } from '@/features/atlas/labels';
import type { Species } from '@/features/atlas/types';
import { useCollection } from '@/features/collection/CollectionProvider';
import { durations, layout, radius, spacing, useTheme } from '@/theme';

import { EdibilityStamp } from './EdibilityStamp';

type SpeciesCardProps = {
  species: Species;
  lead: boolean;
};

// A big card shrinks less than a chip, or the press would feel heavy.
const CARD_PRESSED_SCALE = 0.985;

/** Familiar name first, with the formal Polish name beneath it. */
export function SpeciesCard({ species, lead }: SpeciesCardProps) {
  const { colors } = useTheme();
  const { finds } = useCollection();
  const discovered = finds.some((find) => find.species_id === species.id);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${species.nameCommon ? species.nameCommon + ', ' : ''}${species.namePl}, ${EDIBILITY_LABELS[species.edibility]}${discovered ? ', w Twojej kolekcji' : ''}`}
      pressedScale={CARD_PRESSED_SCALE}
      onPress={() => router.push({ pathname: '/species/[id]', params: { id: species.id } })}
      style={styles.card}
    >
      <View>
        <Image
          source={SPECIES_PHOTOS[species.id].source}
          style={[styles.photo, lead && styles.cover, { backgroundColor: colors.surfaceMuted }]}
          contentFit="cover"
          transition={durations.base}
        />
        <View style={styles.stamp}>
          <EdibilityStamp edibility={species.edibility} />
        </View>
      </View>
      <View style={styles.names}>
        <AppText variant={lead ? 'title' : 'heading'}>
          {species.nameCommon ?? species.namePl}
        </AppText>
        {species.nameCommon && (
          <AppText variant="caption" color="textMuted">
            {species.namePl}
          </AppText>
        )}
        {discovered ? (
          <AppText variant="caption" color="accent">
            W kolekcji
          </AppText>
        ) : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  photo: {
    borderRadius: radius.md,
    width: '100%',
    aspectRatio: layout.speciesPhotoAspect,
  },
  cover: { aspectRatio: 2.15 },
  stamp: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
  },
  names: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
});
