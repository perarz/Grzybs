import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { layout, radius, spacing, useTheme } from '@/theme';

export function SettingsButton() {
  const { colors } = useTheme();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Ustawienia"
      onPress={() => router.navigate('/settings')}
      style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <FieldIcon name="settings" size={spacing.xl} color={colors.text} />
    </PressableScale>
  );
}
const styles = StyleSheet.create({
  button: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
