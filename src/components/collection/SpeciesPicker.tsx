import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { SearchField } from '@/components/SearchField';
import { SPECIES } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { EMPTY_FILTER, filterSpecies } from '@/features/atlas/filterSpecies';
import { getCurrentMonth } from '@/features/atlas/season';
import type { Species } from '@/features/atlas/types';
import { layout, radius, spacing, useTheme } from '@/theme';

/** The user names the find – a list of species with a small atlas photo to compare against. */
export function SpeciesPicker({ onSelect }: { onSelect: (species: Species) => void }) {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const matches = filterSpecies(SPECIES, { ...EMPTY_FILTER, query }, getCurrentMonth());
  return (
    <View style={styles.list}>
      <AppText variant="heading">Jaki to gatunek?</AppText>
      <SearchField value={query} onChangeText={setQuery} placeholder="Nazwa polska lub łacińska" />
      {matches.map((species) => (
        <PressableScale
          key={species.id}
          accessibilityRole="button"
          accessibilityLabel={species.namePl}
          onPress={() => onSelect(species)}
          style={[styles.row, { borderColor: colors.border }]}
        >
          <Image
            source={SPECIES_PHOTOS[species.id].source}
            style={[styles.thumbnail, { backgroundColor: colors.surface }]}
            contentFit="cover"
          />
          <View style={styles.names}>
            <AppText variant="bodyStrong">{species.namePl}</AppText>
            <AppText variant="latinSmall" color="textMuted">
              {species.nameLatin}
            </AppText>
          </View>
        </PressableScale>
      ))}
      {matches.length === 0 ? <AppText color="textMuted">Nie znaleziono gatunku.</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  thumbnail: { width: layout.touchTarget, height: layout.touchTarget, borderRadius: radius.sm },
  names: { flex: 1 },
});
