import { ScrollView, StyleSheet } from 'react-native';

import { Chip } from '@/components/Chip';
import { EDIBILITY_CATEGORY_LABELS, toOptions } from '@/features/atlas/labels';
import type { Edibility } from '@/features/atlas/types';
import { spacing } from '@/theme';

type CategoryChipsProps = {
  selected: Edibility | null;
  onChange: (edibility: Edibility | null) => void;
};

const CATEGORIES = toOptions(EDIBILITY_CATEGORY_LABELS);

/** "All" plus one chip per edibility level, scrolling sideways. */
export function CategoryChips({ selected, onChange }: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      <Chip label="Wszystkie" selected={selected === null} onPress={() => onChange(null)} />
      {CATEGORIES.map((category) => (
        <Chip
          key={category.value}
          label={category.label}
          selected={selected === category.value}
          onPress={() => onChange(category.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
});
