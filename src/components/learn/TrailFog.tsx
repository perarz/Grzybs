import { StyleSheet } from 'react-native';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';
import { spacing, useTheme } from '@/theme';

type Props = { width: number; height: number; level: number };

const MAX_VEIL = 0.55;
const HATCH = spacing.md;

/** Uncharted ground: a stage not reached yet is dimmed and hatched like a blank map area. */
export function TrailFog({ width, height, level }: Props) {
  const { colors } = useTheme();
  if (level <= 0) return null;
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessible={false}
    >
      <Defs>
        <Pattern id="hatch" width={HATCH} height={HATCH} patternUnits="userSpaceOnUse">
          <Path
            d={`M 0 ${HATCH} L ${HATCH} 0`}
            stroke={colors.border}
            strokeWidth={StyleSheet.hairlineWidth * 2}
          />
        </Pattern>
      </Defs>
      <Rect
        width={width}
        height={height}
        fill={colors.background}
        opacity={Math.min(MAX_VEIL, 0.25 + level * 0.1)}
      />
      <Rect width={width} height={height} fill="url(#hatch)" opacity={0.5} />
    </Svg>
  );
}
