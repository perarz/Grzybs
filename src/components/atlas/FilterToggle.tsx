import { StyleSheet, View } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { ChevronDownIcon, SlidersIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import { durations, radius, spacing, useTheme } from '@/theme';

type FilterToggleProps = {
  isOpen: boolean;
  activeCount: number;
  onPress: () => void;
};

const ICON_SIZE = 16;
const BADGE_SIZE = 18;
const CHEVRON_TRANSITION: CSSTransitionProperties = {
  transitionProperty: 'transform',
  transitionDuration: durations.base,
  transitionTimingFunction: 'ease-in-out',
};

/** "CECHY ②  ⌄" – opens the feature filter; the chevron turns, the badge counts set features. */
export function FilterToggle({ isOpen, activeCount, onPress }: FilterToggleProps) {
  const { colors } = useTheme();

  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen }}
      accessibilityLabel={`Filtr cech, zaznaczone: ${activeCount}`}
      onPress={onPress}
      style={[styles.toggle, { borderColor: isOpen ? colors.text : colors.border }]}
    >
      <SlidersIcon color={colors.text} size={ICON_SIZE} />
      <AppText variant="label">Cechy</AppText>
      {activeCount > 0 ? (
        <View style={[styles.badge, { backgroundColor: colors.accent }]}>
          <AppText variant="label" color="onPrimary">
            {activeCount}
          </AppText>
        </View>
      ) : null}
      <Animated.View
        style={[CHEVRON_TRANSITION, { transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }]}
      >
        <ChevronDownIcon color={colors.textMuted} size={ICON_SIZE} />
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  badge: {
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
  },
});
