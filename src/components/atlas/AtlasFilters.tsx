import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { CategoryTabs } from '@/components/atlas/CategoryTabs';
import { Chip } from '@/components/Chip';
import { IdentifyIcon, SlidersIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import type { Species } from '@/features/atlas/types';
import type { SpeciesFilter } from '@/features/atlas/filterSpecies';
import { layout, spacing, useTheme } from '@/theme';

type Props = {
  filter: SpeciesFilter;
  onFilterChange: (filter: SpeciesFilter) => void;
  discoveredOnly: boolean;
  onDiscoveredOnlyChange: (discoveredOnly: boolean) => void;
  /** Species that match everything except the category – the tabs count these. */
  speciesForCategories: Species[];
  activeFilters: number;
  answeredKeyQuestions: number;
  onOpenKey: () => void;
};

/** The "Filters" and "Identification key" buttons, plus the collapsible filter panel. */
export function AtlasFilters({
  filter,
  onFilterChange,
  discoveredOnly,
  onDiscoveredOnlyChange,
  speciesForCategories,
  activeFilters,
  answeredKeyQuestions,
  onOpenKey,
}: Props) {
  const { colors } = useTheme();
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <>
      <View style={[styles.tools, { borderColor: colors.border }]}>
        <PressableScale
          accessibilityRole="button"
          accessibilityState={{ expanded: filtersOpen }}
          onPress={() => setFiltersOpen(!filtersOpen)}
          style={styles.tool}
        >
          <SlidersIcon
            size={18}
            color={activeFilters || filtersOpen ? colors.accent : colors.textMuted}
          />
          <AppText variant="button" color={activeFilters || filtersOpen ? 'accent' : 'text'}>
            {filtersOpen ? 'Zwiń filtry' : 'Filtry'}
            {activeFilters ? ` · ${activeFilters}` : ''}
          </AppText>
        </PressableScale>
        <PressableScale accessibilityRole="button" onPress={onOpenKey} style={styles.tool}>
          <IdentifyIcon size={19} color={colors.primary} />
          <AppText variant="button">
            Klucz do oznaczania{answeredKeyQuestions ? ` · ${answeredKeyQuestions}` : ''}
          </AppText>
        </PressableScale>
      </View>
      {filtersOpen ? (
        <View style={styles.filters}>
          <CategoryTabs
            species={speciesForCategories}
            selected={filter.edibility}
            onChange={(edibility) => onFilterChange({ ...filter, edibility })}
          />
          <View style={styles.quickFilters}>
            <Chip
              label="Moje odkrycia"
              selected={discoveredOnly}
              onPress={() => onDiscoveredOnlyChange(!discoveredOnly)}
            />
            <Chip
              label="Rośnie teraz"
              selected={filter.inSeasonOnly}
              onPress={() => onFilterChange({ ...filter, inSeasonOnly: !filter.inSeasonOnly })}
            />
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  tools: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tool: {
    minHeight: layout.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  filters: { gap: spacing.sm },
  quickFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
