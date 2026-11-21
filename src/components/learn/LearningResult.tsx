import { roundXP } from '@/features/learn/journey';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { spacing } from '@/theme';

type Props = {
  score: number;
  total: number;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  onRetry: () => void;
  onRestart: () => void;
  onClose: () => void;
};

export function LearningResult({ score, total, saveState, onRetry, onRestart, onClose }: Props) {
  const saving = saveState === 'saving';
  return (
    <View style={styles.content}>
      {saveState === 'saved' && (
        <AppText variant="heading" color="accent">
          +{roundXP(score, total)} XP · dzień zaliczony
        </AppText>
      )}
      <AppText variant="label" color="accent">
        Runda zakończona
      </AppText>
      <AppText variant="display">
        {score} / {total}
      </AppText>
      <AppText variant="heading">
        {score === total
          ? 'Wszystkie odpowiedzi trafione!'
          : 'Każda runda to kolejna zapamiętana cecha.'}
      </AppText>
      <AppText color="textMuted">
        Wynik dotyczy wiedzy z atlasu. Rozpoznawanie okazów w terenie wymaga sprawdzenia wielu cech.
      </AppText>
      <AppText
        accessibilityLiveRegion="polite"
        color={saveState === 'error' ? 'danger' : 'textMuted'}
      >
        {saving
          ? 'Zapisuję wynik…'
          : saveState === 'saved'
            ? 'Wynik zapisany na tym telefonie.'
            : 'Nie udało się zapisać wyniku. Możesz ponowić zapis.'}
      </AppText>
      {saveState === 'error' ? <Button label="Ponów zapis wyniku" onPress={onRetry} /> : null}
      <Button
        label="Jeszcze jedna runda"
        disabled={saving || saveState === 'error'}
        onPress={onRestart}
      />
      <Button
        label={saveState === 'error' ? 'Zamknij bez ponawiania' : 'Wróć do nauki'}
        variant="secondary"
        disabled={saving}
        onPress={onClose}
      />
    </View>
  );
}
const styles = StyleSheet.create({ content: { gap: spacing.lg } });
