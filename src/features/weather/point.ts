import type { WeatherPoint } from './types';

export function getWeatherPoint(point: WeatherPoint): WeatherPoint {
  if (
    !Number.isFinite(point.latitude) ||
    !Number.isFinite(point.longitude) ||
    Math.abs(point.latitude) > 90 ||
    Math.abs(point.longitude) > 180
  ) {
    throw new Error('Nieprawidłowa lokalizacja prognozy.');
  }
  // Round before both network transmission and cache lookup. Never retain the precise fix.
  return {
    latitude: Number(point.latitude.toFixed(2)),
    longitude: Number(point.longitude.toFixed(2)),
  };
}
export function weatherKey(point: WeatherPoint): string {
  const rounded = getWeatherPoint(point);
  return `${rounded.latitude.toFixed(2)},${rounded.longitude.toFixed(2)}`;
}
