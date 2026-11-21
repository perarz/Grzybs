import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { SectionHeader } from '@/components/SectionHeader';
import { spacing } from '@/theme';

type KeyFeaturesProps = {
  features: string[];
};

const NUMBER_WIDTH = 18;

/** Short, consistently aligned field observations. */
export function KeyFeatures({ features }: KeyFeaturesProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Jak rozpoznać" />
      {features.map((feature, index) => (
        <View key={feature} style={styles.row}>
          <AppText variant="caption" color="accent" style={styles.number}>
            {index + 1}
          </AppText>
          <AppText style={styles.text}>{feature}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  number: {
    width: NUMBER_WIDTH,
    // Align the small number with the first line of the observation.
    marginTop: spacing.xs,
  },
  text: {
    flex: 1,
  },
});
