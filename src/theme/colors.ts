const light = {
  background: '#F5F3EC',
  surface: '#FFFFFF',
  surfaceMuted: '#ECE8DC',
  border: '#DEDACD',
  text: '#1B2620',
  textMuted: '#5D6A61',
  primary: '#2E5E45',
  primaryMuted: '#DCE8DF',
  onPrimary: '#FFFFFF',
  accent: '#C4752C',
  danger: '#B3261E',
  edible: '#3B8A57',
  inedible: '#857D6B',
  poisonous: '#D07F12',
  deadly: '#C0362C',
};

export type ThemeColors = typeof light;

const dark: ThemeColors = {
  background: '#0E1511',
  surface: '#17211B',
  surfaceMuted: '#202C25',
  border: '#2B3830',
  text: '#E8EEE9',
  textMuted: '#9AA99F',
  primary: '#82C49D',
  primaryMuted: '#22382B',
  onPrimary: '#0E1511',
  accent: '#E39B55',
  danger: '#F2766B',
  edible: '#6FC08B',
  inedible: '#A9A08D',
  poisonous: '#EBA63F',
  deadly: '#F0604F',
};

export const palette = { light, dark };
