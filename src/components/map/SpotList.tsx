import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import type { Spot } from '@/features/spots/storage';
import { durations, layout, radius, spacing, useTheme } from '@/theme';

type Props = {
  spots: Spot[];
  busy: boolean;
  onShow: (spot: Spot) => void;
  onAdd: () => void;
  onEdit: (spot: Spot) => void;
  onDelete: (spot: Spot) => void;
};

export function SpotList({ spots, busy, onShow, onAdd, onEdit, onDelete }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.list}>
      <View style={styles.heading}>
        <AppText variant="title" style={styles.text}>
          Miejscówki
        </AppText>
        {spots.length > 0 && (
          <AppText variant="label" color="accent">
            {spots.length}
          </AppText>
        )}
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Dodaj miejscówkę"
          disabled={busy}
          onPress={onAdd}
          style={[styles.add, { backgroundColor: colors.glow }]}
        >
          <FieldIcon name="plus" size={layout.icon} color={colors.onGlow} />
        </PressableScale>
      </View>
      {spots.map((spot, index) => (
        <Animated.View
          key={spot.id}
          entering={FadeInDown.duration(durations.base)}
          exiting={FadeOut.duration(durations.fast)}
          layout={LinearTransition.duration(durations.base)}
          style={[styles.entry, { borderColor: colors.border }]}
        >
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={`Pokaż na mapie: ${spot.name}`}
            onPress={() => onShow(spot)}
            style={styles.heading}
          >
            <AppText variant="label" color="accent">
              {String(index + 1).padStart(2, '0')}
            </AppText>
            <View style={styles.text}>
              <AppText variant="heading">{spot.name}</AppText>
            </View>
            <AppText color="accent">↗</AppText>
          </PressableScale>
          {spot.note ? <AppText color="textMuted">{spot.note}</AppText> : null}
          <View style={styles.actions}>
            <PressableScale
              accessibilityRole="button"
              disabled={busy}
              onPress={() => onEdit(spot)}
              style={styles.action}
            >
              <AppText variant="button" color="accent">
                Edytuj
              </AppText>
            </PressableScale>
            <PressableScale
              accessibilityRole="button"
              disabled={busy}
              onPress={() => onDelete(spot)}
              style={styles.action}
            >
              <AppText variant="button" color="textMuted">
                Usuń
              </AppText>
            </PressableScale>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  list: { gap: spacing.lg },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  text: { flex: 1, gap: spacing.sm },
  entry: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.lg, gap: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.xl },
  action: { paddingVertical: spacing.md },
  add: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
