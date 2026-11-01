import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EdibilityStamp } from '@/components/atlas/EdibilityStamp';
import { ChevronRightIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import { SectionHeader } from '@/components/SectionHeader';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { Lookalike } from '@/features/atlas/findLookalikes';
import { isDangerous } from '@/features/safety/danger';
import { radius, spacing, useTheme } from '@/theme';

type LookalikeListProps = {
  lookalikes: Lookalike[];
};

const THUMBNAIL_SIZE = 72;
const ICON_SIZE = 18;
const RULE_WIDTH = 3;
const ROW_PRESSED_SCALE = 0.98;

export function LookalikeList({ lookalikes }: LookalikeListProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <SectionHeader title="Sobowtóry" trailing={String(lookalikes.length).padStart(2, '0')} />
      {lookalikes.map(({ species, pair }) => {
        const [first, second] = pair.species;
        // A dangerous lookalike gets a margin rule in its warning colour.
        const ruleColor = isDangerous(species.edibility)
          ? colors[species.edibility]
          : colors.border;
        return (
          <PressableScale
            key={species.id}
            accessibilityRole="button"
            accessibilityLabel={`Porównaj z: ${species.namePl}`}
            pressedScale={ROW_PRESSED_SCALE}
            onPress={() => router.push({ pathname: '/compare', params: { first, second } })}
            style={[
              styles.row,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderLeftColor: ruleColor,
              },
            ]}
          >
            <Image
              source={SPECIES_PHOTOS[species.id].source}
              style={[styles.thumbnail, { backgroundColor: colors.surfaceMuted }]}
              contentFit="cover"
            />
            <View style={styles.text}>
              <AppText variant="heading" numberOfLines={2}>
                {species.namePl}
              </AppText>
              <EdibilityStamp edibility={species.edibility} />
              <View style={styles.compare}>
                <AppText variant="label" color="accent">
                  Porównaj · różnice: {pair.differences.length}
                </AppText>
              </View>
            </View>
            <ChevronRightIcon color={colors.textMuted} size={ICON_SIZE} />
          </PressableScale>
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
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: RULE_WIDTH,
    padding: spacing.sm,
    paddingRight: spacing.md,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: radius.sm,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  compare: {
    marginTop: spacing.xs,
  },
});
