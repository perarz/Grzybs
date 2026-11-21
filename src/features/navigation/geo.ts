export type Coordinate = { latitude: number; longitude: number };
export type LocationFix = Coordinate & { accuracy: number | null; timestamp: number };
const EARTH_RADIUS_METERS = 6_371_008.8;
const radians = (degrees: number) => (degrees * Math.PI) / 180;

export function isCoordinate(value: Coordinate): boolean {
  return (
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude) &&
    Math.abs(value.latitude) <= 90 &&
    Math.abs(value.longitude) <= 180
  );
}

export function distanceMeters(from: Coordinate, to: Coordinate): number {
  if (!isCoordinate(from) || !isCoordinate(to)) return NaN;
  const latitude = radians(to.latitude - from.latitude);
  const longitude = radians(to.longitude - from.longitude);
  const a =
    Math.sin(latitude / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitude / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
}

export function bearingDegrees(from: Coordinate, to: Coordinate): number {
  if (!isCoordinate(from) || !isCoordinate(to)) return NaN;
  const longitude = radians(to.longitude - from.longitude);
  const y = Math.sin(longitude) * Math.cos(radians(to.latitude));
  const x =
    Math.cos(radians(from.latitude)) * Math.sin(radians(to.latitude)) -
    Math.sin(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.cos(longitude);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) return '—';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`;
}
