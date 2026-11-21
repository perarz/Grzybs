import type { Coordinate } from '@/features/navigation/geo';
import type { CarLocation, Spot } from '@/features/spots/storage';

export function getWeatherLocation(
  focus: Coordinate | null,
  current: Coordinate | null,
  car: CarLocation | null,
  spots: Spot[],
): { point: Coordinate | null; label: string } {
  const same = (left: Coordinate, right: Coordinate) =>
    left.latitude === right.latitude && left.longitude === right.longitude;
  if (focus) {
    if (current && same(focus, current)) return { point: focus, label: 'Twoja okolica' };
    if (car && same(focus, car)) return { point: focus, label: 'Okolica zapisanego auta' };
    const spot = spots.find((item) => same(focus, item));
    return { point: focus, label: spot ? `Okolica: ${spot.name}` : 'Wybrany punkt na mapie' };
  }
  if (current) return { point: current, label: 'Twoja okolica' };
  if (car) return { point: car, label: 'Okolica zapisanego auta' };
  if (spots[0]) return { point: spots[0], label: `Okolica: ${spots[0].name}` };
  return { point: null, label: 'Wybierz okolicę' };
}
