import { Image } from 'expo-image';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { Species } from '@/features/atlas/types';
import { useTheme } from '@/theme';

type SpeciesHeroProps = {
  species: Species;
  scrollY: SharedValue<number>;
};

/** Photo height as a share of the screen width – leaves room for field information. */
export const HERO_ASPECT = 0.62;
const PARALLAX_SPEED = 0.45;
const SCRIM_HEIGHT = 140;
// Black on purpose in both themes – a scrim must darken any photo for the status bar.
const SCRIM_OPACITY = 0.45;

/** Full-bleed photo that drifts slower than the page and stretches when pulled down (iOS). */
export function SpeciesHero({ species, scrollY }: SpeciesHeroProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const height = width * HERO_ASPECT;

  const photoStyle = useAnimatedStyle(() => {
    const y = scrollY.get();
    return {
      transform: [
        {
          translateY: interpolate(
            y,
            [-height, 0, height],
            [-height / 2, 0, height * PARALLAX_SPEED],
          ),
        },
        { scale: interpolate(y, [-height, 0], [2, 1], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <View style={[styles.hero, { height, backgroundColor: colors.surfaceMuted }]}>
      <Animated.View style={[StyleSheet.absoluteFill, photoStyle]}>
        <Image
          source={SPECIES_PHOTOS[species.id].source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
          accessibilityLabel={`Zdjęcie: ${species.namePl}`}
        />
      </Animated.View>
      {/* Darkens the top of the photo so the status bar and back button stay readable. */}
      <Svg width={width} height={SCRIM_HEIGHT} style={styles.scrim}>
        <Defs>
          <LinearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.treeNear} stopOpacity={SCRIM_OPACITY} />
            <Stop offset="1" stopColor={colors.treeNear} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect width={width} height={SCRIM_HEIGHT} fill="url(#scrim)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    overflow: 'hidden',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
