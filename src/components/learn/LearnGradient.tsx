import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '@/theme';

/** The quiet moss-to-lake gradient that marks learning; fills its parent from behind. */
export function LearnGradient() {
  const { colors } = useTheme();
  return (
    <Svg style={StyleSheet.absoluteFill} accessible={false} pointerEvents="none">
      <Defs>
        <LinearGradient id="learnGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={colors.learnStart} />
          <Stop offset="0.55" stopColor={colors.learnMiddle} />
          <Stop offset="1" stopColor={colors.learnEnd} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#learnGradient)" />
    </Svg>
  );
}
