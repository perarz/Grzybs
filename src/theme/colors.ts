// "Zielnik" – an old field guide: warm paper, black ink, one rust accent.
// Colour carries meaning only where it matters: season (moss) and edibility.
const light = {
  background: '#EFE9DD',
  surface: '#F8F4EC',
  surfaceMuted: '#E4DCCB',
  border: '#D5CAB5',
  text: '#1D1A15',
  textMuted: '#6E6555',
  primary: '#1D1A15',
  primaryMuted: '#E4DCCB',
  onPrimary: '#F8F4EC',
  accent: '#B4542D',
  season: '#4F6B3E',
  danger: '#A3302A',
  dangerMuted: '#F1DCD4',
  warningMuted: '#F2E3C4',
  edible: '#4F6B3E',
  inedible: '#7D7768',
  poisonous: '#B7791A',
  deadly: '#A3302A',
};

export type ThemeColors = typeof light;

// "Noc w lesie" – the same guide read by a head torch.
const dark: ThemeColors = {
  background: '#121410',
  surface: '#1A1D17',
  surfaceMuted: '#262A21',
  border: '#343A2E',
  text: '#ECE5D6',
  textMuted: '#A39B8A',
  primary: '#ECE5D6',
  primaryMuted: '#2A2F25',
  onPrimary: '#121410',
  accent: '#E07B4F',
  season: '#86A86D',
  danger: '#E5604F',
  dangerMuted: '#3A201B',
  warningMuted: '#382D17',
  edible: '#86A86D',
  inedible: '#A59E8D',
  poisonous: '#E0A43C',
  deadly: '#E5604F',
};

export const palette = { light, dark };
