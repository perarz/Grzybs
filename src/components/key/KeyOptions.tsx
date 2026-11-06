import type { ComponentType } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { formatSpeciesCount } from '@/features/atlas/identificationKey';
import { radius, spacing, useTheme } from '@/theme';

import { ILLUSTRATION_SIZE, type IllustrationProps } from './illustrationProps';
import { KeyOptionTile } from './KeyOptionTile';

export type KeyOption<T> = {
  value: T;
  label: string;
  /** A line drawing of the answer… */
  Illustration?: ComponentType<IllustrationProps>;
  /** …or, for colours, the colour itself. */
  swatch?: string;
};

type KeyOptionsProps<T> = {
  options: KeyOption<T>[];
  selected: T | null;
  /** How many species would match if this answer were chosen. */
  countFor: (value: T) => number;
  /** Gets null when the user taps the chosen answer again to take it back. */
  onSelect: (value: T | null) => void;
};

const COLUMNS = 2;
const SWATCH_SIZE = 44;

/** The answers to one question of the key, as a two-column grid of tiles. */
export function KeyOptions<T>({ options, selected, countFor, onSelect }: KeyOptionsProps<T>) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const tileWidth = Math.floor((width - spacing.lg * 2 - spacing.md * (COLUMNS - 1)) / COLUMNS);

  return (
    <View style={styles.grid}>
      {options.map((option) => {
        const count = countFor(option.value);
        const isSelected = option.value === selected;
        const { Illustration } = option;
        return (
          <KeyOptionTile
            key={option.label}
            label={option.label}
            countLabel={formatSpeciesCount(count)}
            isSelected={isSelected}
            isDisabled={count === 0 && !isSelected}
            width={tileWidth}
            onPress={() => onSelect(isSelected ? null : option.value)}
            illustration={
              option.swatch ? (
                <View style={styles.swatchBox}>
                  <View
                    style={[
                      styles.swatch,
                      { backgroundColor: option.swatch, borderColor: colors.border },
                    ]}
                  />
                </View>
              ) : Illustration ? (
                <Illustration color={colors.text} accent={colors.glow} />
              ) : null
            }
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  swatchBox: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
