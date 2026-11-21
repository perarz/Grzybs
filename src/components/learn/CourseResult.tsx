import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { layout, spacing, useTheme } from '@/theme';

export function CourseResult({
  score,
  total,
  onComplete,
  onRestart,
}: {
  score: number;
  total: number;
  onComplete: () => Promise<void>;
  onRestart: () => void;
}) {
  const { colors } = useTheme();
  const passed = score === total;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const lock = useRef(false);
  async function save() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(false);
    try {
      await onComplete();
    } catch {
      setError(true);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <View style={styles.content}>
      <FieldIcon name={passed ? 'trophy' : 'book'} size={layout.courseNode} color={colors.glow} />
      <AppText variant="title">{passed ? 'Masz to!' : 'Wróćmy do wskazówek'}</AppText>
      <AppText color="textMuted">
        {score} z {total} poprawnych odpowiedzi
      </AppText>
      {!passed && (
        <AppText>
          Przeczytaj wskazówki jeszcze raz. Kolejny krok odblokujesz, gdy odpowiesz poprawnie na
          wszystkie pytania.
        </AppText>
      )}
      <Button
        label={passed ? (busy ? 'Zapisuję…' : 'Dalej na szlak') : 'Wróć do lekcji'}
        disabled={busy}
        onPress={passed ? () => void save() : onRestart}
      />
      {error && (
        <AppText color="danger" accessibilityRole="alert">
          Zapis nieudany. Spróbuj ponownie.
        </AppText>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  content: { alignItems: 'stretch', gap: spacing.lg, paddingVertical: spacing.xl },
});
