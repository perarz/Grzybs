import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { FieldIcon } from '@/components/icons/FieldIcon';
import type { Experience, OnboardingQuestion } from '@/features/onboarding/questions';
import { useTheme } from '@/theme';
import { styles as s } from './styles';

type Props = {
  step: number;
  done: boolean;
  level: Experience;
  question: OnboardingQuestion;
  questionCount: number;
  score: number;
  total: number;
};

/** The emblem, label and heading above the choices – welcome, a question, or the result. */
export function OnboardingHero({
  step,
  done,
  level,
  question,
  questionCount,
  score,
  total,
}: Props) {
  const { colors } = useTheme();
  const result =
    level === 'new'
      ? 'Dobry początek.'
      : score === total
        ? 'Las Ci niestraszny.'
        : 'Zawsze jest coś do odkrycia.';
  return (
    <View style={s.hero}>
      <View
        style={[
          s.emblem,
          step >= 0 && !done && { display: 'none' },
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        <FieldIcon name={question?.icon ?? 'mushrooms'} size={48} color={colors.glow} />
      </View>
      <AppText variant="label" color="textMuted">
        {step < 0
          ? 'TWÓJ LEŚNY STAŻ'
          : done
            ? `${score} / ${total} · MAŁA ROZGRZEWKA`
            : `${step + 1} / ${questionCount} · ${'fun' in question ? 'Z PRZYMRUŻENIEM OKA' : question.format === 'photo' ? 'WYBIERZ ZDJĘCIE' : question.format === 'boolean' ? 'PRAWDA CZY FAŁSZ' : question.format === 'scenario' ? 'CO ROBISZ?' : 'SPRAWDŹ OKO'}`}
      </AppText>
      <AppText variant="title">
        {step < 0 ? 'Jak dobrze\nznasz las?' : done ? result : question.title}
      </AppText>
      {step < 0 && <AppText color="textMuted">Kilka pytań na rozgrzewkę.</AppText>}
      {done && (
        <AppText color="textMuted">
          {level === 'new'
            ? 'W Nauce zaczniesz od pierwszego koszyka: prawdziwka i podgrzybka.'
            : 'W Nauce czekają krótkie lekcje, sobowtóry i testy etapów.'}
        </AppText>
      )}
    </View>
  );
}
