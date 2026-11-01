import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { radius, spacing, useTheme } from '@/theme';

import { BackIcon } from './icons/UiIcons';

const BUTTON_SIZE = 40;
const ICON_SIZE = 24;

/** A round back button that floats over photos. */
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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Wróć"
      hitSlop={spacing.sm}
      onPress={goBack}
      style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <BackIcon color={colors.text} size={ICON_SIZE} />
    </Pressable>
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
