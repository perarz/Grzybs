import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EdibilityStamp } from '@/components/atlas/EdibilityStamp';
import { getCatalogNumber } from '@/data/species';
import type { Species } from '@/features/atlas/types';
import { spacing } from '@/theme';

type SpeciesTitleProps = {
  species: Species;
};

/** The head of a specimen sheet: number and stamp, then the Polish and Latin names. */
export function SpeciesTitle({ species }: SpeciesTitleProps) {
  return (
    <View style={styles.title}>
      <View style={styles.meta}>
        <AppText variant="label" color="accent">
          {getCatalogNumber(species.id)}
        </AppText>
        <EdibilityStamp edibility={species.edibility} />
      </View>
      <AppText variant="display" accessibilityRole="header">
        {species.namePl}
      </AppText>
      <AppText variant="latin" color="textMuted">
        {species.nameLatin}
      </AppText>
      {species.otherNames.length > 0 ? (
        <AppText variant="caption" color="textMuted">
          Inne nazwy: {species.otherNames.join(', ')}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    gap: spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
});
