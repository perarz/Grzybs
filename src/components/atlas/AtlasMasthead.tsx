import { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { PageMasthead } from '@/components/PageMasthead';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { Button } from '@/components/Button';
import { AddFindSheet } from '@/components/collection/AddFindSheet';
import { SPECIES } from '@/data/species';
import { useCollection } from '@/features/collection/CollectionProvider';
import { layout, radius, spacing, useTheme } from '@/theme';

export function AtlasMasthead() {
  const { resetDevelopment } = useOnboarding();
  const taps = useRef({ count: 0, startedAt: 0 });
  function tapTitle() {
    if (!__DEV__) return;
    const now = Date.now();
    if (now - taps.current.startedAt > 2000) taps.current = { count: 0, startedAt: now };
    taps.current.count += 1;
    if (taps.current.count === 3) {
      taps.current = { count: 0, startedAt: 0 };
      resetDevelopment();
    }
  }
  const collection = useCollection();
  const count = new Set(collection.finds.map((find) => find.species_id)).size;
  return (
    <PageMasthead
      title="Atlas"
      eyebrow="Poznaj las"
      showBack
      onTitlePress={__DEV__ ? tapTitle : undefined}
      subtitle={
        collection.error || collection.loading
          ? `${SPECIES.length} gatunków`
          : `${SPECIES.length} gatunków · ${count} odkrytych`
      }
    >
      {collection.error && (
        <>
          <AppText accessibilityRole="alert" color="danger">
            {collection.error}
          </AppText>
          <Button label="Spróbuj ponownie" onPress={() => void collection.reload()} />
        </>
      )}
    </PageMasthead>
  );
}
export function AddFindFab() {
  const { colors } = useTheme();
  const collection = useCollection();
  const disabled = collection.loading || Boolean(collection.error);
  const [open, setOpen] = useState(false);
  return (
    <>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Dodaj zdjęcie znaleziska"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[styles.add, { backgroundColor: disabled ? colors.surfaceMuted : colors.glow }]}
      >
        <FieldIcon name="plus" size={26} color={disabled ? colors.textMuted : colors.onGlow} />
      </PressableScale>
      {open && <AddFindSheet onClose={() => setOpen(false)} />}
    </>
  );
}
const styles = StyleSheet.create({
  add: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.pill,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
