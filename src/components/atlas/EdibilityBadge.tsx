import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EDIBILITY_LABELS } from '@/features/atlas/labels';
import type { Edibility } from '@/features/atlas/types';
import { radius, spacing, useTheme } from '@/theme';

type EdibilityBadgeProps = {
  edibility: Edibility;
};

export function EdibilityBadge({ edibility }: EdibilityBadgeProps) {
  const { colors } = useTheme();

  return (
    // The theme has a color named after each edibility level, so the level picks its own color.
    <View style={[styles.badge, { backgroundColor: colors[edibility] }]}>
      <AppText variant="label" color="onPrimary">
        {EDIBILITY_LABELS[edibility]}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
