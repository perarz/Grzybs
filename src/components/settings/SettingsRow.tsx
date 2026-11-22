import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon, type FieldIconName } from '@/components/icons/FieldIcon';
import { layout, radius, spacing, useTheme } from '@/theme';

type Props = {
  icon: FieldIconName;
  title: string;
  caption: string;
  onPress: () => void;
  disabled?: boolean;
  /** A row that deletes something gets a warning colour. */
  danger?: boolean;
};

/** A settings card that opens something or starts an action. */
export function SettingsRow({
  icon,
  title,
  caption,
  onPress,
  disabled = false,
  danger = false,
}: Props) {
  const { colors } = useTheme();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <FieldIcon name={icon} size={spacing.xl} color={danger ? colors.danger : colors.glow} />
      <View style={styles.label}>
        <AppText variant="bodyStrong" color={disabled ? 'textMuted' : 'text'}>
          {title}
        </AppText>
        <AppText variant="caption" color="textMuted">
          {caption}
        </AppText>
      </View>
      <FieldIcon name="chevronRight" size={spacing.lg} color={colors.textMuted} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: layout.touchTarget,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: { flex: 1, gap: spacing.xs },
});
