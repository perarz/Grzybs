import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import type { ChoiceOption } from '@/features/learn/exercises';
import { durations, radius, spacing, useTheme } from '@/theme';

type ChoiceOptionsProps = {
  options: ChoiceOption[];
  layout: 'list' | 'photos' | 'pair';
  selected: string | null;
  correctId: string;
  /** After "Sprawdź" the answers are locked and show what was right. */
  checked: boolean;
  onSelect: (id: string) => void;
};

const SELECTED_BORDER = 3;

export function ChoiceOptions({
  options,
  layout,
  selected,
  correctId,
  checked,
  onSelect,
}: ChoiceOptionsProps) {
  const { colors } = useTheme();
  const photo = layout !== 'list';

  function verdict(id: string) {
    if (!checked) return '';
    if (id === correctId) return ', poprawna odpowiedź';
    return id === selected ? ', twoja odpowiedź – błędna' : '';
  }

  function tone(id: string) {
    if (checked && id === correctId) return colors.edible;
    if (checked && id === selected) return colors.danger;
    if (id === selected) return colors.glow;
    return colors.border;
  }

  return (
    <View style={photo ? styles.grid : styles.list}>
      {options.map((option, index) => {
        const isSelected = option.id === selected;
        const border = tone(option.id);
        const named = checked && (option.id === correctId || isSelected);
        return (
          <PressableScale
            key={option.id}
            haptic="selection"
            disabled={checked}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, disabled: checked }}
            accessibilityLabel={
              (photo && !checked ? `Zdjęcie ${index + 1}` : option.label) + verdict(option.id)
            }
            onPress={() => onSelect(option.id)}
            style={[
              photo ? (layout === 'pair' ? styles.pairTile : styles.photoTile) : styles.textTile,
              {
                borderColor: border,
                borderWidth:
                  isSelected || (checked && option.id === correctId) ? SELECTED_BORDER : 1,
                backgroundColor: isSelected && !checked ? colors.primaryMuted : colors.surface,
              },
            ]}
          >
            {photo && option.speciesId ? (
              <Image
                source={SPECIES_PHOTOS[option.speciesId].source}
                contentFit="cover"
                transition={durations.fast}
                style={[styles.image, { backgroundColor: colors.surfaceMuted }]}
              />
            ) : (
              <AppText variant="bodyStrong">{option.label}</AppText>
            )}
            {photo && named ? (
              <View style={[styles.reveal, { backgroundColor: border }]}>
                <AppText variant="label" color="onPrimary" numberOfLines={1}>
                  {option.label}
                </AppText>
              </View>
            ) : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  textTile: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + spacing.xs,
  },
  photoTile: { width: '48.5%', aspectRatio: 1, borderRadius: radius.md, overflow: 'hidden' },
  pairTile: { width: '48.5%', aspectRatio: 0.8, borderRadius: radius.md, overflow: 'hidden' },
  image: { flex: 1 },
  reveal: {
    position: 'absolute',
    left: spacing.xs,
    right: spacing.xs,
    bottom: spacing.xs,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
