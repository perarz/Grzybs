import { useIsFocused } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/Button';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { PressableScale } from '@/components/PressableScale';
import { DaylightStrip } from '@/components/map/DaylightStrip';
import { FieldMap } from '@/components/map/FieldMap';
import { ParkingDialog } from '@/components/map/ParkingDialog';
import { MapActions } from '@/components/map/MapActions';
import { WeatherSection } from '@/components/weather/WeatherSection';
import { getWeatherLocation } from '@/features/weather/location';
import { SpotEditorSheet } from '@/components/map/SpotEditorSheet';
import { SavedPlacesSheet } from '@/components/map/SavedPlacesSheet';
import { isFreshFix } from '@/features/spots/useSpotEditor';
import { useMapNotebook } from '@/features/spots/useMapNotebook';
import type { Coordinate } from '@/features/spots/storage';
import { layout, radius, spacing, useTheme } from '@/theme';

import { fieldMetrics, fieldPanel as ink } from '@/theme/field';

export default function MapScreen() {
  const active = useIsFocused();
  return active ? <MapNotebookScreen /> : null;
}
function MapNotebookScreen() {
  const n = useMapNotebook(true);
  const { field, location, freshPosition, daylight } = n;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [focusDelta, setFocusDelta] = useState<number>(fieldMetrics.localDelta);
  const [centered, setCentered] = useState(false);
  const [places, setPlaces] = useState(false);
  const [picking, setPicking] = useState(false);
  const gps = location.status === 'tracking' ? location.position : null;
  const weather = getWeatherLocation(n.focus, gps, field.car, field.spots);
  function show(point: Coordinate, delta: number = fieldMetrics.localDelta) {
    setFocusDelta(delta);
    setPlaces(false);
    n.setFocus({ ...point });
  }
  function pick(point: Coordinate) {
    setPicking(false);
    n.setDraft({ point });
  }
  const error = field.error || n.error || location.error;
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FieldMap
        spots={field.spots}
        car={field.car}
        position={gps}
        focus={n.focus}
        focusDelta={focusDelta}
        onCenteredChange={setCentered}
        onLongPress={pick}
        onPick={picking ? pick : undefined}
        onSpot={(spot) => n.setDraft({ point: spot, spot })}
      />
      <View pointerEvents="box-none" style={[styles.top, { top: insets.top + spacing.sm }]}>
        <WeatherSection point={weather.point} locationLabel={weather.label} />
        <DaylightStrip
          daylight={daylight}
          active
          hasLocation={Boolean(location.position ?? field.car)}
          compact
        />
        {picking && (
          <Button label="Wskaż punkt na mapie · Anuluj" onPress={() => setPicking(false)} />
        )}
        {error && (
          <View style={[styles.notice, { backgroundColor: colors.surface }]}>
            <AppText variant="caption" accessibilityRole="alert">
              {error}
            </AppText>
            {field.error && <Button label="Ponów odczyt" onPress={() => void field.refresh()} />}
          </View>
        )}
      </View>
      <MapActions
        busy={n.busy || field.loading}
        canPark={Boolean(freshPosition)}
        onOpen={() => {
          if (!isFreshFix(gps) && location.status === 'tracking') void location.start();
        }}
        onAdd={() => (isFreshFix(gps) ? n.addHere() : setPicking(true))}
        onPark={n.park}
      />
      <View style={[styles.controls, { backgroundColor: ink.background, borderColor: ink.rule }]}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Zapisane miejsca i auto"
          onPress={() => setPlaces(true)}
          style={[
            styles.gps,
            { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: ink.rule },
          ]}
        >
          <FieldIcon name="places" size={layout.icon} color={ink.text} />
        </PressableScale>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={
            gps ? (centered ? 'Mapa wyśrodkowana na Tobie' : 'Moja pozycja') : 'Włącz GPS'
          }
          accessibilityState={{
            selected: Boolean(gps && centered),
            disabled: location.status === 'requesting',
          }}
          disabled={location.status === 'requesting'}
          onPress={() => (gps ? show(gps) : void location.start())}
          style={styles.gps}
        >
          <FieldIcon name="locate" size={22} color={gps && centered ? colors.glow : ink.accent} />
        </PressableScale>
      </View>
      {n.parkingOpen && (
        <ParkingDialog
          replacing={Boolean(field.car)}
          busy={n.busy}
          canSave={Boolean(freshPosition)}
          error={n.error}
          onClose={() => n.setParkingOpen(false)}
          onSave={() => void n.confirmParking()}
        />
      )}
      {places && (
        <SavedPlacesSheet
          car={field.car}
          spots={field.spots}
          position={freshPosition}
          heading={location.heading}
          busy={n.busy}
          onClose={() => setPlaces(false)}
          onShow={show}
          onShowCar={() => field.car && show(field.car, fieldMetrics.carDelta)}
          onAdd={() => {
            setPlaces(false);
            if (isFreshFix(gps)) n.addHere();
            else setPicking(true);
          }}
          onEdit={(spot) => {
            setPlaces(false);
            n.setDraft({ point: spot, spot });
          }}
          onDelete={n.remove}
          onClearCar={n.clearCar}
        />
      )}
      {n.removal && (
        <ConfirmDialog
          title={n.removal === 'car' ? 'Usunąć zapis auta?' : 'Usunąć miejscówkę?'}
          message={
            n.removal === 'car'
              ? 'Pozycja parkowania zniknie z mapy.'
              : `„${n.removal.name}” zniknie z mapy.`
          }
          cancelLabel="Zostaw"
          confirmLabel="Usuń"
          icon={n.removal === 'car' ? 'car' : 'pin'}
          onCancel={n.cancelRemoval}
          onConfirm={n.confirmRemoval}
        />
      )}
      {n.draft && (
        <SpotEditorSheet
          draft={n.draft}
          saveSpot={field.saveSpot}
          onClose={() => n.setDraft(null)}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  top: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  notice: { padding: spacing.sm, borderRadius: radius.sm },
  controls: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  gps: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
