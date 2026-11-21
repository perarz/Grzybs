import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { AboutAtlasSheet } from '@/components/about/AboutAtlasSheet';
import { ExperienceSheet } from '@/components/settings/ExperienceSheet';
import { SettingsNotifications } from '@/components/settings/SettingsNotifications';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { EXPERIENCES } from '@/features/onboarding/questions';
import { layout, radius, spacing, useTheme } from '@/theme';
import app from '../../../../app.json';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { profile } = useOnboarding();
  const [sheet, setSheet] = useState<'experience' | 'about' | null>(null);
  const experience = EXPERIENCES.find((item) => item.id === profile?.experience) ?? EXPERIENCES[0];
  const card = [styles.card, { backgroundColor: colors.surface, borderColor: colors.border }];
  return (
    <Screen title="Ustawienia" eyebrow="Po Twojemu" showBack>
      <AppText variant="label" color="accent">
        Nauka
      </AppText>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Poziom doświadczenia: ${experience.title}. Zmień`}
        onPress={() => setSheet('experience')}
        style={[card, styles.row]}
      >
        <FieldIcon name={experience.icon} size={spacing.xl} color={colors.glow} />
        <View style={styles.label}>
          <AppText variant="bodyStrong">{experience.title}</AppText>
          <AppText variant="caption" color="textMuted">
            Poziom doświadczenia
          </AppText>
        </View>
        <FieldIcon name="chevron" size={spacing.lg} color={colors.textMuted} />
      </PressableScale>
      <AppText variant="label" color="accent">
        Powiadomienia
      </AppText>
      <View style={card}>
        <SettingsNotifications />
      </View>
      <AppText variant="label" color="accent">
        O aplikacji
      </AppText>
      <PressableScale
        accessibilityRole="button"
        onPress={() => setSheet('about')}
        style={[card, styles.row]}
      >
        <FieldIcon name="info" size={spacing.xl} color={colors.glow} />
        <View style={styles.label}>
          <AppText variant="bodyStrong">Źródła i informacje</AppText>
          <AppText variant="caption" color="textMuted">
            Materiały, licencje i Twoje dane
          </AppText>
        </View>
        <FieldIcon name="chevron" size={spacing.lg} color={colors.textMuted} />
      </PressableScale>
      <AppText variant="caption" color="textMuted" style={styles.version}>
        Grzybnik · {app.expo.version}
      </AppText>
      {sheet === 'experience' && <ExperienceSheet onClose={() => setSheet(null)} />}
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
  row: {
    minHeight: layout.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: { flex: 1, gap: spacing.xs },
  version: { textAlign: 'center', paddingVertical: spacing.sm },
});
