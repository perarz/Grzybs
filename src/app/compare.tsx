import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AlertBanner } from '@/components/AlertBanner';
import { AppText } from '@/components/AppText';
import { ComparisonSlider } from '@/components/compare/ComparisonSlider';
import { DifferencesTable } from '@/components/compare/DifferencesTable';
import { NotFound } from '@/components/NotFound';
import { PhotoCredit } from '@/components/PhotoCredit';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { getSpecies } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { findPair } from '@/features/atlas/findLookalikes';
import { EDIBILITY_LABELS } from '@/features/atlas/labels';
import { warningHaptic } from '@/features/feedback/haptics';
import { isDangerous } from '@/features/safety/danger';
import { spacing } from '@/theme';

export default function CompareScreen() {
  const { first = '', second = '' } = useLocalSearchParams<{ first?: string; second?: string }>();
  const pair = findPair(first, second);
  const isDeadly = pair ? getSpecies(pair.species[1]).edibility === 'deadly' : false;

  // A deadly lookalike is announced by touch too, not only by colour.
  useEffect(() => {
    if (isDeadly) warningHaptic();
  }, [isDeadly]);

  if (!pair) {
    return <NotFound message="Nie ma takiej pary sobowtórów." />;
  }

  // The first species is the one people want to pick, the second is the mistake.
  const wanted = getSpecies(pair.species[0]);
  const mistake = getSpecies(pair.species[1]);

  return (
    <Screen eyebrow="Sobowtóry" title="Porównanie" showBack>
      {isDangerous(mistake.edibility) ? (
        <AlertBanner tone={isDeadly ? 'danger' : 'warning'} title="Pomyłka może być groźna">
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
        <AppText variant="label" color="textMuted" style={styles.hint}>
          ← Przeciągnij suwak →
        </AppText>
      </View>
      <DifferencesTable pair={pair} first={wanted} second={mistake} />
      <View style={styles.credits}>
        <SectionHeader title="Źródła zdjęć" />
        <PhotoCredit photo={SPECIES_PHOTOS[wanted.id]} />
        <PhotoCredit photo={SPECIES_PHOTOS[mistake.id]} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  slider: {
    gap: spacing.sm,
  },
  hint: {
    textAlign: 'center',
  },
  credits: {
    gap: spacing.sm,
  },
});
