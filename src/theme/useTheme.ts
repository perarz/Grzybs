import { palette } from './colors';

// The app is a deep green forest by default, whatever the phone's setting.
// The light palette stays in colors.ts in case a theme switch is added later.
export function useTheme() {
  return { colors: palette.dark, isDark: true };
}
