import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ChevronRightIcon, IdentifyIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import { KEY_STEPS } from '@/features/atlas/identificationKey';
import { radius, spacing, useTheme } from '@/theme';

type IdentifyKeyButtonProps = {
  answeredCount: number;
  onPress: () => void;
};

const ICON_SIZE = 26;
const ICON_CIRCLE_SIZE = 48;
const CHEVRON_SIZE = 20;
const BUTTON_PRESSED_SCALE = 0.98;

/** The way into the identification key – a dark green card, the main action of the atlas. */
export function IdentifyKeyButton({ answeredCount, onPress }: IdentifyKeyButtonProps) {
  const { colors } = useTheme();

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Klucz do oznaczania"
      pressedScale={BUTTON_PRESSED_SCALE}
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors.primary }]}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.accent }]}>
        <IdentifyIcon color={colors.onPrimary} size={ICON_SIZE} />
      </View>
      <View style={styles.text}>
        <AppText variant="heading" color="onPrimary">
          Klucz do oznaczania
        </AppText>
        <AppText variant="caption" color="onPrimary" style={styles.caption}>
          {answeredCount > 0
            ? `Odpowiedzi: ${answeredCount} z ${KEY_STEPS.length} – dotknij, by zmienić`
            : 'Znalazłeś grzyba? Odpowiedz na kilka pytań'}
        </AppText>
      </View>
      <ChevronRightIcon color={colors.onPrimary} size={CHEVRON_SIZE} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  text: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  caption: {
    opacity: 0.8,
  },
});
