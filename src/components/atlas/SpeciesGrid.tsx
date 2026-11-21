import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import type { Species } from '@/features/atlas/types';
import { durations, layout, spacing } from '@/theme';

import { SpeciesCard } from './SpeciesCard';

type SpeciesGridProps = {
  species: Species[];
  lead: boolean;
};

const COLUMN_GAP = spacing.md;
const appear = FadeIn.duration(durations.fast).reduceMotion(ReduceMotion.System);

export function SpeciesGrid({ species, lead }: SpeciesGridProps) {
  const { width, fontScale } = useWindowDimensions();
  // Screen width minus the side padding of <Screen> and the gaps between columns.
  // Rounded down, so two cards always fit in one row.
  const availableWidth = Math.min(width, layout.contentMaxWidth) - spacing.lg * 2;
  const columns = Math.max(
    1,
    Math.min(
      3,
      Math.floor(
        (availableWidth + COLUMN_GAP) / (layout.minimumCardWidth * fontScale + COLUMN_GAP),
      ),
    ),
  );
  const cardWidth = Math.floor((availableWidth - COLUMN_GAP * (columns - 1)) / columns);

  return (
    <Animated.View style={styles.grid}>
      {species.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={appear}
          style={{ width: lead && index === 0 ? availableWidth : cardWidth }}
        >
          <SpeciesCard species={item} lead={lead && index === 0} />
        </Animated.View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: COLUMN_GAP,
  },
});
