import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { ActiveAnswers } from '@/components/atlas/ActiveAnswers';
import { CategoryTabs } from '@/components/atlas/CategoryTabs';
import { EmptyResults } from '@/components/atlas/EmptyResults';
import { IdentifyKeyButton } from '@/components/atlas/IdentifyKeyButton';
import { SpeciesGrid } from '@/components/atlas/SpeciesGrid';
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
import { durations } from '@/theme';

export default function AtlasScreen() {
  const [filter, setFilter] = useState<SpeciesFilter>(EMPTY_FILTER);
  const [isKeyOpen, setKeyOpen] = useState(false);

  const currentMonth = getCurrentMonth();
  const countMatches = (candidate: SpeciesFilter) =>
    filterSpecies(SPECIES, candidate, currentMonth).length;
  // The category tabs count species that match everything else, so filter in two steps.
  const matchingAnyCategory = filterSpecies(SPECIES, { ...filter, edibility: null }, currentMonth);
  const results = matchingAnyCategory.filter(
    (species) => filter.edibility === null || species.edibility === filter.edibility,
  );

  return (
    <>
      <Screen
        eyebrow={`Atlas grzybów · ${SPECIES.length} gatunków`}
        title="Atlas"
        subtitle="Poznaj gatunki i odblokuj je zdjęciami swoich znalezisk."
      >
        <SearchField
          value={filter.query}
          onChangeText={(query) => setFilter({ ...filter, query })}
          placeholder="Szukaj, np. kurka albo boletus"
        />
        <IdentifyKeyButton
          answeredCount={countFeatureFilters(filter)}
          onPress={() => setKeyOpen(true)}
        />
        <ActiveAnswers filter={filter} onChange={setFilter} />
        <CategoryTabs
          species={matchingAnyCategory}
          selected={filter.edibility}
          onChange={(edibility) => setFilter({ ...filter, edibility })}
        />
        <View style={styles.resultsRow}>
          <AppText variant="label" color="textMuted">
            Okazy: {results.length} / {SPECIES.length}
          </AppText>
          <Chip
            label="Rośnie teraz"
            selected={filter.inSeasonOnly}
            onPress={() => setFilter({ ...filter, inSeasonOnly: !filter.inSeasonOnly })}
          />
        </View>
        <Animated.View layout={LinearTransition.duration(durations.base)}>
          {results.length > 0 ? (
            <SpeciesGrid species={results} />
          ) : (
            <EmptyResults onClear={() => setFilter(EMPTY_FILTER)} />
          )}
        </Animated.View>
      </Screen>
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
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
