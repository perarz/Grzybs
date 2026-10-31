import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SPECIES } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { radius, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';

const THUMBNAIL_SIZE = 96;

export function SpeciesPreviewStrip() {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {SPECIES.map((species) => (
        <View key={species.id} style={styles.item}>
          <Image
            source={SPECIES_PHOTOS[species.id].source}
            style={[styles.photo, { backgroundColor: colors.surfaceMuted }]}
            contentFit="cover"
            transition={200}
            accessibilityLabel={species.namePl}
          />
          <AppText variant="caption" numberOfLines={2}>
            {species.namePl}
          </AppText>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.md,
  },
  item: {
    width: THUMBNAIL_SIZE,
    gap: spacing.xs,
  },
  photo: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: radius.md,
  },
});
