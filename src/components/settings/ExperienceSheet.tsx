import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { EXPERIENCES } from '@/features/onboarding/questions';
import { layout, radius, spacing, useTheme } from '@/theme';

export function ExperienceSheet({ onClose }: { onClose: () => void }) {
  const { profile, changeExperience } = useOnboarding();
  const [selected, setSelected] = useState(profile?.experience ?? 'new');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const { colors } = useTheme();
  async function save(close: () => void) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      await changeExperience(selected);
      close();
    } catch {
      setError('Nie udało się zapisać. Spróbuj ponownie.');
    } finally {
      setBusy(false);
      lock.current = false;
    }
  }
  return (
    <BottomSheet
      dismissible={!busy}
      onClose={onClose}
      header={() => <AppText variant="title">Twój poziom</AppText>}
    >
      {(close) => (
        <ScrollView contentContainerStyle={styles.body}>
          <AppText color="textMuted">Dopasuj kolejność treści w Nauce.</AppText>
          {EXPERIENCES.map((item) => (
            <PressableScale
              key={item.id}
              accessibilityRole="radio"
              accessibilityLabel={`${item.title}. ${item.subtitle}`}
              accessibilityState={{ checked: selected === item.id, disabled: busy }}
              disabled={busy}
              onPress={() => setSelected(item.id)}
              style={[
                styles.choice,
                {
                  backgroundColor: colors.surface,
                  borderColor: selected === item.id ? colors.glow : colors.border,
                },
              ]}
            >
              <FieldIcon
                name={item.icon}
                size={spacing.xl}
                color={selected === item.id ? colors.glow : colors.textMuted}
              />
              <View style={styles.label}>
                <AppText variant="heading">{item.title}</AppText>
                <AppText variant="caption" color="textMuted">
                  {item.subtitle}
                </AppText>
              </View>
              <AppText color={selected === item.id ? 'glow' : 'textMuted'}>
                {selected === item.id ? '●' : '○'}
              </AppText>
            </PressableScale>
          ))}
          {error && (
            <AppText color="danger" accessibilityRole="alert">
              {error}
            </AppText>
          )}
          <Button
            label={busy ? 'Zapisuję…' : 'Zapisz'}
            disabled={busy}
            onPress={() => void save(close)}
          />
          <Button label="Zamknij" variant="secondary" disabled={busy} onPress={close} />
        </ScrollView>
      )}
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  body: { padding: spacing.lg, gap: spacing.lg },
  choice: {
    minHeight: layout.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  label: { flex: 1, gap: spacing.xs },
});
