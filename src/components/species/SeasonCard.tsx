import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { MONTH_NAMES } from '@/features/atlas/labels';
import { formatSeason, getCurrentMonth } from '@/features/atlas/season';
import type { Month } from '@/features/atlas/types';
import { spacing } from '@/theme';

import { SeasonClock } from './SeasonClock';

type SeasonCardProps = {
  months: Month[];
};

export function SeasonCard({ months }: SeasonCardProps) {
  const currentMonth = getCurrentMonth();
  const inSeasonNow = months.includes(currentMonth);

  return (
    <Card>
      <AppText variant="heading">Sezon</AppText>
      <View style={styles.clock}>
        <SeasonClock months={months} currentMonth={currentMonth} />
      </View>
      <AppText variant="bodyStrong" color={inSeasonNow ? 'edible' : 'textMuted'}>
        {inSeasonNow ? 'Teraz w sezonie' : 'Teraz poza sezonem'} ({MONTH_NAMES[currentMonth]})
      </AppText>
      <AppText color="textMuted">Owocniki pojawiają się: {formatSeason(months)}.</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  clock: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});
