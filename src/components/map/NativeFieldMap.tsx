import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Callout, Marker, type MapMarker, type Region } from 'react-native-maps';
import { AppText } from '@/components/AppText';
import { durations, layout, radius, spacing, useTheme } from '@/theme';
import { fieldMapStyle, fieldMetrics, fieldPanel } from '@/theme/field';
import type { FieldMapProps } from './FieldMap.types';
import { fieldMarkers } from './fieldMarkerImages';

const FIND_Z_INDEX = 4;
const ADD_BUTTON_ZONE = spacing.lg + layout.touchTarget + spacing.sm;
export function NativeFieldMap({
  spots,
  car,
  position,
  focus,
  focusDelta = fieldMetrics.localDelta,
  onPick,
  onLongPress,
  onSpot,
  onCenteredChange,
  finds = [],
  onFind,
}: FieldMapProps) {
  const { colors } = useTheme();
  const map = useRef<MapView>(null);
  const gpsMarker = useRef<MapMarker>(null);
  const carMarker = useRef<MapMarker>(null);
  const [ready, setReady] = useState(false);
  const centeredGps = useRef(false);
  const lastFocus = useRef(focus);
  const [slow, setSlow] = useState(false);
  const visibleRegion = useRef<Region | null>(null);
  const center = focus ?? position ?? car ?? spots[0];
  function reportCenter(region: Region) {
    visibleRegion.current = region;
    onCenteredChange?.(
      Boolean(
        position &&
        Math.abs(region.latitude - position.latitude) <
          Math.min(region.latitudeDelta * 0.015, 0.0003) &&
        Math.abs(region.longitude - position.longitude) <
          Math.min(region.longitudeDelta * 0.015, 0.0003),
      ),
    );
  }
  useEffect(() => {
    const region = visibleRegion.current;
    onCenteredChange?.(
      Boolean(
        ready &&
        region &&
        position &&
        Math.abs(region.latitude - position.latitude) <
          Math.min(region.latitudeDelta * 0.015, 0.0003) &&
        Math.abs(region.longitude - position.longitude) <
          Math.min(region.longitudeDelta * 0.015, 0.0003),
      ),
    );
  }, [position, ready, onCenteredChange]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSlow(true);
    }, fieldMetrics.mapWaitMs);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const chosen = focus && lastFocus.current !== focus;
    const target = chosen ? focus : !focus && !centeredGps.current ? position : null;
    lastFocus.current = focus;
    if (!target) return;
    map.current?.animateToRegion(
      {
        ...target,
        latitudeDelta: chosen ? focusDelta : fieldMetrics.localDelta,
        longitudeDelta: chosen ? focusDelta : fieldMetrics.localDelta,
      },
      durations.slow,
    );
    centeredGps.current = true;
  }, [focus, focusDelta, position, ready]);
  return (
    <View style={styles.frame}>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        userInterfaceStyle="dark"
        customMapStyle={fieldMapStyle}
        initialRegion={
          center
            ? {
                ...center,
                latitudeDelta: fieldMetrics.localDelta,
                longitudeDelta: fieldMetrics.localDelta,
              }
            : { latitude: 52, longitude: 19, latitudeDelta: 6, longitudeDelta: 6 }
        }
        onMapReady={() => {
          setReady(true);
        }}
        onLongPress={(event) => onLongPress(event.nativeEvent.coordinate)}
        onPress={(event) => {
          // A tap anywhere else closes the "Twoja pozycja" / "Twoje auto" label.
          gpsMarker.current?.hideCallout();
          carMarker.current?.hideCallout();
          onPick?.(event.nativeEvent.coordinate);
        }}
        onRegionChange={reportCenter}
        onRegionChangeComplete={reportCenter}
        showsMyLocationButton={false}
        // Google's logo must stay visible; this moves it right of the add button in the corner.
        mapPadding={{ top: 0, right: 0, bottom: 0, left: ADD_BUTTON_ZONE }}
        toolbarEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {spots.map((spot) => (
          <Marker
            key={`spot-icon-${spot.id}`}
            coordinate={spot}
            title={spot.name}
            description={spot.note ?? 'Twoja miejscówka'}
            pinColor={colors.season}
            {...fieldMarkers.spot}
            onCalloutPress={() => onSpot(spot)}
          />
        ))}
        {finds.map((find) =>
          find.latitude !== null && find.longitude !== null ? (
            <Marker
              key={`find-${find.id}`}
              coordinate={{ latitude: find.latitude, longitude: find.longitude }}
              pinColor={colors.poisonous}
              tracksViewChanges={false}
              // Above the GPS dot: a find saved where you stand must still be tappable.
              zIndex={FIND_Z_INDEX}
              onPress={() => onFind?.(find)}
            />
          ) : null,
        )}
        {car ? (
          <Marker
            ref={carMarker}
            key="car-icon"
            coordinate={car}
            title="Twoje auto"
            pinColor={colors.glow}
            {...fieldMarkers.car}
          >
            <Callout tooltip>
              <View style={styles.markerTooltip}>
                <View style={[styles.markerLabel, { borderColor: colors.glow }]}>
                  <AppText variant="heading" style={{ color: fieldPanel.text }}>
                    Twoje auto
                  </AppText>
                </View>
                <View style={styles.markerPointer} />
              </View>
            </Callout>
          </Marker>
        ) : null}
        {position ? (
          <Marker
            ref={gpsMarker}
            key="gps-dot"
            coordinate={position}
            title="Twoja pozycja GPS"
            pinColor={colors.text}
            {...fieldMarkers.gps}
          >
            <Callout tooltip>
              <View style={styles.markerTooltip}>
                <View style={[styles.markerLabel, { borderColor: colors.primary }]}>
                  <AppText variant="heading" style={{ color: fieldPanel.text }}>
                    Twoja pozycja
                  </AppText>
                </View>
                <View style={styles.markerPointer} />
              </View>
            </Callout>
          </Marker>
        ) : null}
      </MapView>
      {slow && !ready ? (
        <View style={[styles.fallback, { backgroundColor: colors.background }]}>
          <AppText variant="caption">Mapa jeszcze się nie wczytała.</AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  markerTooltip: { alignItems: 'center', paddingBottom: spacing.xs },
  markerLabel: {
    backgroundColor: fieldPanel.background,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minWidth: 128,
    alignItems: 'center',
  },
  markerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: spacing.sm,
    borderRightWidth: spacing.sm,
    borderTopWidth: spacing.sm,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: fieldPanel.background,
  },
  content: { gap: spacing.sm },
  frame: { flex: 1, overflow: 'hidden' },
  label: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    padding: spacing.sm,
  },
  fallback: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    padding: spacing.md,
  },
});
