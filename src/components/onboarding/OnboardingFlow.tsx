import { useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import {
  onboardingQuestions,
  onboardingScore,
  type Experience,
} from '@/features/onboarding/questions';
import { durations, useTheme } from '@/theme';
import { styles as s } from './styles';
import { OnboardingChoices } from './OnboardingChoices';
import { OnboardingFooter } from './OnboardingFooter';
import { OnboardingHero } from './OnboardingHero';

type Props = {
  initialExperience?: Experience;
  busy: boolean;
  error: string | null;
  onFinish: (level: Experience, score: number | null) => Promise<void>;
  onDismiss?: () => void;
};
export function OnboardingFlow({
  busy,
  error,
  onFinish,
  onDismiss,
  initialExperience = 'new',
}: Props) {
  const { colors } = useTheme();
  const [level, setLevel] = useState<Experience>(initialExperience);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const questions = onboardingQuestions(level);
  const question = questions[step];
  const done = step === questions.length;
  const selected = answers[step];
  const answered = selected !== undefined;
  const score = onboardingScore(level, answers);
  const total = questions.filter((q) => !('fun' in q)).length;
  return (
    <Modal
      visible
      // Draws under the system bars, so the screen's own colour fills them – no grey strip.
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      onRequestClose={() => {
        if (busy) return;
        if (step >= 0) {
          setStep(-1);
          setAnswers([]);
        } else onDismiss?.();
      }}
    >
      <GestureHandlerRootView style={s.safe}>
        <SafeAreaProvider>
          <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={s.scroll}>
              <View style={s.top}>
                <AppText variant="label" color="accent">
                  GRZYBS / NA START
                </AppText>
                <PressableScale
                  accessibilityRole="button"
                  disabled={busy}
                  style={s.skip}
                  onPress={() => (onDismiss ? onDismiss() : void onFinish(level, null))}
                >
                  <AppText variant="caption" color="textMuted">
                    {onDismiss ? 'Zamknij' : 'Pomiń'}
                  </AppText>
                </PressableScale>
              </View>
              <Animated.View
                key={step}
                entering={FadeIn.duration(durations.fast).reduceMotion(ReduceMotion.System)}
                style={s.content}
              >
                <OnboardingHero
                  step={step}
                  done={done}
                  level={level}
                  question={question}
                  questionCount={questions.length}
                  score={score}
                  total={total}
                />
                <OnboardingChoices
                  step={step}
                  done={done}
                  level={level}
                  setLevel={setLevel}
                  question={question}
                  selected={selected}
                  setAnswers={setAnswers}
                />
                {done && (
                  <AppText variant="caption" color="textMuted">
                    To rozgrzewka, nie certyfikat rozpoznawania grzybów.
                  </AppText>
                )}
              </Animated.View>
              <OnboardingFooter
                step={step}
                questionCount={questions.length}
                done={done}
                answered={answered}
                busy={busy}
                error={error}
                onNext={() => (done ? void onFinish(level, score) : setStep(step + 1))}
              />
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Modal>
  );
}
