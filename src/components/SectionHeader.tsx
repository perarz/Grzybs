import { StyleSheet, View } from 'react-native';

import { spacing, useTheme } from '@/theme';

import { AppText } from './AppText';

type SectionHeaderProps = {
  title: string;
  /** A small note on the right, e.g. a count. */
  trailing?: string;
};

/** "SEZON ————————— 04" – a typewritten heading with a ruled line, like in a field notebook. */
export function SectionHeader({ title, trailing }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <AppText variant="label" color="textMuted">
        {title}
      </AppText>
      <View style={[styles.rule, { backgroundColor: colors.border }]} />
      {trailing ? (
        <AppText variant="label" color="textMuted">
          {trailing}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
});
