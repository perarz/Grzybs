import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

import type { ThemeColors } from './colors';

// React Navigation paints screen backgrounds and transitions itself,
// so it needs our colors too – otherwise dark mode flashes white.
export function getNavigationTheme(colors: ThemeColors, isDark: boolean): Theme {
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };
}
