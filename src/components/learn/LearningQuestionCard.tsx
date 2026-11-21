import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import type { LearningQuestion } from '@/features/learn/learning';
import { durations, radius, spacing, useTheme } from '@/theme';

import { LearningPairPhotos } from './LearningPairPhotos';

type Props = {
  question: LearningQuestion;
  selected?: string;
  last: boolean;
  onAnswer: (id: string) => void;
  onNext: () => void;
};

export function LearningQuestionCard({ question, selected, last, onAnswer, onNext }: Props) {
  const { colors } = useTheme();
  const answered = selected !== undefined;
  const correct = selected === question.correctOptionId;
  return (
    <View style={styles.content}>
      <AppText variant="title">{question.prompt}</AppText>
      {question.options.map((option) => {
        const isCorrect = answered && option.id === question.correctOptionId;
        const isWrong = answered && option.id === selected && !isCorrect;
        return (
          <PressableScale
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ disabled: answered, selected: option.id === selected }}
            disabled={answered}
            onPress={() => onAnswer(option.id)}
          >
            <Animated.View
              style={[
                styles.option,
                {
                  borderColor: isCorrect ? colors.glow : isWrong ? colors.danger : colors.border,
                  backgroundColor: isCorrect
                    ? colors.glow
                    : isWrong
                      ? colors.dangerMuted
                      : colors.surface,
                  transitionProperty: ['backgroundColor', 'borderColor'],
                  transitionDuration: durations.fast,
                },
              ]}
            >
              <AppText color={isCorrect ? 'onGlow' : 'text'}>{option.label}</AppText>
              {isCorrect || isWrong ? (
                <AppText variant="label" color={isCorrect ? 'onGlow' : 'danger'}>
                  {isCorrect ? 'Prawidłowa odpowiedź' : 'Twoja odpowiedź'}
                </AppText>
              ) : null}
            </Animated.View>
          </PressableScale>
        );
      })}
      {answered ? (
        <Animated.View
          entering={FadeInDown.duration(durations.base)}
          style={styles.content}
          accessibilityLiveRegion="polite"
        >
          <AppText variant="heading" color={correct ? 'accent' : 'text'}>
            {correct ? 'Zgadza się!' : 'Zapamiętaj na następny raz'}
          </AppText>
          <AppText>{question.explanation}</AppText>
          {question.speciesIds.length === 2 ? (
            <LearningPairPhotos ids={question.speciesIds} />
          ) : null}
          <Button label={last ? 'Zobacz wynik' : 'Następne pytanie'} onPress={onNext} />
        </Animated.View>
      ) : (
        <AppText variant="caption" color="textMuted">
          Wybierz jedną odpowiedź. Potem pokażemy wyjaśnienie.
        </AppText>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  option: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
  },
});
