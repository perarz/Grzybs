// "Las" – moss and spruce greens with a chanterelle accent, deep rather than pastel.
// Colour carries meaning only where it matters: season (moss) and edibility.
const light = {
  background: '#C5CFB8',
  surface: '#DCE2D0',
  surfaceMuted: '#B3BFA5',
  border: '#A3B095',
  text: '#0F1B13',
  textMuted: '#334238',
  primary: '#132B1E',
  primaryMuted: '#B4C1A6',
  onPrimary: '#EEF3E7',
  /** Rust for text and thin lines on the moss background. */
  accent: '#6C3704',
  /** Chanterelle orange for fills: the tab marker, the key button, the illustrations. */
  glow: '#E08A2E',
  onGlow: '#132B1E',
  season: '#2A5A22',
  danger: '#85221A',
  dangerMuted: '#E2C4BA',
  warningMuted: '#E2CF9E',
  edible: '#285A2C',
  inedible: '#50564B',
  poisonous: '#7A5005',
  deadly: '#85221A',
  // Overcast forest: a heavy sky, three rows of spruces getting darker towards you.
  sky: '#A5B9A0',
  skyHorizon: '#C5CFB8',
  sun: '#F2DFA2',
  treeFar: '#7F9A7D',
  treeMid: '#446B4B',
  treeNear: '#132B1E',
  onForest: '#EEF3E7',
  onForestMuted: '#9DB5A1',
  /** Dims the screen behind a bottom sheet. */
  backdrop: 'rgba(6, 14, 9, 0.55)',
};

export type ThemeColors = typeof light;

// The same forest at night – the moon replaces the sun, the accent glows like a lantern.
const dark: ThemeColors = {
  background: '#0A120E',
  surface: '#111C16',
  surfaceMuted: '#19271F',
  border: '#263A2D',
  text: '#E3ECE1',
  textMuted: '#95AA9A',
  primary: '#A8C79B',
  primaryMuted: '#1A2C20',
  onPrimary: '#0A120E',
  accent: '#E8963F',
  glow: '#E8963F',
  onGlow: '#0A120E',
  season: '#76A35E',
  danger: '#E8604D',
  dangerMuted: '#351B17',
  warningMuted: '#322811',
  edible: '#76A35E',
  inedible: '#98A08F',
  poisonous: '#DFA136',
  deadly: '#E8604D',
  sky: '#060D0A',
  skyHorizon: '#0A120E',
  sun: '#DAD4BA',
  treeFar: '#1E3527',
  treeMid: '#13261A',
  treeNear: '#050C08',
  onForest: '#E3ECE1',
  onForestMuted: '#7F9886',
  backdrop: 'rgba(0, 0, 0, 0.65)',
};

export const palette = { light, dark };
