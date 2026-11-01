import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

import { BackIcon } from './icons/UiIcons';
import { PressableScale } from './PressableScale';

const BUTTON_SIZE = 40;
const ICON_SIZE = 22;

/** A round paper button – readable both over photos and on the top bar. */
export function BackButton() {
  const { colors } = useTheme();

  function goBack() {
    // A screen opened from a link has nothing to go back to – then go to the atlas.
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Wróć"
      hitSlop={spacing.sm}
      onPress={goBack}
      style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <BackIcon color={colors.text} size={ICON_SIZE} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
