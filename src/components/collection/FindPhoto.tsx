import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { radius, spacing, useTheme } from '@/theme';

type Props = { uri: string; onError?: () => void };

export function FindPhoto({ uri, onError }: Props) {
  const [failed, setFailed] = useState(false);
  const { colors } = useTheme();
  return failed ? (
    <View style={[styles.fallback, { backgroundColor: colors.surface }]}>
      <AppText variant="caption" color="textMuted">
        Zdjęcie niedostępne
      </AppText>
    </View>
  ) : (
    <Image
      source={{ uri }}
      style={styles.photo}
      contentFit="cover"
      accessibilityLabel="Zdjęcie Twojego znaleziska"
      onError={() => {
        setFailed(true);
        onError?.();
      }}
    />
  );
}
const styles = StyleSheet.create({
  photo: { width: '100%', aspectRatio: 1, borderRadius: radius.sm },
  fallback: {
    width: '100%',
    aspectRatio: 1,
    padding: spacing.md,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
