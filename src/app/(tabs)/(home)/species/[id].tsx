import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { AddSpeciesPhotoButton } from '@/components/collection/AddSpeciesPhotoButton';
import { SpeciesFinds } from '@/components/collection/SpeciesFinds';
import { BackButton } from '@/components/BackButton';
import { CollapsingTopBar, TOP_BAR_HEIGHT } from '@/components/CollapsingTopBar';
import { NotFound } from '@/components/NotFound';
import { PhotoCredit } from '@/components/PhotoCredit';
import { SectionHeader } from '@/components/SectionHeader';
import { SpeciesQuickFacts } from '@/components/species/SpeciesQuickFacts';
import { SpeciesDetails } from '@/components/species/SpeciesDetails';
import { KeyFeatures } from '@/components/species/KeyFeatures';
import { LookalikeList } from '@/components/species/LookalikeList';
import { HERO_ASPECT, SpeciesHero } from '@/components/species/SpeciesHero';
import { SpeciesTitle } from '@/components/species/SpeciesTitle';
import { SpeciesWarnings } from '@/components/species/SpeciesWarnings';
import { findSpecies } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { findLookalikes } from '@/features/atlas/findLookalikes';
import { radius, spacing, useTheme } from '@/theme';

export default function SpeciesScreen() {
  const { id } = useLocalSearchParams<'/species/[id]'>();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const [isBarSolid, setBarSolid] = useState(false);

  // The top bar turns solid once the photo has scrolled away under it.
  const revealAt = width * HERO_ASPECT - insets.top - TOP_BAR_HEIGHT;
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });
  // Light status bar icons over the photo, theme-coloured ones over the paper bar.
  useAnimatedReaction(
    () => scrollY.get() > revealAt,
    (isSolid, wasSolid) => {
      if (isSolid !== wasSolid) scheduleOnRN(setBarSolid, isSolid);
    },
  );

  const species = findSpecies(id);
  if (!species) {
    return <NotFound message="Tego gatunku nie ma w atlasie." />;
  }
  const lookalikes = findLookalikes(species.id);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={isBarSolid && !isDark ? 'dark' : 'light'} />
      <Animated.ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <SpeciesHero species={species} scrollY={scrollY} />
        {/* A sheet of paper laid over the photo – it slides up over it when scrolling. */}
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <SpeciesTitle species={species} />
          <AddSpeciesPhotoButton key={`photo-${species.id}`} species={species} />
          <SpeciesWarnings species={species} lookalikes={lookalikes} />
          <SpeciesQuickFacts species={species} />
          <KeyFeatures features={species.keyFeatures} />

          {lookalikes.length > 0 ? <LookalikeList lookalikes={lookalikes} /> : null}
          <SpeciesDetails key={species.id} species={species} />
          <SpeciesFinds species={species} />
          <View style={styles.source}>
            <SectionHeader title="Źródło zdjęcia" />
            <PhotoCredit photo={SPECIES_PHOTOS[species.id]} />
          </View>
        </View>
      </Animated.ScrollView>
      <CollapsingTopBar
        scrollY={scrollY}
        title={species.nameCommon ?? species.namePl}
        revealAt={revealAt}
        left={<BackButton />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  sheet: {
    marginTop: -radius.lg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.lg,
  },
  source: {
    gap: spacing.sm,
  },
});
