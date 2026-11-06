// "Las" – moss and spruce greens with a chanterelle accent.
// Colour carries meaning only where it matters: season (moss) and edibility.

// Not shown at the moment: useTheme always picks the dark palette below.
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

// The default look: a deep green forest at dusk. The moon replaces the sun,
// the accent glows like a lantern.
const dark: ThemeColors = {
  background: '#12261B',
  surface: '#1A3225',
  surfaceMuted: '#244032',
  border: '#31503D',
  text: '#E8F0E4',
  textMuted: '#A6BCAB',
  primary: '#B5D3A6',
  primaryMuted: '#20392A',
  onPrimary: '#0E1F15',
  accent: '#EFA24F',
  glow: '#EFA24F',
  onGlow: '#0E1F15',
  season: '#8ABA70',
  danger: '#F27A66',
  dangerMuted: '#43241E',
  warningMuted: '#3E3319',
  edible: '#8ABA70',
  inedible: '#AAB2A0',
  poisonous: '#E8AC42',
  deadly: '#F27A66',
  sky: '#0C1D14',
  skyHorizon: '#12261B',
  sun: '#E6DFC2',
  treeFar: '#2C4D39',
  treeMid: '#1C3727',
  treeNear: '#0A1710',
  onForest: '#E8F0E4',
  onForestMuted: '#8FA995',
  backdrop: 'rgba(0, 0, 0, 0.55)',
};

export const palette = { light, dark };
