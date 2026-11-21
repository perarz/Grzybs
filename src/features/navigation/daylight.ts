import { getPosition, getTimes } from 'suncalc';

import { isCoordinate, type Coordinate } from './geo';

export type Daylight = {
  sunset: Date | null;
  minutesLeft: number | null;
  state: 'day' | 'soon' | 'night' | 'unknown';
};
const UNKNOWN: Daylight = { sunset: null, minutesLeft: null, state: 'unknown' };

export function getDaylight(coordinate: Coordinate, date = new Date()): Daylight {
  if (!isCoordinate(coordinate) || !Number.isFinite(date.getTime())) return { ...UNKNOWN };
  try {
    // SunCalc 2 uses the supplied civil-day UTC offset; no altitude measurement is required.
    const times = getTimes(
      date,
      coordinate.latitude,
      coordinate.longitude,
      0,
      -date.getTimezoneOffset(),
    );
    const sunset = times.sunset && Number.isFinite(times.sunset.getTime()) ? times.sunset : null;
    if (times.alwaysUp) return { sunset: null, minutesLeft: null, state: 'day' };
    if (times.alwaysDown) return { sunset: null, minutesLeft: null, state: 'night' };
    if (!sunset) return { ...UNKNOWN };
    const sunrise = times.sunrise;
    const now = date.getTime();
    const afterSunset = now >= sunset.getTime();
    const beforeSunrise = sunrise && Number.isFinite(sunrise.getTime()) && now < sunrise.getTime();
    // Near a polar transition only one rise/set can exist in the civil day.
    const belowHorizon =
      !sunrise && getPosition(date, coordinate.latitude, coordinate.longitude).altitude < 0;
    if (afterSunset || beforeSunrise || belowHorizon)
      return { sunset, minutesLeft: 0, state: 'night' };
    const minutesLeft = Math.max(0, Math.ceil((sunset.getTime() - now) / 60_000));
    return { sunset, minutesLeft, state: minutesLeft <= 60 ? 'soon' : 'day' };
  } catch {
    return { ...UNKNOWN };
  }
}
