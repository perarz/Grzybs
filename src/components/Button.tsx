import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { layout, radius, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type ButtonProps = {
  label: string;
  disabled?: boolean;
  onPress: () => void;
  /** Secondary is an outlined button for less important actions. */
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled = false,
}: ButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={style}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: disabled
              ? colors.surfaceMuted
              : isPrimary
                ? colors.glow
                : 'transparent',
            borderColor: disabled || !isPrimary ? colors.border : colors.glow,
          },
        ]}
      >
        <AppText variant="button" color={disabled ? 'textMuted' : isPrimary ? 'onGlow' : 'text'}>
          {label}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.touchTarget,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
});
