import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import type { Species } from '@/features/atlas/types';
import { useAddFind } from '@/features/collection/useAddFind';
import { durations, spacing } from '@/theme';

import { FindPhoto } from './FindPhoto';
import { FindReview } from './FindReview';
import { SpeciesPicker } from './SpeciesPicker';

export function AddFindSheet({
  onClose,
  initialSpecies,
  initialPhoto,
  initialError,
}: {
  onClose: () => void;
  initialSpecies?: Species;
  initialPhoto?: string | null;
  initialError?: string;
}) {
  const {
    photo,
    photoFailed,
    photoUnavailable,
    setPhoto,
    species,
    setSpecies,
    busy,
    error,
    setError,
    saved,
    isDiscovery,
    choosePhoto,
    save,
  } = useAddFind(initialSpecies, initialPhoto, initialError);
  const step = saved
    ? 'Zapisano'
    : !photo
      ? '1 / 3 · Zdjęcie'
      : !species
        ? '2 / 3 · Gatunek'
        : '3 / 3 · Sprawdzenie';
  return (
    <BottomSheet
      onClose={onClose}
      dismissible={!busy}
      header={(close) => (
        <View style={styles.content}>
          <AppText variant="label" color="accent">
            {step}
          </AppText>
          <AppText variant="heading">
            {saved
              ? isDiscovery
                ? 'Nowy gatunek w kolekcji!'
                : 'Kolejne znalezisko!'
              : 'Twoje znalezisko'}
          </AppText>
          <Button label="Zamknij" variant="secondary" disabled={busy} onPress={close} />
        </View>
      )}
    >
      {(close) => (
        <ScrollView
          key={step}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <Animated.View
            key={step}
            entering={FadeInDown.duration(durations.base)}
            style={styles.content}
          >
            {photo ? (
              <FindPhoto key={photo} uri={photo} onError={saved ? undefined : photoFailed} />
            ) : null}
            {photo && !saved ? (
              <Button
                label="Zmień zdjęcie"
                variant="secondary"
                disabled={busy}
                onPress={() => setPhoto(null)}
              />
            ) : null}
            {saved ? (
              <>
                <AppText variant="heading">{species?.namePl}</AppText>
                <AppText>
                  Zdjęcie jest zapisane na tym telefonie. Znajdziesz je na stronie gatunku, również
                  bez internetu.
                </AppText>
                <Button label="Gotowe" onPress={close} />
              </>
            ) : !photo ? (
              <>
                <AppText>Zrób zdjęcie okazu lub wybierz własne zdjęcie z galerii.</AppText>
                <Button
                  label="Zrób zdjęcie"
                  disabled={busy}
                  onPress={() => void choosePhoto(true)}
                />
                <Button
                  label="Wybierz z galerii"
                  disabled={busy}
                  variant="secondary"
                  onPress={() => void choosePhoto(false)}
                />
              </>
            ) : !species ? (
              <SpeciesPicker onSelect={setSpecies} />
            ) : (
              <FindReview
                key={`${species.id}:${photo}`}
                canSave={!photoUnavailable}
                species={species}
                busy={busy}
                onSave={() => void save()}
                onBack={() => {
                  setSpecies(undefined);
                  setError(null);
                }}
              />
            )}
            {error ? (
              <AppText color="danger" accessibilityRole="alert">
                {error}
              </AppText>
            ) : null}
          </Animated.View>
        </ScrollView>
      )}
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
});
