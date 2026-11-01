import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { SectionHeader } from '@/components/SectionHeader';
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
    <View style={styles.section}>
      <SectionHeader title="Sezon" trailing={formatSeason(months)} />
      <View style={styles.clock}>
        <SeasonClock months={months} currentMonth={currentMonth} />
      </View>
      <AppText variant="heading" color={inSeasonNow ? 'season' : 'textMuted'} style={styles.center}>
        {inSeasonNow ? 'Teraz w sezonie' : 'Teraz poza sezonem'}
      </AppText>
      <AppText variant="caption" color="textMuted" style={styles.center}>
        Wskazówka pokazuje bieżący miesiąc – {MONTH_NAMES[currentMonth]}.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  clock: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  center: {
    textAlign: 'center',
  },
});
