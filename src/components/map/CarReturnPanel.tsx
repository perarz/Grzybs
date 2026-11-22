import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { CloseIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import { MapIcon } from '@/components/icons/TabIcons';
import {
  bearingDegrees,
  distanceMeters,
  formatDistance,
  type LocationFix,
} from '@/features/navigation/geo';
import type { CarLocation } from '@/features/spots/storage';
import { layout, radius, spacing, useTheme } from '@/theme';
import { fieldMetrics } from '@/theme/field';

import { FieldCompass } from './FieldCompass';

const CLOSE_ICON_SIZE = 22;

type Props = {
  car: CarLocation;
  position: LocationFix | null;
  heading: number | null;
  busy: boolean;
  onShow: () => void;
  onClear: () => void;
};

export function CarReturnPanel({ car, position, heading, busy, onShow, onClear }: Props) {
  const { colors } = useTheme();
  const distance = position ? distanceMeters(position, car) : null;
  const nearby =
    distance !== null && distance <= Math.max(position?.accuracy ?? 0, car.accuracy ?? 0, 20);
  const bearing = position && !nearby ? bearingDegrees(position, car) : null;
  return (
    <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <View style={styles.savedLabel}>
          <MapIcon size={spacing.lg} color={colors.glow} />
          <AppText variant="label" color="accent">
            Auto
          </AppText>
        </View>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Usuń zapis auta"
          accessibilityState={{ disabled: busy }}
          disabled={busy}
          onPress={onClear}
          style={styles.remove}
        >
          <CloseIcon size={CLOSE_ICON_SIZE} color={colors.textMuted} />
        </PressableScale>
      </View>
      <View style={styles.row}>
        {bearing !== null ? <FieldCompass bearing={bearing} heading={heading} /> : null}
        <View style={styles.readout}>
          <AppText variant="title">
            {distance === null ? 'Zapisane' : nearby ? 'Tuż obok' : formatDistance(distance)}
          </AppText>
          {!nearby && <AppText color="textMuted">W linii prostej</AppText>}
        </View>
      </View>
      {!position && (
        <AppText variant="caption" color="textMuted">
          Włącz GPS, aby zobaczyć kierunek.
        </AppText>
      )}
      <Button label="Pokaż na mapie" variant="secondary" onPress={onShow} />
    </View>
  );
}
const styles = StyleSheet.create({
  panel: {
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
  },
  topRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  savedLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.lg },
  readout: { flexGrow: 1, flexBasis: fieldMetrics.compassSize, gap: spacing.sm },
  remove: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.md,
  },
});
