import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useTheme, type ThemeColors } from '@/theme';

import { AppText } from './AppText';
import { WarningIcon } from './icons/UiIcons';

type Tone = 'danger' | 'warning' | 'info';

type AlertBannerProps = {
  tone: Tone;
  title: string;
  children: ReactNode;
};

const TONE_COLORS = {
  danger: { accent: 'danger', background: 'dangerMuted' },
  warning: { accent: 'poisonous', background: 'warningMuted' },
  info: { accent: 'textMuted', background: 'primaryMuted' },
} satisfies Record<Tone, { accent: keyof ThemeColors; background: keyof ThemeColors }>;

const ICON_SIZE = 16;
const RULE_WIDTH = 3;

/** A margin note: a coloured rule, a typewritten title and the message. */
export function AlertBanner({ tone, title, children }: AlertBannerProps) {
  const { colors } = useTheme();
  const { accent, background } = TONE_COLORS[tone];

  return (
    <View
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: colors[background], borderColor: colors[accent] }]}
    >
      <View style={styles.title}>
        <WarningIcon color={colors[accent]} size={ICON_SIZE} />
        <AppText variant="label" color={accent}>
          {title}
        </AppText>
      </View>
      <AppText>{children}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    gap: spacing.sm,
    borderRadius: radius.sm,
    borderLeftWidth: RULE_WIDTH,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
