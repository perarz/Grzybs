import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';
import { layout, useTheme } from '@/theme';

type Point = { x: number; y: number };
type Props = {
  width: number;
  height: number;
  points: Point[];
  /** Per point: finished, the next one to do, or still locked. */
  states: ('done' | 'active' | 'locked')[];
};

const GLOW_RADIUS = layout.courseNode * 1.3;
// Fixed "random" fireflies, so the picture is the same on every visit.
const FIREFLIES = [
  [0.12, 0.08, 2],
  [0.86, 0.18, 1.5],
  [0.2, 0.36, 1.5],
  [0.92, 0.47, 2],
  [0.08, 0.62, 2],
  [0.78, 0.74, 1.5],
  [0.3, 0.9, 2],
  [0.95, 0.94, 1.5],
] as const;

/** A pine drawn from three stacked triangles, standing with its foot at (x, y). */
function pine(x: number, y: number, size: number) {
  const tier = (top: number, half: number, bottom: number) =>
    `M ${x} ${y - size * top} L ${x + size * half} ${y - size * bottom} L ${x - size * half} ${y - size * bottom} Z`;
  return [tier(1, 0.28, 0.55), tier(0.75, 0.36, 0.3), tier(0.5, 0.44, 0.05)].join(' ');
}

/** Quiet forest scenery behind the lesson trail: a clearing, glows, pines and fireflies. */
export function TrailBackdrop({ width, height, points, states }: Props) {
  const { colors } = useTheme();
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} accessible={false}>
      <Defs>
        <LinearGradient id="clearing" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={colors.surface} stopOpacity="0" />
          <Stop offset="0.5" stopColor={colors.surface} stopOpacity="0.7" />
          <Stop offset="1" stopColor={colors.surface} stopOpacity="0" />
        </LinearGradient>
        <RadialGradient id="done" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={colors.season} stopOpacity="0.28" />
          <Stop offset="1" stopColor={colors.season} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="active" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={colors.glow} stopOpacity="0.35" />
          <Stop offset="1" stopColor={colors.glow} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Path d={`M 0 0 H ${width} V ${height} H 0 Z`} fill="url(#clearing)" />
      {points.map((point, index) =>
        states[index] === 'locked' ? null : (
          <Circle
            key={`glow-${index}`}
            cx={point.x}
            cy={point.y}
            r={GLOW_RADIUS}
            fill={`url(#${states[index]})`}
          />
        ),
      )}
      <G opacity={0.55}>
        {points.map((point, index) => {
          // Pines grow on the side the trail leaves free.
          const side = point.x > width / 2 ? -1 : 1;
          const x = width / 2 + side * width * (0.3 + (index % 2) * 0.1);
          const size = layout.courseNode * (0.7 + (index % 3) * 0.2);
          return (
            <Path
              key={`pine-${index}`}
              d={pine(x, point.y + layout.courseNode / 2, size)}
              fill={index % 2 ? colors.primaryMuted : colors.surfaceMuted}
            />
          );
        })}
      </G>
      {FIREFLIES.map(([x, y, r], index) => (
        <Circle
          key={`firefly-${index}`}
          cx={x * width}
          cy={y * height}
          r={r}
          fill={colors.glow}
          opacity={0.5}
        />
      ))}
    </Svg>
  );
}
