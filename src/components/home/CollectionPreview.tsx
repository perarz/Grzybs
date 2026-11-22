import { router } from 'expo-router';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { AddFindSheet } from '@/components/collection/AddFindSheet';
import { FindPhoto } from '@/components/collection/FindPhoto';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { useCollection } from '@/features/collection/CollectionProvider';
import { useQuickPhoto } from '@/features/collection/useQuickPhoto';
import { findSpecies } from '@/data/species';
import { layout, radius, spacing, useTheme } from '@/theme';

export function CollectionPreview() {
  const { finds, loading, error, reload } = useCollection();
  const { colors } = useTheme();
  const quick = useQuickPhoto();
  const { width, fontScale } = useWindowDimensions();
  const tileWidth = Math.min(
    layout.collectionPreviewWidth * Math.max(1, fontScale),
    Math.min(width, layout.contentMaxWidth) - spacing.lg * 2,
  );
  return (
    <View style={styles.section}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Otwórz swoje odkrycia"
        onPress={() => router.push('/collection')}
        style={styles.heading}
      >
        <AppText variant="heading" style={styles.headingText}>
          Twoje odkrycia
        </AppText>
      </PressableScale>
      {loading ? (
        <AppText color="textMuted">Wczytuję zdjęcia…</AppText>
      ) : error ? (
        <>
          <AppText color="danger" accessibilityRole="alert">
            {error}
          </AppText>
          <Button label="Spróbuj ponownie" variant="secondary" onPress={() => void reload()} />
        </>
      ) : finds.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photos}
        >
          {finds.slice(0, 6).map((find) => {
            const species = findSpecies(find.species_id);
            return (
              <PressableScale
                key={find.id}
                accessibilityRole="button"
                accessibilityLabel={`Twoje zdjęcie: ${species?.nameCommon ?? species?.namePl ?? 'grzyb'}`}
                onPress={() =>
                  router.push({ pathname: '/species/[id]', params: { id: find.species_id } })
                }
                style={[styles.tile, { width: tileWidth }]}
              >
                <FindPhoto uri={find.photo_uri} />
                <AppText variant="caption" numberOfLines={2}>
                  {species?.nameCommon ?? species?.namePl}
                </AppText>
              </PressableScale>
            );
          })}
        </ScrollView>
      ) : (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Zrób pierwsze zdjęcie znaleziska"
          disabled={quick.busy}
          onPress={() => void quick.takePhoto()}
          style={[styles.empty, { borderColor: colors.glow }]}
        >
          <FieldIcon name="camera" size={layout.icon} color={colors.glow} />
          <View style={styles.copy}>
            <AppText variant="bodyStrong">Pierwsze znalezisko przed Tobą</AppText>
            <AppText variant="caption" color="textMuted">
              Zrób zdjęcie i wybierz gatunek.
            </AppText>
          </View>
          <FieldIcon name="plus" size={layout.icon} color={colors.glow} />
        </PressableScale>
      )}
      {finds.length > 0 && (
        <Button
          label="Dodaj zdjęcie"
          icon="camera"
          variant="secondary"
          disabled={quick.busy}
          onPress={() => void quick.takePhoto()}
        />
      )}
      {quick.draft && (
        <AddFindSheet
          initialPhoto={quick.draft.photo}
          initialError={quick.draft.error}
          onClose={quick.close}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  headingText: { flex: 1 },
  section: { gap: spacing.sm },
  heading: {
    minHeight: layout.touchTarget,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  photos: { gap: spacing.md },
  tile: { gap: spacing.sm },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
  },
  copy: { flex: 1, gap: spacing.xs },
});
