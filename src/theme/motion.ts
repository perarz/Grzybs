import type { WithSpringConfig } from 'react-native-reanimated';

export const durations = {
  fast: 140,
  base: 220,
  slow: 360,
} as const;

export const springs = {
  /** Quick and firm – buttons and chips reacting to a finger. */
  press: { damping: 20, stiffness: 400, mass: 0.6 },
  /** Soft settle – indicators and things sliding into place. */
  settle: { damping: 18, stiffness: 180 },
  /** A bottom sheet rising: fast, with the faintest overshoot. */
  sheet: { damping: 22, stiffness: 220, mass: 0.9 },
} satisfies Record<string, WithSpringConfig>;

/** How far a pressed control shrinks – just enough to feel physical. */
export const PRESSED_SCALE = 0.96;
