import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { SPECIES } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { COURSE_LENGTH } from '@/features/learn/course';
import { useCourseProgress } from '@/features/learn/useCourseProgress';
import { durations, layout, radius, spacing, useTheme } from '@/theme';

export function HomeDestinations() {
  const { colors } = useTheme();
  const course = useCourseProgress();
  return (
    <View style={styles.group}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Otwórz atlas, ${SPECIES.length} gatunków`}
        onPress={() => router.push('/atlas')}
        style={[styles.hero, { backgroundColor: colors.surface }]}
      >
        <Image
          source={SPECIES_PHOTOS['cantharellus-cibarius'].source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={durations.base}
        />
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="homePhoto" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.treeNear} stopOpacity={0.12} />
                <Stop offset="1" stopColor={colors.treeNear} stopOpacity={0.98} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#homePhoto)" />
          </Svg>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.treeNear }]}>
          <AppText variant="label" color="onForest">
            {SPECIES.length} gatunków
          </AppText>
        </View>
        <View style={styles.heroBottom}>
          <View style={styles.label}>
            <AppText variant="display" color="onForest">
              Atlas grzybów
            </AppText>
            <AppText variant="caption" color="onForest">
              Poznaj to, co rośnie obok.
            </AppText>
          </View>
          <View style={[styles.arrow, { backgroundColor: colors.glow }]}>
            <FieldIcon name="arrowRight" size={layout.icon} color={colors.onGlow} />
          </View>
        </View>
      </PressableScale>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Otwórz naukę"
        onPress={() => router.push('/learn')}
        style={[styles.learn, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={[styles.symbol, { backgroundColor: colors.primaryMuted }]}>
          <FieldIcon name="book" size={layout.icon} color={colors.primary} />
        </View>
        <View style={styles.label}>
          <AppText variant="heading">Nauka</AppText>
          <AppText variant="caption" color="textMuted">
            {course.completed?.length
              ? `Ukończono ${course.completed.length} z ${COURSE_LENGTH} · ${course.xp} XP`
              : 'Krótkie lekcje krok po kroku.'}
          </AppText>
          <View style={[styles.track, { backgroundColor: colors.primaryMuted }]}>
            <View
              style={[
                styles.fill,
                {
                  backgroundColor: colors.glow,
                  width: `${Math.min(1, (course.completed?.length ?? 0) / COURSE_LENGTH) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
        <FieldIcon name="arrowRight" size={layout.icon} color={colors.glow} />
      </PressableScale>
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: spacing.md },
  hero: {
    minHeight: layout.homeHeroHeight,
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    overflow: 'hidden',
    padding: spacing.lg,
    gap: spacing.xxl,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  heroBottom: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  label: { flex: 1, gap: spacing.xs },
  arrow: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  track: { height: spacing.xs, borderRadius: radius.xs, overflow: 'hidden', marginTop: spacing.xs },
  fill: { height: '100%' },
  symbol: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
