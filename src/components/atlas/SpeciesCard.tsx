import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { Species } from '@/features/atlas/types';
import { radius, spacing, useTheme } from '@/theme';

import { EdibilityBadge } from './EdibilityBadge';

type SpeciesCardProps = {
  species: Species;
  width: number;
};

export function SpeciesCard({ species, width }: SpeciesCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={species.namePl}
      onPress={() => router.push({ pathname: '/species/[id]', params: { id: species.id } })}
      style={({ pressed }) => [
        styles.card,
        {
          width,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View>
        <Image
          source={SPECIES_PHOTOS[species.id].source}
          style={[styles.photo, { backgroundColor: colors.surfaceMuted }]}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.badge}>
          <EdibilityBadge edibility={species.edibility} />
        </View>
      </View>
      <View style={styles.names}>
        <AppText variant="bodyStrong" numberOfLines={2}>
          {species.namePl}
        </AppText>
        <AppText variant="latin" color="textMuted" numberOfLines={1}>
          {species.nameLatin}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  names: {
    padding: spacing.md,
    gap: spacing.xs,
  },
});
