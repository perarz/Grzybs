import * as Linking from 'expo-linking';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { fieldPanel as ink } from '@/theme/field';
import { spacing } from '@/theme';

export function WeatherAttribution() {
  const [error, setError] = useState<string | null>(null);
  function open(url: string) {
    setError(null);
    Linking.openURL(url).catch(() =>
      setError('Nie udało się otworzyć strony. Spróbuj ponownie, gdy odzyskasz połączenie.'),
    );
  }
  return (
    <View style={styles.content}>
      <PressableScale
        haptic="none"
        accessibilityRole="link"
        onPress={() => open('https://open-meteo.com/')}
      >
        <AppText variant="caption" style={{ color: ink.accent }}>
          Open-Meteo ↗
        </AppText>
      </PressableScale>
      <PressableScale
        haptic="none"
        accessibilityRole="link"
        onPress={() => open('https://creativecommons.org/licenses/by/4.0/')}
      >
        <AppText variant="caption" style={{ color: ink.muted }}>
          CC BY 4.0
        </AppText>
      </PressableScale>
      {error ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  content: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
