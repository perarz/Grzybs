import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EdibilityBadge } from '@/components/atlas/EdibilityBadge';
import { ChevronRightIcon } from '@/components/icons/UiIcons';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { Lookalike } from '@/features/atlas/findLookalikes';
import { isDangerous } from '@/features/safety/danger';
import { radius, spacing, useTheme } from '@/theme';

type LookalikeListProps = {
  lookalikes: Lookalike[];
};

const THUMBNAIL_SIZE = 64;
const ICON_SIZE = 20;

export function LookalikeList({ lookalikes }: LookalikeListProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <AppText variant="heading">Sobowtóry</AppText>
      {lookalikes.map(({ species, pair }) => {
        const [first, second] = pair.species;
        const dangerous = isDangerous(species.edibility);
        return (
          <Pressable
            key={species.id}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/compare', params: { first, second } })}
            accessibilityLabel={`Porównaj z: ${species.namePl}`}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: colors.surface,
                borderColor: dangerous ? colors[species.edibility] : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Image
              source={SPECIES_PHOTOS[species.id].source}
              style={[styles.thumbnail, { backgroundColor: colors.surfaceMuted }]}
              contentFit="cover"
            />
            <View style={styles.text}>
              <AppText variant="bodyStrong">{species.namePl}</AppText>
              <EdibilityBadge edibility={species.edibility} />
              <AppText variant="caption" color="textMuted">
                Porównaj – różnice: {pair.differences.length}
              </AppText>
            </View>
            <ChevronRightIcon color={colors.textMuted} size={ICON_SIZE} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: radius.md,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
});
