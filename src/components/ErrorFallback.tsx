import type { ErrorBoundaryProps } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { spacing, useTheme } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';

export function ErrorFallback({ error, retry }: ErrorBoundaryProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText variant="title">Coś poszło nie tak</AppText>
      <AppText color="textMuted" style={styles.message}>
        Twoje dane są bezpieczne w pamięci telefonu. Spróbuj ponownie.
      </AppText>
      {__DEV__ ? (
        <AppText variant="caption" color="danger" style={styles.message}>
          {error.message}
        </AppText>
      ) : null}
      <Button label="Spróbuj ponownie" onPress={retry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  message: {
    textAlign: 'center',
  },
});
