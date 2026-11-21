import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { CloseIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import type { Species } from '@/features/atlas/types';
import { useAddFind } from '@/features/collection/useAddFind';
import { durations, spacing, useTheme } from '@/theme';

import { FindPhoto } from './FindPhoto';
import { FindReview } from './FindReview';
import { SpeciesPicker } from './SpeciesPicker';

const CLOSE_ICON_SIZE = 22;

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
  const { colors } = useTheme();
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
          <View style={styles.titleRow}>
            <AppText variant="label" color="accent">
              {step}
            </AppText>
            <PressableScale
              haptic="tap"
              accessibilityRole="button"
              accessibilityLabel="Zamknij"
              accessibilityState={{ disabled: busy }}
              disabled={busy}
              hitSlop={spacing.md}
              onPress={close}
            >
              <CloseIcon color={colors.textMuted} size={CLOSE_ICON_SIZE} />
            </PressableScale>
          </View>
          <AppText variant="heading">
            {saved
              ? isDiscovery
                ? 'Nowy gatunek w kolekcji!'
                : 'Kolejne znalezisko!'
              : 'Twoje znalezisko'}
          </AppText>
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
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
