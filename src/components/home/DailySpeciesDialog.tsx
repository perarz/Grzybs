import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { DialogCard } from '@/components/DialogCard';
import { PhotoCredit } from '@/components/PhotoCredit';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { EDIBILITY_LABELS } from '@/features/atlas/labels';
import { formatSeason } from '@/features/atlas/season';
import type { Species } from '@/features/atlas/types';
import { dailyFact } from '@/features/learn/dailyFact';
import { layout, radius, spacing, useTheme } from '@/theme';

type Props = { species: Species; onClose: () => void };

/** Today's mushroom, shown in its own window when the question mark is tapped. */
export function DailySpeciesDialog({ species, onClose }: Props) {
  const { colors } = useTheme();
  const photo = SPECIES_PHOTOS[species.id];
  return (
    <DialogCard closeLabel="Zamknij" onClose={onClose}>
      <AppText variant="label" color="textMuted">
        Grzyb dnia
      </AppText>
      <Image
        source={photo.source}
        style={[styles.photo, { backgroundColor: colors.surfaceMuted }]}
        contentFit="cover"
        accessibilityLabel={`Zdjęcie: ${species.namePl}`}
      />
      <PhotoCredit photo={photo} />
      <View style={styles.names}>
        <AppText variant="title">{species.nameCommon ?? species.namePl}</AppText>
        <AppText variant="latinSmall" color="textMuted">
          {species.nameLatin}
        </AppText>
        <AppText variant="caption" color="textMuted">
          {EDIBILITY_LABELS[species.edibility]} · {formatSeason(species.months)}
        </AppText>
      </View>
      <View style={[styles.fact, { borderColor: colors.aqua }]}>
        <AppText variant="label" color="textMuted">
          Warto wiedzieć
        </AppText>
        <AppText>{dailyFact(species)}</AppText>
      </View>
      <View style={styles.actions}>
        <Button
          label="Zobacz w atlasie"
          onPress={() => {
            onClose();
            router.push({ pathname: '/species/[id]', params: { id: species.id } });
          }}
        />
        <Button label="Zamknij" variant="secondary" onPress={onClose} />
      </View>
    </DialogCard>
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', aspectRatio: layout.speciesPhotoAspect, borderRadius: radius.md },
  names: { gap: spacing.xs },
  fact: { gap: spacing.xs, paddingLeft: spacing.md, borderLeftWidth: layout.accentStroke },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
});
