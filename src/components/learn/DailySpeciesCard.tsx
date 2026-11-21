import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PhotoCredit } from '@/components/PhotoCredit';
import { PressableScale } from '@/components/PressableScale';
import { getCatalogNumber } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { Species } from '@/features/atlas/types';
import { durations, layout, radius, spacing, useTheme } from '@/theme';

export function DailySpeciesCard({ species }: { species: Species }) {
  const { colors } = useTheme();
  const [imageFailed, setImageFailed] = useState(false);
  const photo = SPECIES_PHOTOS[species.id];
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.photoFrame}>
        {imageFailed ? (
          <View style={styles.fallback}>
            <AppText color="textMuted">
              Zdjęcie niedostępne. Poznaj gatunek w opisie poniżej.
            </AppText>
          </View>
        ) : (
          <Image
            source={photo.source}
            style={styles.photo}
            contentFit="cover"
            transition={durations.base}
            accessibilityLabel={`Grzyb dnia: ${species.namePl}`}
            onError={() => setImageFailed(true)}
          />
        )}
        <View style={[styles.photoLabel, { backgroundColor: colors.background }]}>
          <AppText variant="label" color="accent">
            Grzyb dnia
          </AppText>
          <AppText variant="label" color="textMuted">
            {getCatalogNumber(species.id)}
          </AppText>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.names}>
          <AppText variant="title">{species.nameCommon ?? species.namePl}</AppText>
          {species.nameCommon && (
            <AppText variant="caption" color="textMuted">
              {species.namePl}
            </AppText>
          )}
        </View>
        <View style={[styles.feature, { borderColor: colors.glow }]}>
          <AppText variant="label" color="accent">
            Jedna cecha na dziś
          </AppText>
          <AppText>{species.keyFeatures[0]}</AppText>
        </View>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Poznaj gatunek: ${species.namePl}`}
          onPress={() => router.push({ pathname: '/species/[id]', params: { id: species.id } })}
          style={[styles.action, { borderColor: colors.border }]}
        >
          <AppText variant="button" color="accent" style={styles.actionLabel}>
            Otwórz kartę gatunku
          </AppText>
          <AppText variant="heading" color="accent">
            ↗
          </AppText>
        </PressableScale>
        <PhotoCredit photo={photo} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, overflow: 'hidden' },
  photoFrame: { position: 'relative' },
  photo: { width: '100%', aspectRatio: 2.2 },
  photoLabel: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  content: { padding: spacing.lg, gap: spacing.md },
  names: { gap: spacing.xs },
  feature: { borderLeftWidth: spacing.xs, paddingLeft: spacing.md, gap: spacing.sm },
  actionLabel: { flex: 1 },
  action: {
    minHeight: layout.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  fallback: { padding: spacing.lg, paddingTop: spacing.xxl * 2 },
});
