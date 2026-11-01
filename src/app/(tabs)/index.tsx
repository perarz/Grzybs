import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { CategoryChips } from '@/components/atlas/CategoryChips';
import { FeatureFilterPanel } from '@/components/atlas/FeatureFilterPanel';
import { SpeciesGrid } from '@/components/atlas/SpeciesGrid';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
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
import { spacing } from '@/theme';

export default function AtlasScreen() {
  const [filter, setFilter] = useState<SpeciesFilter>(EMPTY_FILTER);
  const [isPanelOpen, setPanelOpen] = useState(false);

  const currentMonth = getCurrentMonth();
  const results = filterSpecies(SPECIES, filter, currentMonth);
  const featureCount = countFeatureFilters(filter);

  return (
    <Screen title="Atlas" subtitle="Poznaj gatunki i odblokuj je swoimi zdjęciami">
      <SearchField
        value={filter.query}
        onChangeText={(query) => setFilter({ ...filter, query })}
        placeholder="Szukaj, np. kurka albo boletus"
      />
      <CategoryChips
        selected={filter.edibility}
        onChange={(edibility) => setFilter({ ...filter, edibility })}
      />
      <View style={styles.resultsRow}>
        <AppText variant="caption" color="textMuted">
          Gatunków: {results.length} z {SPECIES.length}
        </AppText>
        <Chip
          label={featureCount > 0 ? `Filtr cech · ${featureCount}` : 'Filtr cech'}
          selected={isPanelOpen || featureCount > 0}
          onPress={() => setPanelOpen(!isPanelOpen)}
        />
      </View>
      {isPanelOpen ? (
        <FeatureFilterPanel filter={filter} currentMonth={currentMonth} onChange={setFilter} />
      ) : null}
      {results.length > 0 ? (
        <SpeciesGrid species={results} />
      ) : (
        <Card style={styles.empty}>
          <AppText variant="heading">Nic nie pasuje</AppText>
          <AppText color="textMuted">Żaden gatunek w atlasie nie ma wszystkich tych cech.</AppText>
          <Button
            label="Wyczyść filtry"
            variant="secondary"
            onPress={() => setFilter(EMPTY_FILTER)}
          />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
  },
});
