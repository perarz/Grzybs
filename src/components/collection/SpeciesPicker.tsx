import { useState } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { SearchField } from '@/components/SearchField';
import { SPECIES } from '@/data/species';
import { EMPTY_FILTER, filterSpecies } from '@/features/atlas/filterSpecies';
import { getCurrentMonth } from '@/features/atlas/season';
import type { Species } from '@/features/atlas/types';
import { spacing } from '@/theme';

export function SpeciesPicker({ onSelect }: { onSelect: (species: Species) => void }) {
  const [query, setQuery] = useState('');
  const matches = filterSpecies(SPECIES, { ...EMPTY_FILTER, query }, getCurrentMonth());
  return (
    <View style={{ gap: spacing.md }}>
      <AppText>Samodzielnie wybierz gatunek. Zdjęcie nie jest analizowane przez AI.</AppText>
      <SearchField value={query} onChangeText={setQuery} placeholder="Nazwa polska lub łacińska" />
      {matches.map((species) => (
        <Button
          key={species.id}
          label={species.namePl}
          variant="secondary"
          onPress={() => onSelect(species)}
        />
      ))}
      {matches.length === 0 ? <AppText>Nie znaleziono gatunku.</AppText> : null}
    </View>
  );
}
