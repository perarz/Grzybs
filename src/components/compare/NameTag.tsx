import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { radius, spacing, useTheme } from '@/theme';

type NameTagProps = {
  label: string;
  side: 'left' | 'right';
};

/** A species name pinned to the bottom corner of a photo. */
export function NameTag({ label, side }: NameTagProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.tag,
        side === 'left' ? styles.left : styles.right,
        { backgroundColor: colors.surface },
      ]}
    >
      <AppText variant="label" numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    position: 'absolute',
    bottom: spacing.sm,
    maxWidth: '45%',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    pointerEvents: 'none',
  },
  left: {
    left: spacing.sm,
  },
  right: {
    right: spacing.sm,
  },
});
