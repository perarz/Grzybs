import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';

import { AppText } from './AppText';
import { Chip } from './Chip';

type ChipOption<T> = {
  value: T;
  label: string;
};

type ChipGroupProps<T> = {
  label: string;
  options: ChipOption<T>[];
  selected: T | null;
  /** Gets null when the user taps the selected chip again to clear it. */
  onChange: (value: T | null) => void;
};

/** A labelled row of chips where at most one is selected. */
export function ChipGroup<T>({ label, options, selected, onChange }: ChipGroupProps<T>) {
  return (
    <View style={styles.group}>
      <AppText variant="label" color="textMuted">
        {label}
      </AppText>
      <View style={styles.chips}>
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <Chip
              key={option.label}
              label={option.label}
              selected={isSelected}
              onPress={() => onChange(isSelected ? null : option.value)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
