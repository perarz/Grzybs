import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { ILLUSTRATION_SIZE, type IllustrationProps } from './illustrationProps';

const STROKE = 2;

// What is under the cap – line drawings for the first question of the key.

// Gills seen from below: lines running from the stem to the rim.
const GILL_LINES = Array.from({ length: 12 }, (_, index) => {
  const angle = (index * Math.PI) / 6;
  const inner = { x: 24 + 5 * Math.cos(angle), y: 24 + 3.2 * Math.sin(angle) };
  const outer = { x: 24 + 19 * Math.cos(angle), y: 24 + 11.2 * Math.sin(angle) };
  return `M${inner.x} ${inner.y} L${outer.x} ${outer.y}`;
}).join(' ');

// Pores seen from below: dots filling the cap, but not the stem.
const PORE_DOTS = [16, 20, 24, 28, 32].flatMap((y) =>
  [9, 13.5, 18, 22.5, 27, 31.5, 36, 40]
    .filter((x) => ((x - 24) / 18) ** 2 + ((y - 24) / 10) ** 2 < 1)
    .filter((x) => ((x - 24) / 7) ** 2 + ((y - 24) / 4.5) ** 2 > 1)
    .map((x) => ({ x, y })),
);

export function GillsIllustration({ color }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <Ellipse cx={24} cy={24} rx={20} ry={12} stroke={color} strokeWidth={STROKE} />
      <Path d={GILL_LINES} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Ellipse cx={24} cy={24} rx={4} ry={2.6} stroke={color} strokeWidth={STROKE} />
    </Svg>
  );
}

export function PoresIllustration({ color }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <Ellipse cx={24} cy={24} rx={20} ry={12} stroke={color} strokeWidth={STROKE} />
      {PORE_DOTS.map(({ x, y }) => (
        <Circle key={`${x}-${y}`} cx={x} cy={y} r={1.2} fill={color} />
      ))}
      <Ellipse cx={24} cy={24} rx={4} ry={2.6} stroke={color} strokeWidth={STROKE} />
    </Svg>
  );
}

export function RidgesIllustration({ color }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <Path
        d="M6 13 Q24 21 42 13 Q38 22 28 27 L27 42 L21 42 L20 27 Q10 22 6 13 Z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Path
        d="M12 17 Q18 22 21 30 M17 18.5 Q15 21 16 24 M24 19.5 L24 32 M36 17 Q30 22 27 30 M31 18.5 Q33 21 32 24"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Puffballs and morels have nothing under a cap – drawn as a round puffball. */
export function SmoothIllustration({ color }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 9 C35 9 38 19 36 27 C34 33 30 35 30 40 L18 40 C18 35 14 33 12 27 C10 19 13 9 24 9 Z"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Circle cx={20} cy={16} r={1.2} fill={color} />
      <Circle cx={26} cy={14} r={1.2} fill={color} />
      <Circle cx={29} cy={20} r={1.2} fill={color} />
      <Circle cx={22} cy={22} r={1.2} fill={color} />
      <Path d="M8 42 L40 42" stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
    </Svg>
  );
}
