import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AboutAtlasButton } from '@/components/about/AboutAtlasButton';
import { ActiveAnswers } from '@/components/atlas/ActiveAnswers';
import { CategoryTabs } from '@/components/atlas/CategoryTabs';
import { EmptyResults } from '@/components/atlas/EmptyResults';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { SpeciesGrid } from '@/components/atlas/SpeciesGrid';
import { AddFindFab, AtlasMasthead } from '@/components/atlas/AtlasMasthead';
import { IdentifyIcon, SlidersIcon } from '@/components/icons/UiIcons';
import { Chip } from '@/components/Chip';
import { IdentificationKeySheet } from '@/components/key/IdentificationKeySheet';
import { Screen } from '@/components/Screen';
import { SearchField } from '@/components/SearchField';
import { SPECIES } from '@/data/species';
import {
  countFeatureFilters,
  EMPTY_FILTER,
  filterSpecies,
  type SpeciesFilter,
} from '@/features/atlas/filterSpecies';
import { getCurrentMonth } from '@/features/atlas/season';
import { useCollection } from '@/features/collection/CollectionProvider';
import { layout, spacing, useTheme } from '@/theme';

export default function AtlasScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<SpeciesFilter>(EMPTY_FILTER);
  const [discoveredOnly, setDiscoveredOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilters =
    Number(discoveredOnly) + Number(filter.inSeasonOnly) + Number(filter.edibility !== null);
  const answered = countFeatureFilters(filter);
  const { finds } = useCollection();
  const discoveredIds = new Set(finds.map((find) => find.species_id));
  const catalogue = discoveredOnly
    ? SPECIES.filter((species) => discoveredIds.has(species.id))
    : SPECIES;
  const [isKeyOpen, setKeyOpen] = useState(false);

  const currentMonth = getCurrentMonth();
  const countMatches = (candidate: SpeciesFilter) =>
    filterSpecies(catalogue, candidate, currentMonth).length;
  // The category tabs count species that match everything else, so filter in two steps.
  const matchingAnyCategory = filterSpecies(
    catalogue,
    { ...filter, edibility: null },
    currentMonth,
  );
  const results = matchingAnyCategory.filter(
    (species) => filter.edibility === null || species.edibility === filter.edibility,
  );

  return (
    <>
      <Screen title="Atlas" header={<AtlasMasthead />} showBack backToTop>
        <SearchField
          value={filter.query}
          onChangeText={(query) => setFilter({ ...filter, query })}
          placeholder="Szukaj gatunku"
        />
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
          <PressableScale
            accessibilityRole="button"
            onPress={() => setKeyOpen(true)}
            style={styles.tool}
          >
            <IdentifyIcon size={19} color={colors.primary} />
            <AppText variant="button">
              Klucz do oznaczania{answered ? ` · ${answered}` : ''}
            </AppText>
          </PressableScale>
        </View>
        {filtersOpen ? (
          <View style={styles.filters}>
            <CategoryTabs
              species={matchingAnyCategory}
              selected={filter.edibility}
              onChange={(edibility) => setFilter({ ...filter, edibility })}
            />
            <View style={styles.quickFilters}>
              <Chip
                label="Moje odkrycia"
                selected={discoveredOnly}
                onPress={() => setDiscoveredOnly(!discoveredOnly)}
              />
              <Chip
                label="Rośnie teraz"
                selected={filter.inSeasonOnly}
                onPress={() => setFilter({ ...filter, inSeasonOnly: !filter.inSeasonOnly })}
              />
            </View>
          </View>
        ) : null}
        <ActiveAnswers filter={filter} onChange={setFilter} />
        {activeFilters || answered || filter.query.trim() ? (
          <AppText variant="caption" color="textMuted">
            Wyniki: {results.length} / {SPECIES.length}
          </AppText>
        ) : null}
        <View>
          {results.length > 0 ? (
            <SpeciesGrid
              species={results}
              lead={!activeFilters && !answered && !filter.query.trim()}
            />
          ) : (
            <EmptyResults
              collectionOnly={discoveredOnly}
              onClear={() => {
                setFilter(EMPTY_FILTER);
                setDiscoveredOnly(false);
              }}
            />
          )}
        </View>
        <AboutAtlasButton />
      </Screen>
      <AddFindFab />
      {isKeyOpen ? (
        <IdentificationKeySheet
          filter={filter}
          countMatches={countMatches}
          onChange={setFilter}
          onClose={() => setKeyOpen(false)}
        />
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
