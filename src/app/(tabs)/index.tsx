import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { CategoryTabs } from '@/components/atlas/CategoryTabs';
import { EmptyResults } from '@/components/atlas/EmptyResults';
import { FeatureFilterPanel } from '@/components/atlas/FeatureFilterPanel';
import { FilterToggle } from '@/components/atlas/FilterToggle';
import { SpeciesGrid } from '@/components/atlas/SpeciesGrid';
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
  const [isPanelOpen, setPanelOpen] = useState(false);

  const currentMonth = getCurrentMonth();
  // The category tabs count species that match everything else, so filter in two steps.
  const matchingAnyCategory = filterSpecies(SPECIES, { ...filter, edibility: null }, currentMonth);
  const results = matchingAnyCategory.filter(
    (species) => filter.edibility === null || species.edibility === filter.edibility,
  );

  return (
    <Screen
      eyebrow={`Zielnik · ${SPECIES.length} gatunków`}
      title="Atlas"
      subtitle="Poznaj gatunki i odblokuj je zdjęciami swoich znalezisk."
    >
      <SearchField
        value={filter.query}
        onChangeText={(query) => setFilter({ ...filter, query })}
        placeholder="Szukaj, np. kurka albo boletus"
      />
      <CategoryTabs
        species={matchingAnyCategory}
        selected={filter.edibility}
        onChange={(edibility) => setFilter({ ...filter, edibility })}
      />
      <View style={styles.resultsRow}>
        <AppText variant="label" color="textMuted">
          Okazy: {results.length} / {SPECIES.length}
        </AppText>
        <FilterToggle
          isOpen={isPanelOpen}
          activeCount={countFeatureFilters(filter)}
          onPress={() => setPanelOpen(!isPanelOpen)}
        />
      </View>
      {isPanelOpen ? (
        <Animated.View
          entering={FadeInDown.duration(durations.base)}
          exiting={FadeOutUp.duration(durations.fast)}
        >
          <FeatureFilterPanel filter={filter} currentMonth={currentMonth} onChange={setFilter} />
        </Animated.View>
      ) : null}
      <Animated.View layout={LinearTransition.duration(durations.base)}>
        {results.length > 0 ? (
          <SpeciesGrid species={results} />
        ) : (
          <EmptyResults onClear={() => setFilter(EMPTY_FILTER)} />
        )}
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
