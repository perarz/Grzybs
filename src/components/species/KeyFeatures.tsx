import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { SectionHeader } from '@/components/SectionHeader';
import { spacing } from '@/theme';

type KeyFeaturesProps = {
  features: string[];
};

const NUMBER_WIDTH = 24;

/** Numbered like the identification key in a field guide: 01, 02, 03… */
export function KeyFeatures({ features }: KeyFeaturesProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Jak rozpoznać" />
      {features.map((feature, index) => (
        <View key={feature} style={styles.row}>
          <AppText variant="label" color="accent" style={styles.number}>
            {String(index + 1).padStart(2, '0')}
          </AppText>
          <AppText style={styles.text}>{feature}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  number: {
    width: NUMBER_WIDTH,
    // Body text has a 24 px line height and labels 14 px – this lines the number up with the first line.
    marginTop: spacing.xs + 1,
  },
  text: {
    flex: 1,
  },
});
