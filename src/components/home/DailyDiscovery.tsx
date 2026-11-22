import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FlipInEasyY } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { EDIBILITY_LABELS } from '@/features/atlas/labels';
import { formatSeason } from '@/features/atlas/season';
import { useDailyReveal } from '@/features/learn/useDailyReveal';
import { useDailySpecies } from '@/features/learn/useDailySpecies';
import { durations, layout, radius, spacing, useTheme } from '@/theme';

// Enough blur that the mushroom is a guess, not a giveaway.
const HIDDEN_BLUR = 18;

export function DailyDiscovery() {
  const species = useDailySpecies();
  const { revealed, reveal } = useDailyReveal();
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <AppText variant="label" color="textMuted">
        Grzyb dnia
      </AppText>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={revealed ? `Grzyb dnia: ${species.namePl}` : 'Odkryj grzyb dnia'}
        onPress={() =>
          revealed
            ? router.push({ pathname: '/species/[id]', params: { id: species.id } })
            : reveal()
        }
        style={[styles.card, { borderColor: colors.border }]}
      >
        <Animated.View
          key={revealed ? 'revealed' : 'hidden'}
          entering={revealed ? FlipInEasyY.duration(durations.slow) : undefined}
          style={styles.row}
        >
          <View style={[styles.photo, { backgroundColor: colors.surface }]}>
            <Image
              source={SPECIES_PHOTOS[species.id].source}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              blurRadius={revealed ? 0 : HIDDEN_BLUR}
            />
            {!revealed && (
              <View style={[styles.mystery, { backgroundColor: colors.backdrop }]}>
                <AppText variant="title" color="accent">
                  ?
                </AppText>
              </View>
            )}
          </View>
          <View style={styles.copy}>
            <AppText variant="heading">
              {revealed ? (species.nameCommon ?? species.namePl) : 'Co dziś rośnie?'}
            </AppText>
            <AppText variant="caption" color="textMuted">
              {revealed
                ? `${EDIBILITY_LABELS[species.edibility]} · ${formatSeason(species.months)}`
                : 'Dotknij, aby odkryć'}
            </AppText>
          </View>
          <FieldIcon
            name={revealed ? 'arrowRight' : 'help'}
            size={layout.icon}
            color={colors.glow}
          />
        </Animated.View>
      </PressableScale>
    </View>
  );
}
const styles = StyleSheet.create({
  section: { gap: spacing.md },
  card: { paddingBottom: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  photo: {
    width: layout.thumbnail,
    height: layout.thumbnail,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  mystery: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
