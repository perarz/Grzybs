import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { isCoordinate, type Coordinate } from '@/features/navigation/geo';

import {
  fetchForecast,
  getWeatherPoint,
  isForecastStale,
  readWeatherCache,
  weatherKey,
  writeWeatherCache,
  type WeatherForecast,
} from './weather';

type WeatherState = {
  key: string | null;
  forecast: WeatherForecast | null;
  refreshing: boolean;
  error: string | null;
  cacheWarning: string | null;
};
const EMPTY: WeatherState = {
  key: null,
  forecast: null,
  refreshing: false,
  error: null,
  cacheWarning: null,
};

export function useWeatherForecast(point: Coordinate | null, automatic = true) {
  const db = useSQLiteContext();
  const coarse = point && isCoordinate(point) ? getWeatherPoint(point) : null;
  const latitude = coarse?.latitude;
  const longitude = coarse?.longitude;
  const target = useMemo(() => {
    if (latitude === undefined || longitude === undefined || !isCoordinate({ latitude, longitude }))
      return null;
    return { latitude, longitude };
  }, [latitude, longitude]);
  const key = target ? weatherKey(target) : null;
  const [state, setState] = useState<WeatherState>(EMPTY);
  const [now, setNow] = useState(() => Date.now());
  const generation = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const loadingCache = key !== null && state.key !== key;

  useEffect(() => {
    const current = ++generation.current;
    let active = true;
    controller.current?.abort();
    controller.current = null;
    if (target && key) {
      readWeatherCache(db, target)
        .then((forecast) => {
          if (active && generation.current === current) {
            setState({ ...EMPTY, key, forecast });
            setNow(Date.now());
          }
        })
        .catch(() => {
          if (active && generation.current === current)
            setState({ ...EMPTY, key, cacheWarning: 'Nie udało się odczytać zapisanej prognozy.' });
        });
    }
    return () => {
      active = false;
      controller.current?.abort();
      controller.current = null;
    };
  }, [db, key, target]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') setNow(Date.now());
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!target || !key || loadingCache || controller.current) return;
    const current = ++generation.current;
    const request = new AbortController();
    controller.current = request;
    setState((previous) => ({
      ...EMPTY,
      key,
      forecast: previous.key === key ? previous.forecast : null,
      refreshing: true,
    }));
    const valid = () => generation.current === current && !request.signal.aborted;
    try {
      const forecast = await fetchForecast(target, request.signal);
      if (!valid()) return;
      setNow(Date.now());
      setState({ ...EMPTY, key, forecast, refreshing: true });
      try {
        await writeWeatherCache(db, forecast);
      } catch {
        if (valid())
          setState((previous) => ({
            ...previous,
            cacheWarning: 'Prognoza pobrana, ale zapis offline się nie udał.',
          }));
      }
    } catch {
      if (valid())
        setState((previous) => ({
          ...previous,
          error: 'Nie udało się pobrać prognozy. Sprawdź połączenie i spróbuj ponownie.',
        }));
    } finally {
      if (valid()) setState((previous) => ({ ...previous, refreshing: false }));
      if (controller.current === request) controller.current = null;
    }
  }, [db, target, key, loadingCache]);

  const visible = state.key === key ? state : EMPTY;
  const stale = visible.forecast ? isForecastStale(visible.forecast, now) : false;
  const attempt = useRef<string | null>(null);
  useEffect(() => {
    if (!automatic || !key || loadingCache || (visible.forecast?.history && !stale)) {
      attempt.current = null;
      return;
    }
    if (attempt.current !== key) {
      attempt.current = key;
      void refresh();
    }
  }, [automatic, key, loadingCache, visible.forecast, stale, refresh]);
  return {
    now,
    forecast: visible.forecast,
    loadingCache,
    refreshing: visible.refreshing,
    error: visible.error,
    cacheWarning: visible.cacheWarning,
    stale,
    refresh,
  };
}
