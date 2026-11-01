import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EdibilityStamp } from '@/components/atlas/EdibilityStamp';
import { SectionHeader } from '@/components/SectionHeader';
import type { LookalikePair, Species } from '@/features/atlas/types';
import { spacing, useTheme } from '@/theme';

type DifferencesTableProps = {
  pair: LookalikePair;
  first: Species;
  second: Species;
};

/** Two columns, one row per trait – read across to see what tells the species apart. */
export function DifferencesTable({ pair, first, second }: DifferencesTableProps) {
  const { colors } = useTheme();
  const divider = { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth };

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Jak odróżnić"
        trailing={String(pair.differences.length).padStart(2, '0')}
      />
      <View style={styles.columns}>
        {[first, second].map((species) => (
          <View key={species.id} style={styles.cell}>
            <AppText variant="heading">{species.namePl}</AppText>
            <EdibilityStamp edibility={species.edibility} />
          </View>
        ))}
      </View>
      {pair.differences.map((difference) => (
        <View key={difference.trait} style={[styles.difference, divider]}>
          <AppText variant="label" color="accent">
            {difference.trait}
          </AppText>
          <View style={styles.columns}>
            <AppText style={styles.cell}>{difference.first}</AppText>
            <AppText style={styles.cell}>{difference.second}</AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  columns: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  cell: {
    flex: 1,
    gap: spacing.sm,
  },
  difference: {
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
});
