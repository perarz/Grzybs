import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut, type CSSTransitionProperties } from 'react-native-reanimated';

import { durations, radius, spacing, typography, useTheme } from '@/theme';

import { CloseIcon, SearchIcon } from './icons/UiIcons';
import { PressableScale } from './PressableScale';

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

const ICON_SIZE = 20;
const BORDER_TRANSITION: CSSTransitionProperties = {
  transitionProperty: 'borderColor',
  transitionDuration: durations.fast,
};

export function SearchField({ value, onChangeText, placeholder }: SearchFieldProps) {
  const { colors } = useTheme();
  const [isFocused, setFocused] = useState(false);

  return (
    <Animated.View
      style={[
        styles.field,
        BORDER_TRANSITION,
        { backgroundColor: colors.surface, borderColor: isFocused ? colors.text : colors.border },
      ]}
    >
      <SearchIcon color={isFocused ? colors.text : colors.textMuted} size={ICON_SIZE} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        cursorColor={colors.accent}
        accessibilityLabel={placeholder}
        autoCorrect={false}
        returnKeyType="search"
        style={[typography.body, styles.input, { color: colors.text }]}
      />
      {value !== '' ? (
        <Animated.View
          entering={FadeIn.duration(durations.fast)}
          exiting={FadeOut.duration(durations.fast)}
        >
          <PressableScale
            haptic="selection"
            accessibilityRole="button"
            accessibilityLabel="Wyczyść wyszukiwanie"
            hitSlop={spacing.sm}
            onPress={() => onChangeText('')}
          >
            <CloseIcon color={colors.textMuted} size={ICON_SIZE} />
          </PressableScale>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
  },
});
