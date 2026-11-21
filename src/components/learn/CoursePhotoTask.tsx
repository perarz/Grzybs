import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { FindPhoto } from '@/components/collection/FindPhoto';
import { FindReview } from '@/components/collection/FindReview';
import { SpeciesPicker } from '@/components/collection/SpeciesPicker';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { useAddFind } from '@/features/collection/useAddFind';
import { layout, spacing, useTheme } from '@/theme';

export function CoursePhotoTask({ onComplete }: { onComplete: () => Promise<void> }) {
  const find = useAddFind();
  const { colors } = useTheme();
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const completionLock = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function complete() {
    if (!find.saved || completionLock.current) return;
    completionLock.current = true;
    setCompleting(true);
    setCompletionError(null);
    try {
      await onComplete();
      if (mounted.current) setCompleted(true);
    } catch {
      completionLock.current = false;
      if (mounted.current) {
        setCompletionError(
          'Zdjęcie jest zapisane. Nie udało się zaliczyć kroku — spróbuj ponownie.',
        );
      }
    } finally {
      if (mounted.current) setCompleting(false);
    }
  }

  const step = find.saved
    ? 'Zdjęcie zapisane'
    : !find.photo
      ? '1 / 3 · Zdjęcie'
      : !find.species
        ? '2 / 3 · Gatunek'
        : '3 / 3 · Sprawdzenie';

  return (
    <View style={styles.content}>
      <View style={styles.heading}>
        <FieldIcon name="camera" size={layout.icon} color={colors.glow} />
        <AppText variant="label" color="accent" style={styles.step}>
          {step}
        </AppText>
      </View>
      {find.photo ? (
        <FindPhoto
          key={find.photo}
          uri={find.photo}
          onError={find.saved ? undefined : find.photoFailed}
        />
      ) : null}
      {find.saved ? (
        <>
          <AppText variant="heading">{find.species?.namePl}</AppText>
          <AppText color="textMuted">Znalezisko jest już w Twojej kolekcji.</AppText>
          <Button
            label={completed ? 'Krok zaliczony' : completing ? 'Zaliczam…' : 'Zalicz krok'}
            disabled={completing || completed}
            onPress={() => void complete()}
          />
        </>
      ) : !find.photo ? (
        <>
          <AppText>Zrób zdjęcie okazu lub wybierz własne zdjęcie z galerii.</AppText>
          <Button
            label="Zrób zdjęcie"
            disabled={find.busy}
            onPress={() => void find.choosePhoto(true)}
          />
          <Button
            label="Wybierz z galerii"
            variant="secondary"
            disabled={find.busy}
            onPress={() => void find.choosePhoto(false)}
          />
        </>
      ) : (
        <>
          <Button
            label="Zmień zdjęcie"
            variant="secondary"
            disabled={find.busy}
            onPress={() => find.setPhoto(null)}
          />
          {find.species ? (
            <FindReview
              key={`${find.species.id}:${find.photo}`}
              species={find.species}
              canSave={!find.photoUnavailable}
              busy={find.busy}
              onSave={() => void find.save()}
              onBack={() => {
                find.setSpecies(undefined);
                find.setError(null);
              }}
            />
          ) : (
            <SpeciesPicker onSelect={find.setSpecies} />
          )}
        </>
      )}
      {find.error || completionError ? (
        <AppText color="danger" accessibilityRole="alert">
          {find.error ?? completionError}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  heading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  step: { flex: 1 },
});
