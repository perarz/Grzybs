import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { getCatalogNumber } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { Species } from '@/features/atlas/types';
import { radius, spacing, useTheme } from '@/theme';

import { EdibilityStamp } from './EdibilityStamp';

type SpeciesCardProps = {
  species: Species;
};

// A big card shrinks less than a chip, or the press would feel heavy.
const CARD_PRESSED_SCALE = 0.97;

/** A specimen sheet: the photo mounted on paper, a catalogue number and both names. */
export function SpeciesCard({ species }: SpeciesCardProps) {
  const { colors } = useTheme();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={species.namePl}
      pressedScale={CARD_PRESSED_SCALE}
      onPress={() => router.push({ pathname: '/species/[id]', params: { id: species.id } })}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View>
        <Image
          source={SPECIES_PHOTOS[species.id].source}
          style={[styles.photo, { backgroundColor: colors.surfaceMuted }]}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.stamp}>
          <EdibilityStamp edibility={species.edibility} />
        </View>
      </View>
      <View style={styles.names}>
        <AppText variant="label" color="textMuted">
          {getCatalogNumber(species.id)}
        </AppText>
        <AppText variant="heading" numberOfLines={2}>
          {species.namePl}
        </AppText>
        <AppText variant="latinSmall" color="textMuted" numberOfLines={1}>
          {species.nameLatin}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.sm,
  },
  stamp: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
  },
  names: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
  },
});
