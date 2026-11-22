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
  /** A cool water accent – the outline of the learning card. */
  aqua: '#1F7A6E',
  /** The learning card's gradient: moss, lake, then dusk. */
  learnStart: '#CFE3D6',
  learnMiddle: '#C2DCD9',
  learnEnd: '#D2DDE3',
};

export type ThemeColors = typeof light;

// The default look, "Nocny las": near-black like bark at night, moss green for everything
// you can press, pale lichen for things already done, aqua for learning. The chanterelle
// orange is kept for warnings and mushrooms only.
const dark: ThemeColors = {
  background: '#0A0C0B',
  surface: '#131715',
  surfaceMuted: '#1B211D',
  border: '#28312B',
  text: '#E6EBE4',
  textMuted: '#9AA59B',
  primary: '#BFD8A6',
  primaryMuted: '#17211A',
  onPrimary: '#0A0C0B',
  accent: '#9CC488',
  glow: '#84B26A',
  onGlow: '#0A0C0B',
  season: '#BFD8A6',
  danger: '#E5735F',
  dangerMuted: '#2B1512',
  warningMuted: '#2A2413',
  edible: '#9CC488',
  inedible: '#A9AE9F',
  poisonous: '#E3A63F',
  deadly: '#E5735F',
  sky: '#070908',
  skyHorizon: '#0A0C0B',
  sun: '#D9D4BE',
  treeFar: '#1B241E',
  treeMid: '#121914',
  treeNear: '#050706',
  onForest: '#E6EBE4',
  onForestMuted: '#8F9A90',
  backdrop: 'rgba(0, 0, 0, 0.7)',
  aqua: '#5ED6C4',
  learnStart: '#0F1F19',
  learnMiddle: '#0D1F21',
  learnEnd: '#0F1824',
};

export const palette = { light, dark };
