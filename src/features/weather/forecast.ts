import { getWeatherPoint } from './point';
import type { WeatherForecast, WeatherPoint } from './types';
import { parseResponse, WEATHER_FIELDS } from './validation';

export { getWeatherPoint, weatherKey } from './point';
export type { WeatherDay, WeatherForecast, WeatherPoint } from './types';
const CACHE_TTL = 6 * 60 * 60 * 1000;

export function isForecastStale(forecast: WeatherForecast, now = Date.now()): boolean {
  if (!forecast.hours?.length) return true;
  const age = now - forecast.fetchedAt;
  if (!Number.isFinite(age) || age < 0 || age >= CACHE_TTL) return true;
  const providerToday = new Date(now + forecast.utcOffsetSeconds * 1000).toISOString().slice(0, 10);
  return forecast.days[0]?.date !== providerToday;
}
function requestError(name: string, message: string) {
  const error = new Error(message);
  error.name = name;
  return error;
}
export async function fetchForecast(
  point: WeatherPoint,
  signal?: AbortSignal,
): Promise<WeatherForecast> {
  const rounded = getWeatherPoint(point);
  if (signal?.aborted) throw requestError('AbortError', 'Pobieranie prognozy anulowano.');
  const parameters = new URLSearchParams({
    latitude: String(rounded.latitude),
    longitude: String(rounded.longitude),
    daily: Object.values(WEATHER_FIELDS).join(','),
    hourly: 'temperature_2m,precipitation,wind_speed_10m',
    timezone: 'auto',
    forecast_days: '3',
    past_days: '7',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
  });
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let cancel = () => {};
  const interrupted = new Promise<never>((_, reject) => {
    cancel = () => {
      reject(requestError('AbortError', 'Pobieranie prognozy anulowano.'));
      controller.abort();
    };
    signal?.addEventListener('abort', cancel, { once: true });
    timeout = setTimeout(() => {
      reject(
        requestError('TimeoutError', 'Pobieranie prognozy trwa zbyt długo. Spróbuj ponownie.'),
      );
      controller.abort();
    }, 12000);
  });
  async function download() {
    let response: Response;
    try {
      response = await fetch(`https://api.open-meteo.com/v1/forecast?${parameters}`, {
        signal: controller.signal,
      });
    } catch {
      throw new Error('Nie udało się pobrać pogody. Sprawdź połączenie z internetem.');
    }
    if (!response.ok)
      throw new Error(`Serwis pogody jest niedostępny (HTTP ${response.status}). Spróbuj później.`);
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new Error('Nie udało się odczytać odpowiedzi serwisu pogody.');
    }
    return parseResponse(payload, rounded, Date.now());
  }
  try {
    return await Promise.race([download(), interrupted]);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}
