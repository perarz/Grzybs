import { palette } from './colors';

export const fieldMetrics = {
  compassSize: 104,
  coordinateDigits: 5,
  localDelta: 0.008,
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
  { elementType: 'geometry', stylers: [{ color: '#293532' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#294738' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#375744' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1C3E47' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#48564E' }] },
  { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#637268' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#929981' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#D2D8C8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#293532' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];
