import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { type CSSTransitionProperties } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { EDIBILITY_CATEGORY_LABELS, toOptions } from '@/features/atlas/labels';
import type { Edibility, Species } from '@/features/atlas/types';
import { durations, radius, spacing, useTheme } from '@/theme';

type CategoryTabsProps = {
  /** Species matching everything except the category – the tabs count them. */
  species: Species[];
  selected: Edibility | null;
  onChange: (edibility: Edibility | null) => void;
};

const CATEGORIES = [{ value: null, label: 'Wszystkie' }, ...toOptions(EDIBILITY_CATEGORY_LABELS)];
const DOT_SIZE = 7;
const UNDERLINE_HEIGHT = 2;
// The underline draws itself from the middle when a tab is chosen.
const UNDERLINE_TRANSITION: CSSTransitionProperties = {
  transitionProperty: 'transform',
  transitionDuration: durations.base,
  transitionTimingFunction: 'ease-out',
};

/** Index tabs of a field guide: "● JADALNE 13", with the open one underlined in ink. */
export function CategoryTabs({ species, selected, onChange }: CategoryTabsProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, { borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.row}
      >
        {CATEGORIES.map((category) => {
          const isSelected = category.value === selected;
          const count =
            category.value === null
              ? species.length
              : species.filter((item) => item.edibility === category.value).length;

          return (
            <PressableScale
              key={category.label}
              haptic="selection"
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(category.value)}
              style={styles.tab}
            >
              <View style={styles.labelRow}>
                {category.value ? (
                  <View style={[styles.dot, { backgroundColor: colors[category.value] }]} />
                ) : null}
                <AppText variant="label" color={isSelected ? 'text' : 'textMuted'}>
                  {category.label}
                </AppText>
                <AppText variant="label" color={isSelected ? 'accent' : 'textMuted'}>
                  {count}
                </AppText>
              </View>
              <Animated.View
                style={[
                  styles.underline,
                  UNDERLINE_TRANSITION,
                  { backgroundColor: colors.text, transform: [{ scaleX: isSelected ? 1 : 0 }] },
                ]}
              />
            </PressableScale>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    gap: spacing.lg,
  },
  tab: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: radius.pill,
  },
  underline: {
    height: UNDERLINE_HEIGHT,
  },
});
