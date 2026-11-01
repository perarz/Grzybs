import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { spacing, useTheme } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';

type NotFoundProps = {
  message: string;
};

export function NotFound({ message }: NotFoundProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText variant="title">Nie znaleziono</AppText>
      <AppText color="textMuted" style={styles.message}>
        {message}
      </AppText>
      <Button label="Wróć do atlasu" onPress={() => router.replace('/')} />
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
