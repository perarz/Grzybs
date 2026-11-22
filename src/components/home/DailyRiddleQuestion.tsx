import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { Species } from '@/features/atlas/types';
import type { DailyRiddle } from '@/features/learn/dailyRiddle';
import { layout, radius, spacing, useTheme } from '@/theme';

// Enough blur that the photo is a hint, not the answer.
const HIDDEN_BLUR = 18;

type Props = { species: Species; riddle: DailyRiddle; onGuess: (guess: Species) => void };

/** The hidden daily species: a blurred photo, a few hints and three names to choose from. */
export function DailyRiddleQuestion({ species, riddle, onGuess }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.content}>
      <View style={styles.row}>
        <View style={[styles.photo, { backgroundColor: colors.surface }]}>
          <Image
            source={SPECIES_PHOTOS[species.id].source}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            blurRadius={HIDDEN_BLUR}
          />
          <View style={[styles.mystery, { backgroundColor: colors.backdrop }]}>
            <AppText variant="title" color="accent">
              ?
            </AppText>
          </View>
        </View>
        <View style={styles.clues}>
          <AppText variant="heading">Kto to?</AppText>
          {riddle.clues.map((clue) => (
            <AppText key={clue} variant="caption" color="textMuted">
              {clue}
            </AppText>
          ))}
        </View>
      </View>
      <View style={styles.options}>
        {riddle.options.map((option) => (
          <Chip
            key={option.id}
            label={option.nameCommon ?? option.namePl}
            selected={false}
            onPress={() => onGuess(option)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  photo: {
    width: layout.thumbnail,
    height: layout.thumbnail,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  mystery: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  clues: { flex: 1, gap: spacing.xs },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
