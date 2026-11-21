import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { getDaylight, type Daylight } from './daylight';
import type { Coordinate } from './geo';

export function useDaylight(coordinate: Coordinate | null, active = true): Daylight {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!active) return;
    const refresh = setTimeout(() => setNow(new Date()), 0);
    const timer = setInterval(() => setNow(new Date()), 30_000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNow(new Date());
    });
    return () => {
      clearTimeout(refresh);
      clearInterval(timer);
      subscription.remove();
    };
  }, [active]);
  return coordinate
    ? getDaylight(coordinate, now)
    : { sunset: null, minutesLeft: null, state: 'unknown' };
}
