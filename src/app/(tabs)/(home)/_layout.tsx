import { Stack } from 'expo-router';
import { useTheme } from '@/theme';

export const unstable_settings = { anchor: 'index' };

export default function HomeLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'ios_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="atlas" />
      <Stack.Screen name="learn" />
      <Stack.Screen name="collection" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="species/[id]" />
      <Stack.Screen name="compare" />
    </Stack>
  );
}
