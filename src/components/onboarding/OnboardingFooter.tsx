import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme';
import { styles as s } from './styles';

type Props = {
  step: number;
  questionCount: number;
  done: boolean;
  answered: boolean;
  busy: boolean;
  error: string | null;
  onNext: () => void;
};

/** Error message, progress bar and the main button. */
export function OnboardingFooter({
  step,
  questionCount,
  done,
  answered,
  busy,
  error,
  onNext,
}: Props) {
  const { colors } = useTheme();
  const label = busy
    ? 'Zapisuję…'
    : step < 0
      ? `Zaczynamy · ${questionCount} ${questionCount === 4 ? 'pytania' : 'pytań'}`
      : done
        ? 'Wchodzę do lasu'
        : step === questionCount - 1
          ? 'Zobacz wynik'
          : 'Dalej';
  return (
    <View style={s.footer}>
      {error && (
        <AppText color="danger" accessibilityRole="alert">
          {error}
        </AppText>
      )}
      {step >= 0 && !done && (
        <View style={s.progress}>
          {Array.from({ length: questionCount }, (_, i) => (
            <View
              key={i}
              style={[s.segment, { backgroundColor: i <= step ? colors.glow : colors.border }]}
            />
          ))}
        </View>
      )}
      <Button disabled={busy || (step >= 0 && !done && !answered)} label={label} onPress={onNext} />
    </View>
  );
}
