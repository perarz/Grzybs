import { useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import {
  onboardingQuestions,
  onboardingScore,
  type Experience,
} from '@/features/onboarding/questions';
import { durations, useTheme } from '@/theme';
import { styles as s } from './styles';
import { OnboardingChoices } from './OnboardingChoices';

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
  const result =
    level === 'new'
      ? 'Dobry początek.'
      : score === total
        ? 'Las Ci niestraszny.'
        : 'Zawsze jest coś do odkrycia.';
  return (
    <Modal
      visible
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
                  GRZYBNIK / NA START
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
                        : `${step + 1} / ${questions.length} · ${'fun' in question ? 'Z PRZYMRUŻENIEM OKA' : question.format === 'photo' ? 'WYBIERZ ZDJĘCIE' : question.format === 'boolean' ? 'PRAWDA CZY FAŁSZ' : question.format === 'scenario' ? 'CO ROBISZ?' : 'SPRAWDŹ OKO'}`}
                  </AppText>
                  <AppText variant="title">
                    {step < 0 ? 'Jak dobrze\nznasz las?' : done ? result : question.title}
                  </AppText>
                  {step < 0 && <AppText color="textMuted">Dopasujmy Naukę do Ciebie.</AppText>}
                  {done && (
                    <AppText color="textMuted">
                      {level === 'new'
                        ? 'W Nauce zaczniesz od jednego gatunku dziennie.'
                        : 'W Nauce czekają podobne gatunki i krótkie quizy.'}
                    </AppText>
                  )}
                </View>
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
              <View style={s.footer}>
                {error && (
                  <AppText color="danger" accessibilityRole="alert">
                    {error}
                  </AppText>
                )}
                {step >= 0 && !done && (
                  <View style={s.progress}>
                    {questions.map((_, i) => (
                      <View
                        key={i}
                        style={[
                          s.segment,
                          { backgroundColor: i <= step ? colors.glow : colors.border },
                        ]}
                      />
                    ))}
                  </View>
                )}
                <Button
                  disabled={busy || (step >= 0 && !done && !answered)}
                  label={
                    busy
                      ? 'Zapisuję…'
                      : step < 0
                        ? `Zaczynamy · ${questions.length} ${questions.length === 4 ? 'pytania' : 'pytań'}`
                        : done
                          ? 'Wchodzę do lasu'
                          : step === questions.length - 1
                            ? 'Zobacz wynik'
                            : 'Dalej'
                  }
                  onPress={() => (done ? void onFinish(level, score) : setStep(step + 1))}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Modal>
  );
}
