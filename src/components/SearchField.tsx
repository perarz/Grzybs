import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { radius, spacing, typography, useTheme } from '@/theme';

import { CloseIcon, SearchIcon } from './icons/UiIcons';

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

const ICON_SIZE = 20;

export function SearchField({ value, onChangeText, placeholder }: SearchFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <SearchIcon color={colors.textMuted} size={ICON_SIZE} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={placeholder}
        autoCorrect={false}
        returnKeyType="search"
        style={[typography.body, styles.input, { color: colors.text }]}
      />
      {value !== '' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Wyczyść wyszukiwanie"
          hitSlop={spacing.sm}
          onPress={() => onChangeText('')}
        >
          <CloseIcon color={colors.textMuted} size={ICON_SIZE} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
  },
});
