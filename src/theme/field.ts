import { palette } from './colors';

export const fieldMetrics = {
  compassSize: 104,
  coordinateDigits: 5,
  // About 400 m across – close enough to see the paths around a spot or your position.
  localDelta: 0.004,
  carDelta: 0.002,
  mapWaitMs: 12000,
} as const;

export const fieldPanel = {
  background: palette.dark.sky,
  text: palette.dark.text,
  muted: palette.dark.textMuted,
  rule: palette.dark.border,
  accent: palette.dark.primary,
} as const;

// Keep woodland, developed land and water distinguishable below the markers.
export const fieldMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0F1311' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#14201A' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#182A20' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0C2A30' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2A322D' }] },
  { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#3B453F' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#56604F' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#B9C2B5' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F1311' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];
