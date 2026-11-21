import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { EdibilityStamp } from '@/components/atlas/EdibilityStamp';
import type { Species } from '@/features/atlas/types';
import { spacing } from '@/theme';

type SpeciesTitleProps = {
  species: Species;
};

/** The head of a specimen sheet: number and stamp, then the Polish and Latin names. */
export function SpeciesTitle({ species }: SpeciesTitleProps) {
  const otherNames = species.otherNames.filter(
    (name) => name.toLowerCase() !== species.nameCommon?.toLowerCase(),
  );
  return (
    <View style={styles.title}>
      <View style={styles.meta}>
        <EdibilityStamp edibility={species.edibility} />
      </View>
      <AppText variant="title" accessibilityRole="header">
        {species.nameCommon ?? species.namePl}
      </AppText>
      {species.nameCommon && <AppText color="textMuted">{species.namePl}</AppText>}
      <AppText variant="latin" color="textMuted">
        {species.nameLatin}
      </AppText>
      {otherNames.length > 0 ? (
        <AppText variant="caption" color="textMuted">
          Inne nazwy: {otherNames.join(', ')}
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
