import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Callout, Marker, type Region } from 'react-native-maps';
import { AppText } from '@/components/AppText';
import { durations, radius, spacing, useTheme } from '@/theme';
import { fieldMapStyle, fieldMetrics, fieldPanel } from '@/theme/field';
import type { FieldMapProps } from './FieldMap.types';
import { fieldMarkers } from './fieldMarkerImages';

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
}: FieldMapProps) {
  const { colors } = useTheme();
  const map = useRef<MapView>(null);
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
        onPress={onPick ? (event) => onPick(event.nativeEvent.coordinate) : undefined}
        onRegionChange={reportCenter}
        onRegionChangeComplete={reportCenter}
        showsMyLocationButton={false}
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
        {car ? (
          <Marker
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
