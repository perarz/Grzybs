import { StyleSheet } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { layout, useTheme } from '@/theme';

type Point = { x: number; y: number };
type Props = {
  /** Each stage grows its own scenery: pines, leafy trees, then mushrooms, and again. */
  stage: number;
  width: number;
  height: number;
  points: Point[];
};

/** A pine drawn from three stacked triangles, standing with its foot at (x, y). */
function pine(x: number, y: number, size: number) {
  const tier = (top: number, half: number, bottom: number) =>
    `M ${x} ${y - size * top} L ${x + size * half} ${y - size * bottom} L ${x - size * half} ${y - size * bottom} Z`;
  return [tier(1, 0.28, 0.55), tier(0.75, 0.36, 0.3), tier(0.5, 0.44, 0.05)].join(' ');
}

/** A leafy tree: a round crown on a short trunk. */
function leafy(x: number, y: number, size: number) {
  const r = size * 0.32;
  const top = y - size * 0.3 - r;
  return `M ${x - size * 0.05} ${y} h ${size * 0.1} v ${-size * 0.3} h ${-size * 0.1} Z M ${x} ${top - r} a ${r} ${r} 0 1 0 0.01 0 Z`;
}

/** A mushroom: a half-round cap on a stem. */
function mushroom(x: number, y: number, size: number) {
  const r = size * 0.36;
  const capY = y - size * 0.45;
  return `M ${x - size * 0.09} ${y} h ${size * 0.18} v ${-size * 0.45} h ${-size * 0.18} Z M ${x - r} ${capY} a ${r} ${r * 0.85} 0 0 1 ${r * 2} 0 Z`;
}

const SCENERY = [pine, leafy, mushroom];

/** Flat trees beside the lesson trail – each stage has its own kind. */
export function TrailBackdrop({ stage, width, height, points }: Props) {
  const shape = SCENERY[stage % SCENERY.length];
  const { colors } = useTheme();
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} accessible={false}>
      <G opacity={0.55}>
        {points.map((point, index) => {
          // Pines grow on the side the trail leaves free.
          const side = point.x > width / 2 ? -1 : 1;
          const x = width / 2 + side * width * (0.3 + (index % 2) * 0.1);
          const size = layout.courseNode * (0.7 + (index % 3) * 0.2);
          return (
            <Path
              key={`pine-${index}`}
              d={shape(x, point.y + layout.courseNode / 2, size)}
              fill={index % 2 ? colors.primaryMuted : colors.surfaceMuted}
            />
          );
        })}
      </G>
    </Svg>
  );
}
