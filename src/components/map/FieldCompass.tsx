import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { AppText } from '@/components/AppText';
import { useTheme } from '@/theme';
import { fieldMetrics } from '@/theme/field';

export function FieldCompass({ bearing, heading }: { bearing: number; heading: number | null }) {
  const { colors } = useTheme();
  const rotation = heading === null ? bearing : bearing - heading;
  return (
    <View
      style={styles.dial}
      accessibilityLabel={
        heading === null
          ? `Azymut auta ${Math.round(bearing)} stopni od północy`
          : 'Kierunek do auta względem telefonu'
      }
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="47" stroke={colors.border} fill={colors.surface} />
        <Circle cx="50" cy="50" r="37" stroke={colors.border} strokeDasharray="2 6" fill="none" />
        <Line x1="50" y1="4" x2="50" y2="13" stroke={colors.glow} strokeWidth="2" />
        <Line x1="50" y1="87" x2="50" y2="96" stroke={colors.border} />
        <Line x1="4" y1="50" x2="13" y2="50" stroke={colors.border} />
        <Line x1="87" y1="50" x2="96" y2="50" stroke={colors.border} />
      </Svg>
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${rotation}deg` }] }]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Path d="M50 22 L64 68 L50 59 L36 68 Z" fill={colors.glow} />
        </Svg>
      </Animated.View>
      {heading === null ? (
        <AppText variant="label" color="accent" style={styles.north}>
          N
        </AppText>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  dial: { width: fieldMetrics.compassSize, height: fieldMetrics.compassSize },
  north: { position: 'absolute', top: 0, alignSelf: 'center' },
});
