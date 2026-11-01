import Svg, { Ellipse, Path } from 'react-native-svg';

import { BRUISE_BLUE } from '@/theme/swatches';

import { ILLUSTRATION_SIZE, type IllustrationProps } from './illustrationProps';

const STROKE = 2;

// Ring, volva and flesh colour – the stem and cut-mushroom questions of the key.

function CapAndStem({ color }: { color: string }) {
  return (
    <>
      <Path d="M8 20 Q24 2 40 20 Z" stroke={color} strokeWidth={STROKE} strokeLinejoin="round" />
      <Path d="M21 20 L21 41 M27 20 L27 41" stroke={color} strokeWidth={STROKE} />
      <Path d="M8 42 L40 42" stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
    </>
  );
}

export function RingIllustration({ color, accent }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <CapAndStem color={color} />
      <Path
        d="M18 25 L30 25 L32 30 L16 30 Z"
        fill={accent}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function NoRingIllustration({ color }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <CapAndStem color={color} />
    </Svg>
  );
}

export function VolvaIllustration({ color, accent }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <CapAndStem color={color} />
      <Path
        d="M15 42 C14 35 16 31 19 32 L21 30 L23 32 L25 30 L27 32 L29 30 C32 31 34 35 33 42 Z"
        fill={accent}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function NoVolvaIllustration({ color }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <CapAndStem color={color} />
      <Path d="M19 41 Q24 36 29 41" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function CutMushroom({ color }: { color: string }) {
  return (
    <Path
      d="M7 22 Q24 2 41 22 Z M18 22 L19 42 L29 42 L30 22"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    />
  );
}

export function ColorChangeIllustration({ color }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <Ellipse cx={24} cy={30} rx={4} ry={7} fill={BRUISE_BLUE} />
      <Ellipse cx={24} cy={17} rx={7} ry={3} fill={BRUISE_BLUE} />
      <CutMushroom color={color} />
    </Svg>
  );
}

export function NoColorChangeIllustration({ color }: IllustrationProps) {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 48 48" fill="none">
      <CutMushroom color={color} />
    </Svg>
  );
}
