import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { EDIBILITY_LABELS } from '@/features/atlas/labels';
import { formatSeason } from '@/features/atlas/season';
import { useDailySpecies } from '@/features/learn/useDailySpecies';
import { layout, radius, spacing, useTheme } from '@/theme';

export function DailyDiscovery() {
  const species = useDailySpecies();
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <AppText variant="label" color="textMuted">
        Grzyb dnia
      </AppText>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Grzyb dnia: ${species.namePl}`}
        onPress={() => router.push({ pathname: '/species/[id]', params: { id: species.id } })}
        style={[styles.card, { borderColor: colors.border }]}
      >
        <Image
          source={SPECIES_PHOTOS[species.id].source}
          style={[styles.photo, { backgroundColor: colors.surface }]}
          contentFit="cover"
        />
        <View style={styles.copy}>
          <AppText variant="heading">{species.nameCommon ?? species.namePl}</AppText>
          <AppText variant="caption" color="textMuted">
            {EDIBILITY_LABELS[species.edibility]} · {formatSeason(species.months)}
          </AppText>
        </View>
        <FieldIcon name="arrowRight" size={layout.icon} color={colors.glow} />
      </PressableScale>
    </View>
  );
}
const styles = StyleSheet.create({
  section: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  copy: { flex: 1, gap: spacing.xs },
  photo: { width: layout.thumbnail, height: layout.thumbnail, borderRadius: radius.md },
});
