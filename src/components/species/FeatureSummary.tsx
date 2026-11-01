import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import {
  CAP_COLOR_LABELS,
  HABITAT_LABELS,
  RARITY_LABELS,
  UNDERSIDE_LABELS,
} from '@/features/atlas/labels';
import type { Species } from '@/features/atlas/types';
import { spacing, useTheme } from '@/theme';

type FeatureSummaryProps = {
  species: Species;
};

/** The same features the atlas filter uses, shown as a short table. */
export function FeatureSummary({ species }: FeatureSummaryProps) {
  const { colors } = useTheme();
  const { features } = species;

  const rows = [
    { label: 'Pod kapeluszem', value: UNDERSIDE_LABELS[features.underside] },
    {
      label: 'Kolor kapelusza',
      value: features.capColors.map((color) => CAP_COLOR_LABELS[color]).join(', '),
    },
    { label: 'Pierścień', value: features.ring ? 'jest' : 'brak' },
    { label: 'Pochwa u nasady', value: features.volva ? 'jest' : 'brak' },
    { label: 'Zmienia barwę', value: features.colorChange ? 'tak' : 'nie' },
    {
      label: 'Gdzie rośnie',
      value: species.habitats.map((habitat) => HABITAT_LABELS[habitat]).join(', '),
    },
    { label: 'Występowanie', value: RARITY_LABELS[species.rarity] },
  ];

  return (
    <Card>
      <AppText variant="heading">Cechy w skrócie</AppText>
      {rows.map((row, index) => (
        <View
          key={row.label}
          style={[
            styles.row,
            index > 0 && {
              borderTopColor: colors.border,
              borderTopWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          <AppText color="textMuted">{row.label}</AppText>
          <AppText variant="bodyStrong" style={styles.value}>
            {row.value.toLowerCase()}
          </AppText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingTop: spacing.sm,
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
});
