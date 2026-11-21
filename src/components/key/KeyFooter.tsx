import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { formatSpeciesCount } from '@/features/atlas/identificationKey';
import { spacing, useTheme } from '@/theme';

type KeyFooterProps = {
  canGoBack: boolean;
  matchCount: number;
  onBack: () => void;
  onSkip: () => void;
  onShowResults: () => void;
};

/** Back, "I don't know" and the live result count, always at hand below the question. */
export function KeyFooter({
  canGoBack,
  matchCount,
  onBack,
  onSkip,
  onShowResults,
}: KeyFooterProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.footer, { borderTopColor: colors.border }]}>
      <View style={styles.row}>
        {canGoBack ? (
          <Button
            label="Wstecz"
            icon="back"
            variant="secondary"
            onPress={onBack}
            style={styles.half}
          />
        ) : null}
        <Button label="Nie wiem" variant="secondary" onPress={onSkip} style={styles.half} />
      </View>
      <Button label={`Pokaż ${formatSpeciesCount(matchCount)}`} onPress={onShowResults} />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
});
