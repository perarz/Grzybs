import { Stack, ThemeProvider, type ErrorBoundaryProps } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ErrorFallback } from '@/components/ErrorFallback';
import { DATABASE_NAME, initDatabase } from '@/db/initDatabase';
import { getNavigationTheme, useTheme } from '@/theme';

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorFallback {...props} />;
}

export default function RootLayout() {
  const { colors, isDark } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* No onError on purpose: the provider rethrows, so a broken database shows ErrorBoundary instead of a crash. */}
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={initDatabase}>
        <ThemeProvider value={getNavigationTheme(colors, isDark)}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="dev/3d-test" options={{ headerShown: true, title: 'Test 3D' }} />
          </Stack>
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </ThemeProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
