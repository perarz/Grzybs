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
import { successHaptic } from '@/features/feedback/haptics';
import { dailyFact } from '@/features/learn/dailyFact';
import { useDailyReveal } from '@/features/learn/useDailyReveal';
import { useDailySpecies } from '@/features/learn/useDailySpecies';
import { durations, layout, radius, spacing, useTheme } from '@/theme';

/** Today's mushroom starts hidden; one tap shows which it is and one thing worth knowing. */
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
        onPress={() => {
          if (revealed) {
            router.push({ pathname: '/species/[id]', params: { id: species.id } });
          } else {
            successHaptic();
            reveal();
          }
        }}
      >
        <Animated.View
          key={revealed ? 'revealed' : 'hidden'}
          entering={revealed ? FlipInEasyY.duration(durations.slow) : undefined}
          style={styles.section}
        >
          <View style={styles.row}>
            {revealed ? (
              <Image
                source={SPECIES_PHOTOS[species.id].source}
                style={[styles.photo, { backgroundColor: colors.surface }]}
                contentFit="cover"
              />
            ) : (
              // No photo at all while hidden – even a blurred one gives the colour away.
              <View
                style={[styles.photo, styles.mystery, { backgroundColor: colors.surfaceMuted }]}
              >
                <AppText variant="title" color="accent">
                  ?
                </AppText>
              </View>
            )}
            <View style={styles.copy}>
              <AppText variant="heading">
                {revealed ? (species.nameCommon ?? species.namePl) : 'Jaki grzyb dziś?'}
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
          </View>
          {revealed && (
            <View style={[styles.fact, { borderColor: colors.aqua }]}>
              <AppText variant="label" color="textMuted">
                Warto wiedzieć
              </AppText>
              <AppText>{dailyFact(species)}</AppText>
            </View>
          )}
        </Animated.View>
      </PressableScale>
      <View style={[styles.rule, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  copy: { flex: 1, gap: spacing.xs },
  photo: { width: layout.thumbnail, height: layout.thumbnail, borderRadius: radius.md },
  mystery: { alignItems: 'center', justifyContent: 'center' },
  fact: { gap: spacing.xs, paddingLeft: spacing.md, borderLeftWidth: layout.accentStroke },
  rule: { height: StyleSheet.hairlineWidth, marginTop: spacing.xs },
});
