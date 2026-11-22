import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { claimAutomaticRetry, reloadRuntime } from '@/features/startup/recovery';
import { layout, radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

// Fonts aren't loaded on this path, so text keeps the system font: only sizes come from the theme.
const titleText = { fontSize: typography.title.fontSize, lineHeight: typography.title.lineHeight };
const bodyText = { fontSize: typography.body.fontSize, lineHeight: typography.body.lineHeight };
const buttonText = {
  fontSize: typography.button.fontSize,
  lineHeight: typography.button.lineHeight,
};

/**
 * Shown instead of the app when Expo Go started it without its native modules
 * (see features/startup/nativeModules). First it restarts the JS runtime once by itself –
 * that hands the modules over. Only if that didn't help does it explain what to do.
 * It uses a plain Pressable on purpose: PressableScale needs expo-haptics, which is missing here.
 */
export function StartupRecovery() {
  const { colors } = useTheme();
  // In a production bundle DevSettings can't reload, so only the explanation makes sense there.
  const [isReloading] = useState(() => __DEV__ && claimAutomaticRetry());

  useEffect(() => {
    if (isReloading) reloadRuntime();
  }, [isReloading]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {isReloading ? (
        <ActivityIndicator color={colors.glow} accessibilityLabel="Uruchamianie Grzybsa" />
      ) : (
        <View style={styles.content}>
          <Text accessibilityRole="header" style={[titleText, { color: colors.text }]}>
            Expo Go potrzebuje restartu
          </Text>
          <Text style={[bodyText, { color: colors.textMuted }]}>
            Grzybs wystartował w Expo Go obok innego projektu, więc nie dostał dostępu do bazy
            danych. Twoje dane są bezpieczne.
          </Text>
          <Text style={[bodyText, { color: colors.textMuted }]}>
            Zamknij Expo Go (usuń je z ostatnich aplikacji) i otwórz projekt ponownie.
          </Text>
          {__DEV__ ? (
            <Pressable
              accessibilityRole="button"
              onPress={reloadRuntime}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.glow, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[buttonText, { color: colors.onGlow }]}>Spróbuj ponownie</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    gap: spacing.lg,
    maxWidth: layout.contentMaxWidth,
  },
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
});
