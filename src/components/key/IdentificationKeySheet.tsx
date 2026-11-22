import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { CloseIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import type { SpeciesFilter } from '@/features/atlas/filterSpecies';
import {
  clearAnswer,
  describeAnswer,
  KEY_QUESTIONS,
  KEY_STEPS,
} from '@/features/atlas/identificationKey';
import { durations, spacing, useTheme } from '@/theme';

import { KeyFooter } from './KeyFooter';
import { KeyProgress } from './KeyProgress';
import { KeyStepAnswers } from './KeyStepAnswers';

type IdentificationKeySheetProps = {
  filter: SpeciesFilter;
  countMatches: (filter: SpeciesFilter) => number;
  /** Every answer updates the atlas right away. */
  onChange: (filter: SpeciesFilter) => void;
  onClose: () => void;
};

const CLOSE_ICON_SIZE = 22;

/** The identification key: one question at a time, answered with illustrated tiles. */
export function IdentificationKeySheet({
  filter,
  countMatches,
  onChange,
  onClose,
}: IdentificationKeySheetProps) {
  const { colors } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [isGoingBack, setGoingBack] = useState(false);

  const step = KEY_STEPS[stepIndex];
  const isLastStep = stepIndex === KEY_STEPS.length - 1;
  const matchCount = countMatches(filter);

  function goTo(index: number) {
    setGoingBack(index < stepIndex);
    setStepIndex(index);
  }

  function answer(nextFilter: SpeciesFilter) {
    onChange(nextFilter);
    // A chosen answer moves on; taking an answer back stays on the question.
    if (describeAnswer(nextFilter, step) !== null && !isLastStep) {
      goTo(stepIndex + 1);
    }
  }

  function skip(close: () => void) {
    onChange(clearAnswer(filter, step));
    if (isLastStep) {
      close();
    } else {
      goTo(stepIndex + 1);
    }
  }

  return (
    <BottomSheet
      onClose={onClose}
      header={(close) => (
        <>
          <View style={styles.titleRow}>
            <AppText variant="label" color="accent">
              Klucz do oznaczania · {stepIndex + 1} / {KEY_STEPS.length}
            </AppText>
            <PressableScale
              haptic="tap"
              accessibilityRole="button"
              accessibilityLabel="Zamknij klucz"
              hitSlop={spacing.md}
              onPress={close}
            >
              <CloseIcon color={colors.textMuted} size={CLOSE_ICON_SIZE} />
            </PressableScale>
          </View>
          <KeyProgress currentIndex={stepIndex} filter={filter} onJump={goTo} />
        </>
      )}
    >
      {(close) => (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
            {/* A new key per question replays the slide-in: from the right going on, from the left going back. */}
            <Animated.View
              key={step}
              entering={(isGoingBack ? FadeInLeft : FadeInRight).duration(durations.base)}
              style={styles.question}
            >
              <AppText variant="title">{KEY_QUESTIONS[step].question}</AppText>
              <AppText color="textMuted">{KEY_QUESTIONS[step].hint}</AppText>
              <View style={styles.answers}>
                <KeyStepAnswers
                  step={step}
                  filter={filter}
                  countMatches={countMatches}
                  onAnswer={answer}
                />
              </View>
            </Animated.View>
          </ScrollView>
          <KeyFooter
            canGoBack={stepIndex > 0}
            matchCount={matchCount}
            onBack={() => goTo(stepIndex - 1)}
            onSkip={() => skip(close)}
            onShowResults={close}
          />
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scroll: {
    flexShrink: 1,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  question: {
    gap: spacing.xs,
  },
  answers: {
    marginTop: spacing.lg,
  },
});
