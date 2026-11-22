import { StyleSheet } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '@/theme';

type Props = { width: number; height: number; level: number };

const MAX_VEIL = 0.6;
const MIST_BANDS = [0.18, 0.5, 0.82] as const;

/** Mist over a stage the learner hasn't reached: thicker the further ahead it is. */
export function TrailFog({ width, height, level }: Props) {
  const { colors } = useTheme();
  if (level <= 0) return null;
  const veil = Math.min(MAX_VEIL, 0.2 + level * 0.12);
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessible={false}
    >
      <Defs>
        <LinearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.background} stopOpacity={veil * 0.6} />
          <Stop offset="1" stopColor={colors.background} stopOpacity={veil} />
        </LinearGradient>
        <RadialGradient id="mist" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={colors.sun} stopOpacity={0.06 + level * 0.03} />
          <Stop offset="1" stopColor={colors.sun} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#veil)" />
      {MIST_BANDS.map((band, index) => (
        <Ellipse
          key={band}
          cx={width * (index % 2 ? 0.35 : 0.65)}
          cy={height * band}
          rx={width * 0.6}
          ry={height * 0.12}
          fill="url(#mist)"
        />
      ))}
    </Svg>
  );
}
