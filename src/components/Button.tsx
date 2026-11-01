import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type ButtonProps = {
  label: string;
  onPress: () => void;
  /** Secondary is an outlined button for less important actions. */
  variant?: 'primary' | 'secondary';
};

export function Button({ label, onPress, variant = 'primary' }: ButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <PressableScale accessibilityRole="button" onPress={onPress}>
      <View
        style={[
          styles.button,
          {
            backgroundColor: isPrimary ? colors.primary : 'transparent',
            borderColor: colors.primary,
          },
        ]}
      >
        <AppText variant="button" color={isPrimary ? 'onPrimary' : 'primary'}>
          {label}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
});
