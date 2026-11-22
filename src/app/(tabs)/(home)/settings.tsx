import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { AboutAtlasSheet } from '@/components/about/AboutAtlasSheet';
import { SettingsNotifications } from '@/components/settings/SettingsNotifications';
import { SettingsData } from '@/components/settings/SettingsData';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { SettingsSwitch } from '@/components/settings/SettingsSwitch';
import { setHapticsEnabled } from '@/features/feedback/haptics';
import { radius, spacing, useTheme } from '@/theme';
import app from '../../../../app.json';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [sheet, setSheet] = useState<'about' | null>(null);
  const card = [styles.card, { backgroundColor: colors.surface, borderColor: colors.border }];
  return (
    <Screen title="Ustawienia" showBack>
      <AppText variant="label" color="accent">
        Nauka
      </AppText>
      <View style={card}>
        <SettingsSwitch
          setting="lesson_sounds"
          title="Dźwięki w lekcjach"
          description="Krótki sygnał przy dobrej i złej odpowiedzi oraz na koniec lekcji."
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <SettingsSwitch
          setting="haptics"
          title="Wibracje"
          description="Delikatne drgnięcie przy dotyku, odpowiedziach i ostrzeżeniach."
          onChange={setHapticsEnabled}
        />
      </View>
      <AppText variant="label" color="accent">
        Powiadomienia
      </AppText>
      <View style={card}>
        <SettingsNotifications />
      </View>
      <AppText variant="label" color="accent">
        Twoje dane
      </AppText>
      <SettingsData />
      <AppText variant="label" color="accent">
        O aplikacji
      </AppText>
      <SettingsRow
        icon="info"
        title="Źródła i informacje"
        caption="Materiały, licencje i prywatność"
        onPress={() => setSheet('about')}
      />
      <AppText variant="caption" color="textMuted" style={styles.version}>
        Grzybs · {app.expo.version}
      </AppText>
      {sheet === 'about' && <AboutAtlasSheet onClose={() => setSheet(null)} />}
    </Screen>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: spacing.sm },
  version: { textAlign: 'center', paddingVertical: spacing.sm },
});
