import { useColorScheme } from 'react-native';

import { palette } from './colors';

export function useTheme() {
  const isDark = useColorScheme() === 'dark';
  return { colors: isDark ? palette.dark : palette.light, isDark };
}
