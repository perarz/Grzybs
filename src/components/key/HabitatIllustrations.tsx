import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { ILLUSTRATION_SIZE, type IllustrationProps } from './illustrationProps';

const STROKE = 2;

function Ground({ color }: { color: string }) {
  return <Path d="M6 42 L42 42" stroke={color} strokeWidth={STROKE} strokeLinecap="round" />;
}

export function DeciduousIllustration({ color, accent }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <Path
        d="M14 26 C8 26 7 18 12 16 C11 10 18 7 22 10 C25 5 34 7 34 13 C40 13 42 21 36 24 C36 28 30 30 27 27 L21 27 C19 29 15 29 14 26 Z"
        fill={accent}
        stroke={color}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Path
        d="M24 27 L24 42 M24 33 L20 29 M24 31 L28 28"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <Ground color={color} />
    </Svg>
  );
}

export function ConiferousIllustration({ color, accent }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 5 L31 17 L27 17 L34 27 L29 27 L37 37 L11 37 L19 27 L14 27 L21 17 L17 17 Z"
        fill={accent}
        stroke={color}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <Path d="M24 37 L24 42" stroke={color} strokeWidth={STROKE} />
      <Ground color={color} />
    </Svg>
  );
}

export function MeadowIllustration({ color, accent }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <Path
        d="M10 42 Q12 32 8 24 M15 42 Q16 30 20 22 M22 42 Q21 34 24 28 M30 42 Q31 30 27 20 M36 42 Q35 32 40 25"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <Circle cx={27} cy={17} r={3} fill={accent} stroke={color} strokeWidth={1.5} />
      <Ground color={color} />
    </Svg>
  );
}

export function DeadWoodIllustration({ color, accent }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <Path
        d="M10 28 L36 28 M10 42 L36 42 M10 28 C5 28 5 42 10 42"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <Ellipse cx={36} cy={35} rx={4.5} ry={7} stroke={color} strokeWidth={STROKE} />
      <Ellipse cx={36} cy={35} rx={1.8} ry={3} stroke={color} strokeWidth={1.2} />
      <Path
        d="M15 28 L15 23 M21 28 L21 24"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M11 23 Q15 17 19 23 Z M18 24 Q21 20 24 24 Z"
        fill={accent}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
