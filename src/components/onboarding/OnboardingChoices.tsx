import { View } from 'react-native';
import type { Dispatch, SetStateAction } from 'react';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import {
  EXPERIENCES,
  type Experience,
  type OnboardingQuestion,
} from '@/features/onboarding/questions';
import { useTheme } from '@/theme';
import { QuestionAnswers } from './QuestionAnswers';
import { styles as s } from './styles';
type Props = {
  step: number;
  done: boolean;
  level: Experience;
  setLevel: (level: Experience) => void;
  question: OnboardingQuestion;
  selected: number | undefined;
  setAnswers: Dispatch<SetStateAction<number[]>>;
};
export function OnboardingChoices({
  step,
  done,
  level,
  setLevel,
  question,
  selected,
  setAnswers,
}: Props) {
  const { colors } = useTheme();
  const answered = selected !== undefined;
  return (
    <>
      <View style={s.choices}>
        {step < 0
          ? EXPERIENCES.map((item) => (
              <PressableScale
                key={item.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: level === item.id }}
                onPress={() => setLevel(item.id)}
                style={[
                  s.choice,
                  {
                    borderColor: level === item.id ? colors.glow : colors.border,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <FieldIcon
                  name={item.icon}
                  size={26}
                  color={level === item.id ? colors.glow : colors.textMuted}
                />
                <View style={s.choiceText}>
                  <AppText variant="heading">{item.title}</AppText>
                  <AppText variant="caption" color="textMuted">
                    {item.subtitle}
                  </AppText>
                </View>
                <AppText color={level === item.id ? 'glow' : 'textMuted'}>
                  {level === item.id ? '●' : '○'}
                </AppText>
              </PressableScale>
            ))
          : !done && (
              <QuestionAnswers
                key={step}
                question={question}
                selected={selected}
                onSelect={(index) =>
                  setAnswers((previous) =>
                    previous[step] === undefined ? [...previous, index] : previous,
                  )
                }
              />
            )}
      </View>
      {answered && !done && (
        <View
          accessibilityLiveRegion="polite"
          style={[s.feedback, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <AppText variant="heading">
            {'fun' in question
              ? 'Miejscówka bezpieczna.'
              : selected === question.correct
                ? 'Dokładnie.'
                : 'Warto zapamiętać.'}
          </AppText>
          <AppText color="textMuted">{question.note}</AppText>
        </View>
      )}
    </>
  );
}
