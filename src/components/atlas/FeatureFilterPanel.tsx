import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ChipGroup } from '@/components/ChipGroup';
import { clearFeatureFilters, type SpeciesFilter } from '@/features/atlas/filterSpecies';
import {
  CAP_COLOR_LABELS,
  HABITAT_LABELS,
  MONTH_NAMES,
  toOptions,
  UNDERSIDE_LABELS,
} from '@/features/atlas/labels';
import type { Month } from '@/features/atlas/types';
import { spacing } from '@/theme';

type FeatureFilterPanelProps = {
  filter: SpeciesFilter;
  currentMonth: Month;
  onChange: (filter: SpeciesFilter) => void;
};

const UNDERSIDE_OPTIONS = toOptions(UNDERSIDE_LABELS);
const CAP_COLOR_OPTIONS = toOptions(CAP_COLOR_LABELS);
const HABITAT_OPTIONS = toOptions(HABITAT_LABELS);
const PRESENT_OPTIONS = [
  { value: true, label: 'Jest' },
  { value: false, label: 'Brak' },
];
const YES_NO_OPTIONS = [
  { value: true, label: 'Tak' },
  { value: false, label: 'Nie' },
];

/** "I see pores and a brown cap" – narrows the atlas down to species with these features. */
export function FeatureFilterPanel({ filter, currentMonth, onChange }: FeatureFilterPanelProps) {
  return (
    <Card style={styles.panel}>
      <AppText variant="caption" color="textMuted">
        Zaznacz to, co widzisz. Filtr zawęża listę, ale nie zastępuje pewnego rozpoznania – w razie
        wątpliwości grzyb zostaje w lesie.
      </AppText>
      <ChipGroup
        label="Pod kapeluszem"
        options={UNDERSIDE_OPTIONS}
        selected={filter.underside}
        onChange={(underside) => onChange({ ...filter, underside })}
      />
      <ChipGroup
        label="Kolor kapelusza"
        options={CAP_COLOR_OPTIONS}
        selected={filter.capColor}
        onChange={(capColor) => onChange({ ...filter, capColor })}
      />
      <ChipGroup
        label="Pierścień na trzonie"
        options={PRESENT_OPTIONS}
        selected={filter.ring}
        onChange={(ring) => onChange({ ...filter, ring })}
      />
      <ChipGroup
        label="Pochwa u nasady trzonu"
        options={PRESENT_OPTIONS}
        selected={filter.volva}
        onChange={(volva) => onChange({ ...filter, volva })}
      />
      <ChipGroup
        label="Zmienia barwę po przekrojeniu lub uciśnięciu"
        options={YES_NO_OPTIONS}
        selected={filter.colorChange}
        onChange={(colorChange) => onChange({ ...filter, colorChange })}
      />
      <ChipGroup
        label="Gdzie rośnie"
        options={HABITAT_OPTIONS}
        selected={filter.habitat}
        onChange={(habitat) => onChange({ ...filter, habitat })}
      />
      <ChipGroup
        label="Sezon"
        options={[{ value: true, label: `Rośnie teraz (${MONTH_NAMES[currentMonth]})` }]}
        selected={filter.inSeasonOnly ? true : null}
        onChange={(value) => onChange({ ...filter, inSeasonOnly: value === true })}
      />
      <View style={styles.clear}>
        <Button
          label="Wyczyść cechy"
          variant="secondary"
          onPress={() => onChange(clearFeatureFilters(filter))}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.lg,
  },
  clear: {
    alignItems: 'flex-start',
  },
});
