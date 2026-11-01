import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { CheckIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import { radius, spacing, springs, useTheme } from '@/theme';

type KeyOptionTileProps = {
  label: string;
  /** E.g. "12 gatunków" – how many species would remain with this answer. */
  countLabel: string;
  illustration: ReactNode;
  isSelected: boolean;
  /** No species has this feature with the other answers – nothing to choose here. */
  isDisabled: boolean;
  width: number;
  onPress: () => void;
};

const CHECK_SIZE = 22;
const DISABLED_OPACITY = 0.38;
const SELECTED_BORDER_WIDTH = 2;

export function KeyOptionTile({
  label,
  countLabel,
  illustration,
  isSelected,
  isDisabled,
  width,
  onPress,
}: KeyOptionTileProps) {
  const { colors } = useTheme();

  return (
    <PressableScale
      haptic="selection"
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      accessibilityLabel={`${label}, ${countLabel}`}
      onPress={onPress}
      style={[
        styles.tile,
        {
          width,
          opacity: isDisabled ? DISABLED_OPACITY : 1,
          backgroundColor: isSelected ? colors.primaryMuted : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
          borderWidth: isSelected ? SELECTED_BORDER_WIDTH : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.illustration}>{illustration}</View>
      <AppText variant="heading" style={styles.center}>
        {label}
      </AppText>
      <AppText variant="label" color={isSelected ? 'text' : 'textMuted'}>
        {countLabel}
      </AppText>
      {isSelected ? (
        <Animated.View
          entering={ZoomIn.springify().damping(springs.press.damping)}
          style={[styles.check, { backgroundColor: colors.primary }]}
        >
          <CheckIcon color={colors.onPrimary} size={CHECK_SIZE - spacing.sm} />
        </Animated.View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  illustration: {
    marginBottom: spacing.xs,
  },
  center: {
    textAlign: 'center',
  },
  check: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
});
