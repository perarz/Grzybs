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
  info: { accent: 'primary', background: 'primaryMuted' },
} satisfies Record<Tone, { accent: keyof ThemeColors; background: keyof ThemeColors }>;

const ICON_SIZE = 22;

export function AlertBanner({ tone, title, children }: AlertBannerProps) {
  const { colors } = useTheme();
  const { accent, background } = TONE_COLORS[tone];

  return (
    <View
      accessibilityRole="alert"
      style={[styles.banner, { backgroundColor: colors[background], borderColor: colors[accent] }]}
    >
      <WarningIcon color={colors[accent]} size={ICON_SIZE} />
      <View style={styles.text}>
        <AppText variant="bodyStrong" color={accent}>
          {title}
        </AppText>
        <AppText>{children}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: spacing.xs,
    padding: spacing.lg,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
});
