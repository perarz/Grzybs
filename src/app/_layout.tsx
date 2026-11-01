import { useFonts } from 'expo-font';
import { Stack, ThemeProvider, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ErrorFallback } from '@/components/ErrorFallback';
import { DATABASE_NAME, initDatabase } from '@/db/initDatabase';
import { FONT_FILES, getNavigationTheme, useTheme } from '@/theme';

// Keep the splash screen up until the fonts are ready, so text never jumps between fonts.
SplashScreen.preventAutoHideAsync().catch(() => undefined);

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorFallback {...props} />;
}

export default function RootLayout() {
  const { colors, isDark } = useTheme();
  const [fontsLoaded, fontError] = useFonts(FONT_FILES);
  // A font that fails to load isn't worth blocking the app – the system font takes over.
  const isReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* No onError on purpose: the provider rethrows, so a broken database shows ErrorBoundary instead of a crash. */}
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={initDatabase}>
        <ThemeProvider value={getNavigationTheme(colors, isDark)}>
          {/* Rendered before the screens on purpose: the status bar style mounted last wins,
              so a screen (e.g. a species over its photo) can override this default. */}
          <StatusBar style={isDark ? 'light' : 'dark'} />
          {/* ios_from_right gives Android the iOS push: the old screen slides a little and dims. */}
          <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ThemeProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
