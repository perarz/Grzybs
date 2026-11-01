import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EdibilityBadge } from '@/components/atlas/EdibilityBadge';
import { NotFound } from '@/components/NotFound';
import { FeatureSummary } from '@/components/species/FeatureSummary';
import { KeyFeatures } from '@/components/species/KeyFeatures';
import { LookalikeList } from '@/components/species/LookalikeList';
import { SeasonCard } from '@/components/species/SeasonCard';
import { SpeciesHero } from '@/components/species/SpeciesHero';
import { SpeciesWarnings } from '@/components/species/SpeciesWarnings';
import { findSpecies } from '@/data/species';
import { findLookalikes } from '@/features/atlas/findLookalikes';
import { spacing, useTheme } from '@/theme';

export default function SpeciesScreen() {
  const { id } = useLocalSearchParams<'/species/[id]'>();
  const { colors } = useTheme();
  const species = findSpecies(id);

  if (!species) {
    return <NotFound message="Tego gatunku nie ma w atlasie." />;
  }

  const lookalikes = findLookalikes(species.id);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <SpeciesHero species={species} />
      <View style={styles.body}>
        <View style={styles.names}>
          <EdibilityBadge edibility={species.edibility} />
          <AppText variant="display">{species.namePl}</AppText>
          <AppText variant="latin" color="textMuted">
            {species.nameLatin}
          </AppText>
          {species.otherNames.length > 0 ? (
            <AppText variant="caption" color="textMuted">
              Inne nazwy: {species.otherNames.join(', ')}
            </AppText>
          ) : null}
        </View>
        <SpeciesWarnings species={species} lookalikes={lookalikes} />
        <AppText>{species.description}</AppText>
        <SeasonCard months={species.months} />
        <KeyFeatures features={species.keyFeatures} />
        <FeatureSummary species={species} />
        {lookalikes.length > 0 ? <LookalikeList lookalikes={lookalikes} /> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  names: {
    gap: spacing.xs,
  },
});
