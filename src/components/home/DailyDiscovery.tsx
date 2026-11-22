import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FlipInEasyY } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { SPECIES } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { EDIBILITY_LABELS } from '@/features/atlas/labels';
import { formatSeason } from '@/features/atlas/season';
import type { Species } from '@/features/atlas/types';
import { selectionHaptic, successHaptic } from '@/features/feedback/haptics';
import { dailyRiddle } from '@/features/learn/dailyRiddle';
import { useDailyReveal } from '@/features/learn/useDailyReveal';
import { useDailySpecies } from '@/features/learn/useDailySpecies';
import { durations, layout, radius, spacing, useTheme } from '@/theme';
import { DailyRiddleQuestion } from './DailyRiddleQuestion';

/** The species of the day starts as a riddle; after a guess it shows itself and one fact. */
export function DailyDiscovery() {
  const species = useDailySpecies();
  const riddle = dailyRiddle(species, SPECIES);
  const { revealed, reveal } = useDailyReveal();
  const [guess, setGuess] = useState<Species | null>(null);
  const { colors } = useTheme();
  const name = species.nameCommon ?? species.namePl;

  function answer(choice: Species) {
    if (choice.id === species.id) successHaptic();
    else selectionHaptic();
    setGuess(choice);
    reveal();
  }

  return (
    <View style={styles.section}>
      <AppText variant="label" color="textMuted">
        {revealed ? 'Grzyb dnia' : 'Zagadka dnia'}
      </AppText>
      {!revealed ? (
        <DailyRiddleQuestion species={species} riddle={riddle} onGuess={answer} />
      ) : (
        <Animated.View entering={FlipInEasyY.duration(durations.slow)} style={styles.section}>
          {guess && (
            <AppText variant="bodyStrong" color={guess.id === species.id ? 'season' : 'accent'}>
              {guess.id === species.id
                ? 'Brawo, zgadłeś!'
                : `Tym razem nie – to ${name.toLowerCase()}.`}
            </AppText>
          )}
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Grzyb dnia: ${species.namePl}`}
            onPress={() => router.push({ pathname: '/species/[id]', params: { id: species.id } })}
            style={styles.row}
          >
            <Image
              source={SPECIES_PHOTOS[species.id].source}
              style={[styles.photo, { backgroundColor: colors.surface }]}
              contentFit="cover"
            />
            <View style={styles.copy}>
              <AppText variant="heading">{name}</AppText>
              <AppText variant="caption" color="textMuted">
                {EDIBILITY_LABELS[species.edibility]} · {formatSeason(species.months)}
              </AppText>
            </View>
            <FieldIcon name="arrowRight" size={layout.icon} color={colors.glow} />
          </PressableScale>
          <View style={[styles.fact, { borderColor: colors.aqua }]}>
            <AppText variant="label" color="textMuted">
              Warto wiedzieć
            </AppText>
            <AppText>{riddle.fact}</AppText>
          </View>
        </Animated.View>
      )}
      <View style={[styles.rule, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  photo: { width: layout.thumbnail, height: layout.thumbnail, borderRadius: radius.md },
  fact: { gap: spacing.xs, paddingLeft: spacing.md, borderLeftWidth: layout.accentStroke },
  rule: { height: StyleSheet.hairlineWidth, marginTop: spacing.xs },
});
