import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
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
        <AppText variant="label" color="accent">
          Punkt powrotu
        </AppText>
        <View style={styles.savedLabel}>
          <MapIcon size={spacing.lg} color={colors.textMuted} />
          <AppText variant="label" color="textMuted">
            Auto
          </AppText>
        </View>
      </View>
      <View style={styles.row}>
        {bearing !== null ? <FieldCompass bearing={bearing} heading={heading} /> : null}
        <View style={styles.readout}>
          <AppText variant="title">
            {distance === null ? 'Zapisane' : formatDistance(distance)}
          </AppText>
          <AppText color="textMuted">{nearby ? 'W pobliżu' : 'W linii prostej'}</AppText>
        </View>
      </View>
      <AppText variant="caption" color="textMuted">
        {!position
          ? 'Włącz GPS, aby zobaczyć kierunek.'
          : nearby
            ? 'Auto jest blisko. Rozejrzyj się.'
            : heading === null
              ? 'Kierunek względem północy, nie trasa dojścia.'
              : 'Kierunek do auta, nie trasa dojścia.'}
      </AppText>
      <Button label="Pokaż na mapie" variant="secondary" onPress={onShow} />
      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ disabled: busy }}
        disabled={busy}
        onPress={onClear}
        style={styles.remove}
      >
        <AppText variant="caption" color="textMuted">
          Usuń zapis auta
        </AppText>
      </PressableScale>
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
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.touchTarget,
    paddingVertical: spacing.md,
  },
});
