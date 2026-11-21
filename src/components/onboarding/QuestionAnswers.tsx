import { useState } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PhotoCredit } from '@/components/PhotoCredit';
import { PressableScale } from '@/components/PressableScale';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { OnboardingQuestion } from '@/features/onboarding/questions';
import { radius, spacing, useTheme } from '@/theme';
import { styles as s } from './styles';

type Props = {
  question: OnboardingQuestion;
  selected: number | undefined;
  onSelect: (index: number) => void;
};
export function QuestionAnswers({ question, selected, onSelect }: Props) {
  const { colors } = useTheme();
  const answered = selected !== undefined;
  const visual = question.format === 'photo';
  const binary = question.format === 'boolean';
  const [failed, setFailed] = useState(false);
  return (
    <View style={visual || binary ? styles.row : s.choices}>
      {question.answers.map((answer, index) => {
        const photoId = question.photos?.[index];
        const photo = photoId ? SPECIES_PHOTOS[photoId] : undefined;
        const correct =
          answered && (question.fun ? selected === index : index === question.correct);
        const borderColor = correct
          ? colors.glow
          : selected === index
            ? colors.danger
            : colors.border;
        return (
          <View key={answer} style={visual || binary ? styles.column : undefined}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={
                answer +
                (answered
                  ? correct
                    ? ', poprawna odpowiedź'
                    : selected === index
                      ? ', błędna odpowiedź'
                      : ''
                  : '')
              }
              accessibilityState={{
                disabled: answered || (visual && failed),
                selected: selected === index,
              }}
              disabled={answered || (visual && failed)}
              onPress={() => onSelect(index)}
              style={[
                s.choice,
                visual ? styles.photoCard : binary ? styles.binary : undefined,
                { backgroundColor: colors.surface, borderColor },
              ]}
            >
              {photo && (
                <Image
                  source={photo.source}
                  style={styles.image}
                  contentFit="cover"
                  accessible={false}
                  onError={() => setFailed(true)}
                />
              )}
              <View style={visual ? styles.photoLabel : styles.answerLabel}>
                {binary && (
                  <AppText variant="title" color="glow">
                    {index === 0 ? '✓' : '×'}
                  </AppText>
                )}
                {!visual && !binary && (
                  <AppText variant="label" color="textMuted">
                    {String.fromCharCode(65 + index)}
                  </AppText>
                )}
                <AppText style={!visual && !binary ? s.choiceText : undefined}>
                  {answer}
                  {correct ? ' ✓' : ''}
                </AppText>
              </View>
            </PressableScale>
            {photo && <PhotoCredit photo={photo} />}
          </View>
        );
      })}
      {visual && failed && (
        <AppText accessibilityRole="alert" color="danger">
          Nie udało się wczytać zdjęcia. Możesz pominąć quiz.
        </AppText>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  column: { flex: 1, gap: spacing.sm },
  photoCard: {
    padding: 0,
    overflow: 'hidden',
    flexDirection: 'column',
    gap: 0,
    borderRadius: radius.lg,
  },
  image: { width: '100%', aspectRatio: 0.9 },
  photoLabel: { padding: spacing.md, alignItems: 'center' },
  answerLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  binary: { justifyContent: 'center', paddingVertical: spacing.xl },
});
