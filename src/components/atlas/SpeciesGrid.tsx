import { StyleSheet, useWindowDimensions, View } from 'react-native';

import type { Species } from '@/features/atlas/types';
import { spacing } from '@/theme';

import { SpeciesCard } from './SpeciesCard';

type SpeciesGridProps = {
  species: Species[];
};

const COLUMNS = 2;
const COLUMN_GAP = spacing.md;

export function SpeciesGrid({ species }: SpeciesGridProps) {
  const { width } = useWindowDimensions();
  // Screen width minus the side padding of <Screen> and the gaps between columns.
  // Rounded down, so two cards always fit in one row.
  const cardWidth = Math.floor((width - spacing.lg * 2 - COLUMN_GAP * (COLUMNS - 1)) / COLUMNS);

  return (
    <View style={styles.grid}>
      {species.map((item) => (
        <SpeciesCard key={item.id} species={item} width={cardWidth} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: COLUMN_GAP,
  },
});
