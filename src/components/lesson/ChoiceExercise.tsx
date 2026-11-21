import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { PhotoCredit } from '@/components/PhotoCredit';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { Exercise } from '@/features/learn/exercises';
import { durations, radius, spacing, useTheme } from '@/theme';

import { ChoiceOptions } from './ChoiceOptions';

type Choice = Extract<Exercise, { kind: 'choice' }>;

type ChoiceExerciseProps = {
  exercise: Choice;
  selected: string | null;
  status: 'answering' | 'correct' | 'wrong';
  onSelect: (id: string) => void;
};

const SHAKE = 10;

/** One question: the prompt, maybe a photo, and the answers – they shake on a wrong answer. */
export function ChoiceExercise({ exercise, selected, status, onSelect }: ChoiceExerciseProps) {
  const { colors } = useTheme();
  const offset = useSharedValue(0);

  useEffect(() => {
    if (status !== 'wrong') return;
    const step = { duration: durations.fast / 3 };
    offset.set(
      withSequence(
        withTiming(-SHAKE, step),
        withTiming(SHAKE, step),
        withTiming(-SHAKE / 2, step),
        withTiming(0, step),
      ),
    );
  }, [offset, status]);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: offset.get() }] }));

  return (
    <View style={styles.content}>
      <AppText variant="title" accessibilityRole="header">
        {exercise.prompt}
      </AppText>
      {exercise.photo ? (
        <View style={styles.photoBlock}>
          <Image
            source={SPECIES_PHOTOS[exercise.photo].source}
            contentFit="cover"
            transition={durations.base}
            style={[styles.photo, { backgroundColor: colors.surfaceMuted }]}
            accessibilityLabel="Grzyb do rozpoznania"
          />
          <PhotoCredit photo={SPECIES_PHOTOS[exercise.photo]} />
        </View>
      ) : null}
      <Animated.View style={shakeStyle}>
        <ChoiceOptions
          options={exercise.options}
          layout={exercise.layout}
          selected={selected}
          correctId={exercise.correctId}
          checked={status !== 'answering'}
          onSelect={onSelect}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  photoBlock: { gap: spacing.xs },
  photo: { width: '100%', aspectRatio: 16 / 10, borderRadius: radius.lg },
});
