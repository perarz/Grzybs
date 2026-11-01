import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EDIBILITY_LABELS } from '@/features/atlas/labels';
import type { Edibility } from '@/features/atlas/types';
import { radius, spacing, useTheme } from '@/theme';

type EdibilityStampProps = {
  edibility: Edibility;
};

const OUTER_BORDER_WIDTH = 1.5;
const FRAME_GAP = 2;
// A hand-pressed stamp is never perfectly straight.
const STAMP_ROTATION = '-2deg';

/** Edibility as a rubber stamp with a double frame. */
export function EdibilityStamp({ edibility }: EdibilityStampProps) {
  const { colors } = useTheme();
  // The theme has a colour named after each edibility level.
  const inkColor = colors[edibility];

  return (
    <View
      style={[
        styles.outer,
        { borderColor: inkColor, backgroundColor: colors.surface },
        { transform: [{ rotate: STAMP_ROTATION }] },
      ]}
    >
      <View style={[styles.inner, { borderColor: inkColor }]}>
        <AppText variant="label" color={edibility}>
          {EDIBILITY_LABELS[edibility]}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignSelf: 'flex-start',
    borderRadius: radius.xs,
    borderWidth: OUTER_BORDER_WIDTH,
    padding: FRAME_GAP,
  },
  inner: {
    borderRadius: radius.xs,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.sm - FRAME_GAP,
    paddingVertical: FRAME_GAP,
  },
});
