import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import type { Species } from '@/features/atlas/types';
import { durations, spacing, springs } from '@/theme';

import { SpeciesCard } from './SpeciesCard';

type SpeciesGridProps = {
  species: Species[];
};

const COLUMNS = 2;
const COLUMN_GAP = spacing.md;
// Cards arrive one after another, but the cascade stops early so the list is never slow.
const STAGGER_MS = 45;
const MAX_STAGGERED_CARDS = 8;

const cardLayout = LinearTransition.springify()
  .damping(springs.settle.damping)
  .stiffness(springs.settle.stiffness);

export function SpeciesGrid({ species }: SpeciesGridProps) {
  const { width } = useWindowDimensions();
  // Screen width minus the side padding of <Screen> and the gaps between columns.
  // Rounded down, so two cards always fit in one row.
  const cardWidth = Math.floor((width - spacing.lg * 2 - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS);

  return (
    <Animated.View layout={cardLayout} style={styles.grid}>
      {species.map((item, index) => (
        // Filtering doesn't redraw the list: leaving cards fade out, the rest glide into place.
        <Animated.View
          key={item.id}
          entering={FadeInDown.delay(Math.min(index, MAX_STAGGERED_CARDS) * STAGGER_MS)
            .springify()
            .damping(springs.settle.damping)}
          exiting={FadeOut.duration(durations.fast)}
          layout={cardLayout}
          style={{ width: cardWidth }}
        >
          <SpeciesCard species={item} />
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
