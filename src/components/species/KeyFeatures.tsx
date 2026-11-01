import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { radius, spacing, useTheme } from '@/theme';

type KeyFeaturesProps = {
  features: string[];
};

const BULLET_SIZE = 6;

export function KeyFeatures({ features }: KeyFeaturesProps) {
  const { colors } = useTheme();

  return (
    <Card>
      <AppText variant="heading">Jak rozpoznać</AppText>
      {features.map((feature) => (
        <View key={feature} style={styles.row}>
          <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
          <AppText style={styles.text}>{feature}</AppText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bullet: {
    width: BULLET_SIZE,
    height: BULLET_SIZE,
    borderRadius: radius.pill,
    // Body text has a 22 px line height – this puts the dot in the middle of the first line.
    marginTop: spacing.sm,
  },
  text: {
    flex: 1,
  },
});
