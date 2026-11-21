import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { AtlasIcon } from '@/components/icons/TabIcons';
import { durations, spacing, useTheme } from '@/theme';

type EmptyResultsProps = {
  onClear: () => void;
  collectionOnly?: boolean;
};

const ICON_SIZE = 44;

export function EmptyResults({ onClear, collectionOnly = false }: EmptyResultsProps) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(durations.slow)} style={styles.empty}>
      <AtlasIcon color={colors.textMuted} size={ICON_SIZE} />
      <View style={styles.text}>
        <AppText variant="title" style={styles.center}>
          {collectionOnly ? 'Kolekcja czeka na odkrycia' : 'Nic tu nie rośnie'}
        </AppText>
        <AppText color="textMuted" style={styles.center}>
          {collectionOnly
            ? 'Nie ma odkrytych gatunków pasujących do tych filtrów. Dodaj zdjęcie znaleziska lub pokaż cały atlas.'
            : 'Żaden gatunek w atlasie nie ma wszystkich tych cech naraz.'}
        </AppText>
      </View>
      <Button label="Wyczyść filtry" variant="secondary" onPress={onClear} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  text: {
    gap: spacing.xs,
  },
  center: {
    textAlign: 'center',
  },
});
