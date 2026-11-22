import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';

const MAX_VEIL = 0.55;

/** A stage not reached yet is dimmed – the further ahead, the darker. */
export function TrailFog({ level }: { level: number }) {
  const { colors } = useTheme();
  if (level <= 0) return null;
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: colors.background, opacity: Math.min(MAX_VEIL, 0.25 + level * 0.1) },
      ]}
    />
  );
}
