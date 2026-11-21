import * as Linking from 'expo-linking';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { spacing } from '@/theme';

export function SourceLink({ title, url }: { title: string; url: string }) {
  const [failed, setFailed] = useState(false);
  async function open() {
    setFailed(false);
    try {
      await Linking.openURL(url);
    } catch {
      setFailed(true);
    }
  }
  return (
    <View style={styles.content}>
      <PressableScale
        accessibilityRole="link"
        accessibilityLabel={title}
        onPress={() => void open()}
        style={styles.link}
      >
        <AppText color="accent" style={styles.title}>
          {title}
        </AppText>
        <AppText color="accent">↗</AppText>
      </PressableScale>
      {failed ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          Nie udało się otworzyć źródła. Sprawdź połączenie i spróbuj ponownie.
        </AppText>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.xs },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: { flex: 1 },
});
