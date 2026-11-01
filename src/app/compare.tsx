import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AlertBanner } from '@/components/AlertBanner';
import { AppText } from '@/components/AppText';
import { ComparisonSlider } from '@/components/compare/ComparisonSlider';
import { DifferencesTable } from '@/components/compare/DifferencesTable';
import { NotFound } from '@/components/NotFound';
import { PhotoCredit } from '@/components/PhotoCredit';
import { getSpecies } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { findPair } from '@/features/atlas/findLookalikes';
import { EDIBILITY_LABELS } from '@/features/atlas/labels';
import { isDangerous } from '@/features/safety/danger';
import { spacing, useTheme } from '@/theme';

export default function CompareScreen() {
  const { first = '', second = '' } = useLocalSearchParams<{ first?: string; second?: string }>();
  const { colors } = useTheme();
  const pair = findPair(first, second);

  if (!pair) {
    return <NotFound message="Nie ma takiej pary sobowtórów." />;
  }

  // The first species is the one people want to pick, the second is the mistake.
  const wanted = getSpecies(pair.species[0]);
  const mistake = getSpecies(pair.species[1]);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      {isDangerous(mistake.edibility) ? (
        <AlertBanner
          tone={mistake.edibility === 'deadly' ? 'danger' : 'warning'}
          title="Pomyłka może być groźna"
        >
          Sobowtór po prawej ({mistake.namePl.toLowerCase()}) jest{' '}
          {EDIBILITY_LABELS[mistake.edibility].toLowerCase()}. Jeśli nie widzisz wyraźnie wszystkich
          różnic – nie zbieraj.
        </AlertBanner>
      ) : null}
      <View style={styles.slider}>
        <ComparisonSlider
          left={{ source: SPECIES_PHOTOS[wanted.id].source, label: wanted.namePl }}
          right={{ source: SPECIES_PHOTOS[mistake.id].source, label: mistake.namePl }}
        />
        <AppText variant="caption" color="textMuted" style={styles.hint}>
          Przeciągnij suwak w bok, żeby porównać zdjęcia.
        </AppText>
      </View>
      <DifferencesTable pair={pair} first={wanted} second={mistake} />
      <View style={styles.credits}>
        <PhotoCredit photo={SPECIES_PHOTOS[wanted.id]} />
        <PhotoCredit photo={SPECIES_PHOTOS[mistake.id]} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  slider: {
    gap: spacing.sm,
  },
  hint: {
    textAlign: 'center',
  },
  credits: {
    gap: spacing.xs,
  },
});
