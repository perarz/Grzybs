import { useState } from 'react';
import { View } from 'react-native';

import { AboutAtlasButton } from '@/components/about/AboutAtlasButton';
import { AtlasFilters } from '@/components/atlas/AtlasFilters';
import { ActiveAnswers } from '@/components/atlas/ActiveAnswers';
import { EmptyResults } from '@/components/atlas/EmptyResults';
import { AppText } from '@/components/AppText';
import { SpeciesGrid } from '@/components/atlas/SpeciesGrid';
import { AddFindFab, AtlasMasthead } from '@/components/atlas/AtlasMasthead';
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

export default function AtlasScreen() {
  const [filter, setFilter] = useState<SpeciesFilter>(EMPTY_FILTER);
  const [discoveredOnly, setDiscoveredOnly] = useState(false);
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
        <AtlasFilters
          filter={filter}
          onFilterChange={setFilter}
          discoveredOnly={discoveredOnly}
          onDiscoveredOnlyChange={setDiscoveredOnly}
          speciesForCategories={matchingAnyCategory}
          activeFilters={activeFilters}
          answeredKeyQuestions={answered}
          onOpenKey={() => setKeyOpen(true)}
        />
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
