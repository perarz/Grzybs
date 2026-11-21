import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import type { Spot } from '@/features/spots/storage';
import { durations, spacing, useTheme } from '@/theme';

type Props = {
  spots: Spot[];
  busy: boolean;
  onShow: (spot: Spot) => void;
  onEdit: (spot: Spot) => void;
  onDelete: (spot: Spot) => void;
};

export function SpotList({ spots, busy, onShow, onEdit, onDelete }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.list}>
      <View style={styles.heading}>
        <AppText variant="title">Miejscówki</AppText>
        <AppText variant="label" color="accent">
          {spots.length}
        </AppText>
      </View>
      {!spots.length ? (
        <AppText variant="caption" color="textMuted">
          Brak zapisanych miejscówek.
        </AppText>
      ) : null}
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
  empty: { borderLeftWidth: spacing.xs, paddingLeft: spacing.lg, gap: spacing.sm },
});
