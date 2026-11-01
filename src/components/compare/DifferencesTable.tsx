import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EdibilityBadge } from '@/components/atlas/EdibilityBadge';
import { Card } from '@/components/Card';
import type { LookalikePair, Species } from '@/features/atlas/types';
import { spacing, useTheme } from '@/theme';

type DifferencesTableProps = {
  pair: LookalikePair;
  first: Species;
  second: Species;
};

export function DifferencesTable({ pair, first, second }: DifferencesTableProps) {
  const { colors } = useTheme();
  const divider = { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth };

  return (
    <Card style={styles.table}>
      <AppText variant="heading">Jak odróżnić</AppText>
      <View style={styles.columns}>
        {[first, second].map((species) => (
          <View key={species.id} style={styles.cell}>
            <AppText variant="bodyStrong">{species.namePl}</AppText>
            <EdibilityBadge edibility={species.edibility} />
          </View>
        ))}
      </View>
      {pair.differences.map((difference) => (
        <View key={difference.trait} style={[styles.difference, divider]}>
          <AppText variant="label" color="textMuted">
            {difference.trait.toUpperCase()}
          </AppText>
          <View style={styles.columns}>
            <AppText style={styles.cell}>{difference.first}</AppText>
            <AppText style={styles.cell}>{difference.second}</AppText>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  table: {
    gap: spacing.md,
  },
  columns: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  cell: {
    flex: 1,
    gap: spacing.xs,
  },
  difference: {
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
});
