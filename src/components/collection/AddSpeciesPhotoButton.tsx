import { StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import type { Species } from '@/features/atlas/types';
import { useCollection } from '@/features/collection/CollectionProvider';
import { useQuickPhoto } from '@/features/collection/useQuickPhoto';
import { layout, radius, spacing, useTheme } from '@/theme';
import { AddFindSheet } from './AddFindSheet';

export function AddSpeciesPhotoButton({ species }: { species: Species }) {
  const quick = useQuickPhoto();
  const { colors } = useTheme();
  const collection = useCollection();
  const disabled = collection.loading || Boolean(collection.error) || quick.busy;
  return (
    <>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Dodaj zdjęcie znaleziska"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => void quick.takePhoto()}
        style={[styles.button, { backgroundColor: disabled ? colors.surfaceMuted : colors.glow }]}
      >
        <FieldIcon name="camera" size={20} color={disabled ? colors.textMuted : colors.onGlow} />
        <AppText variant="button" color={disabled ? 'textMuted' : 'onGlow'}>
          Dodaj zdjęcie
        </AppText>
      </PressableScale>
      {quick.draft && (
        <AddFindSheet
          initialSpecies={species}
          initialPhoto={quick.draft.photo}
          initialError={quick.draft.error}
          onClose={quick.close}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.touchTarget,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.md,
  },
});
