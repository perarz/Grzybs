// "Las" – moss and spruce greens with a chanterelle accent.
// Colour carries meaning only where it matters: season (moss) and edibility.
const light = {
  background: '#EDF0E6',
  surface: '#F8FAF3',
  surfaceMuted: '#DEE4D4',
  border: '#C9D3BD',
  text: '#14231A',
  textMuted: '#55665A',
  primary: '#1D3A29',
  primaryMuted: '#DCE6D4',
  onPrimary: '#F2F6EE',
  accent: '#C46F1C',
  season: '#4A7A3B',
  danger: '#A8342A',
  dangerMuted: '#F2DDD6',
  warningMuted: '#F3E6C6',
  edible: '#3F7743',
  inedible: '#767C70',
  poisonous: '#B87D12',
  deadly: '#A8342A',
  // Morning forest: misty sky, three rows of spruces getting darker towards you.
  sky: '#D7E3CF',
  skyHorizon: '#EDF0E6',
  sun: '#F7E9BC',
  treeFar: '#A9BEA2',
  treeMid: '#5E7F5E',
  treeNear: '#1D3A29',
  onForest: '#EEF4EA',
  onForestMuted: '#9DB5A1',
  /** Dims the screen behind a bottom sheet. */
  backdrop: 'rgba(10, 22, 15, 0.45)',
};

export type ThemeColors = typeof light;

// The same forest at night – the moon replaces the sun, the accent glows like a lantern.
const dark: ThemeColors = {
  background: '#0E1813',
  surface: '#15231B',
  surfaceMuted: '#1E2F25',
  border: '#2A3F31',
  text: '#E3ECE1',
  textMuted: '#96AB9B',
  primary: '#CDE2C2',
  primaryMuted: '#1F3326',
  onPrimary: '#0E1813',
  accent: '#F0A04B',
  season: '#7FAE66',
  danger: '#EC6A57',
  dangerMuted: '#3B201B',
  warningMuted: '#382E16',
  edible: '#7FAE66',
  inedible: '#A0A797',
  poisonous: '#E6A93D',
  deadly: '#EC6A57',
  sky: '#0A1410',
  skyHorizon: '#0E1813',
  sun: '#E9E3C9',
  treeFar: '#1A2E22',
  treeMid: '#132419',
  treeNear: '#07100B',
  onForest: '#E3ECE1',
  onForestMuted: '#7F9886',
  backdrop: 'rgba(0, 0, 0, 0.6)',
};

export const palette = { light, dark };
