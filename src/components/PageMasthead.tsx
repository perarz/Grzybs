import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { TOP_BAR_HEIGHT } from '@/components/CollapsingTopBar';
import { layout, spacing, useTheme } from '@/theme';

type Props = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  showBack?: boolean;
  onTitlePress?: () => void;
  /** Shown to the right of the large title, e.g. the settings button. */
  accessory?: ReactNode;
  children?: ReactNode;
};
export function PageMasthead({
  title,
  eyebrow,
  subtitle,
  showBack,
  onTitlePress,
  accessory,
  children,
}: Props) {
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();
  const label = (
    <AppText variant="display" accessibilityRole="header">
      {title}
    </AppText>
  );
  return (
    <View
      style={[
        styles.header,
        { paddingTop: top + (showBack ? TOP_BAR_HEIGHT : spacing.xl), borderColor: colors.border },
      ]}
    >
      {eyebrow && (
        <AppText variant="label" color="accent" style={styles.eyebrow}>
          {eyebrow}
        </AppText>
      )}
      <View style={styles.titleRow}>
        {onTitlePress ? (
          <PressableScale
            onPress={onTitlePress}
            pressedScale={1}
            haptic="none"
            style={styles.title}
          >
            {label}
          </PressableScale>
        ) : (
          label
        )}
        {accessory}
      </View>
      {subtitle && (
        <AppText variant="caption" color="textMuted">
          {subtitle}
        </AppText>
      )}
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  // Leaves the top-right corner free: Expo Go puts its own floating Tools button there.
  eyebrow: { paddingRight: layout.touchTarget + spacing.sm },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: { alignSelf: 'flex-start' },
});
