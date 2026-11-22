import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { formatPlace, weightError, type FindDraft } from '@/features/collection/findDraft';
import { usePlaceCapture } from '@/features/collection/usePlaceCapture';
import { layout, radius, spacing, typography, useTheme } from '@/theme';

type Props = { draft: FindDraft; onChange: (draft: FindDraft) => void; disabled?: boolean };

const NOTE_LINES = 3;

/** Optional weight, place and note of a find – used when saving and when editing later. */
export function FindDetailsForm({ draft, onChange, disabled = false }: Props) {
  const { colors } = useTheme();
  const place = usePlaceCapture((value) => onChange({ ...draft, place: value }));
  const invalidWeight = weightError(draft);
  const input = [
    styles.input,
    { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface },
  ];
  return (
    <View style={styles.form}>
      <AppText variant="label" color="textMuted">
        Szczegóły · opcjonalnie
      </AppText>
      <View style={styles.row}>
        <TextInput
          value={draft.weight}
          onChangeText={(weight) => onChange({ ...draft, weight })}
          editable={!disabled}
          keyboardType="number-pad"
          maxLength={5}
          placeholder="Waga"
          placeholderTextColor={colors.textMuted}
          accessibilityLabel="Waga znaleziska w gramach"
          style={[input, styles.weight]}
        />
        <AppText color="textMuted">g</AppText>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={draft.place ? 'Usuń zapisane miejsce' : 'Zapisz obecne miejsce'}
          disabled={disabled || place.locating}
          onPress={() => (draft.place ? onChange({ ...draft, place: null }) : place.capture())}
          style={[styles.place, { borderColor: draft.place ? colors.glow : colors.border }]}
        >
          <FieldIcon
            name="pin"
            size={layout.icon}
            color={draft.place ? colors.glow : colors.text}
          />
          <AppText variant="caption" numberOfLines={1} style={styles.placeText}>
            {place.locating
              ? 'Szukam pozycji…'
              : draft.place
                ? formatPlace(draft.place)
                : 'Dodaj miejsce'}
          </AppText>
          {draft.place && <FieldIcon name="close" size={spacing.lg} color={colors.textMuted} />}
        </PressableScale>
      </View>
      {invalidWeight || place.error ? (
        <AppText variant="caption" color="danger" accessibilityRole="alert">
          {invalidWeight ?? place.error}
        </AppText>
      ) : null}
      <TextInput
        value={draft.note}
        onChangeText={(note) => onChange({ ...draft, note })}
        editable={!disabled}
        maxLength={500}
        multiline
        numberOfLines={NOTE_LINES}
        placeholder="Opis – gdzie rosły, ile ich było…"
        placeholderTextColor={colors.textMuted}
        accessibilityLabel="Opis znaleziska"
        style={[input, styles.note]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  input: {
    ...typography.body,
    minHeight: layout.touchTarget,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  weight: { width: layout.thumbnail },
  place: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: layout.touchTarget,
    paddingHorizontal: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
  },
  placeText: { flex: 1 },
  note: { minHeight: spacing.xxl * NOTE_LINES, paddingTop: spacing.md, textAlignVertical: 'top' },
});
