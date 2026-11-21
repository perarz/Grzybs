import { parseHourSeries, readProviderHours } from './hourly';
import { getWeatherPoint } from './point';
import type { WeatherDay, WeatherForecast, WeatherPoint } from './types';

export const WEATHER_FIELDS = {
  minTemp: 'temperature_2m_min',
  maxTemp: 'temperature_2m_max',
  precipitation: 'precipitation_sum',
  rainChance: 'precipitation_probability_max',
  wind: 'wind_speed_10m_max',
  code: 'weather_code',
} as const;
const UNITS = {
  minTemp: '°C',
  maxTemp: '°C',
  precipitation: 'mm',
  rainChance: '%',
  wind: 'km/h',
  code: 'wmo code',
};
const invalid = () => new Error('Serwis pogody zwrócił niekompletne lub nieprawidłowe dane.');
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid();
  return value as Record<string, unknown>;
}
function number(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw invalid();
  return value;
}
function date(value: unknown): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw invalid();
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value)
    throw invalid();
  return value;
}
function parseDay(value: unknown): WeatherDay {
  const input = object(value);
  const metric = (key: keyof typeof WEATHER_FIELDS) =>
    input[key] === null ? null : number(input[key]);
  const day = {
    date: date(input.date),
    minTemp: metric('minTemp'),
    maxTemp: metric('maxTemp'),
    precipitation: metric('precipitation'),
    rainChance: metric('rainChance'),
    wind: metric('wind'),
    code: metric('code'),
  };
  if (
    (day.minTemp !== null && day.maxTemp !== null && day.minTemp > day.maxTemp) ||
    (day.precipitation !== null && day.precipitation < 0) ||
    (day.wind !== null && day.wind < 0) ||
    (day.rainChance !== null && (day.rainChance < 0 || day.rainChance > 100)) ||
    (day.code !== null && (!Number.isInteger(day.code) || day.code < 0 || day.code > 99))
  )
    throw invalid();
  return day;
}
export function parseForecast(value: unknown): WeatherForecast {
  const input = object(value);
  const inputPoint = object(input.point);
  const point = getWeatherPoint({
    latitude: number(inputPoint.latitude),
    longitude: number(inputPoint.longitude),
  });
  if (point.latitude !== inputPoint.latitude || point.longitude !== inputPoint.longitude)
    throw invalid();
  if (typeof input.timezone !== 'string' || !input.timezone.trim()) throw invalid();
  try {
    new Intl.DateTimeFormat('en', { timeZone: input.timezone }).format(0);
  } catch {
    throw invalid();
  }
  const utcOffsetSeconds = number(input.utcOffsetSeconds);
  const fetchedAt = number(input.fetchedAt);
  if (
    !Number.isInteger(utcOffsetSeconds) ||
    utcOffsetSeconds < -43200 ||
    utcOffsetSeconds > 50400 ||
    fetchedAt <= 0
  )
    throw invalid();
  if (!Array.isArray(input.days) || input.days.length !== 3) throw invalid();
  const days = input.days.map(parseDay);
  for (let i = 1; i < days.length; i++) {
    if (Date.parse(days[i].date) - Date.parse(days[i - 1].date) !== 86400000) throw invalid();
  }
  let history: WeatherDay[] | undefined;
  if (input.history !== undefined) {
    if (!Array.isArray(input.history) || input.history.length !== 7) throw invalid();
    history = input.history.map(parseDay);
    if (
      history.some(
        (day, i) => Date.parse(days[0].date) - Date.parse(day.date) !== (7 - i) * 86400000,
      )
    )
      throw invalid();
  }
  const forecast = {
    ...(history ? { history } : {}),
    point,
    timezone: input.timezone,
    utcOffsetSeconds,
    fetchedAt,
    days,
  };
  // Existing daily-only cache entries stay readable until an hourly refresh succeeds.
  return input.hours === undefined
    ? forecast
    : { ...forecast, hours: parseHourSeries(input.hours, days[0].date) };
}
export function parseResponse(
  value: unknown,
  point: WeatherPoint,
  fetchedAt: number,
): WeatherForecast {
  const input = object(value);
  const daily = object(input.daily);
  const units = object(input.daily_units);
  const count = Array.isArray(daily.time) ? daily.time.length : 0;
  if (units.time !== 'iso8601' || !Array.isArray(daily.time) || (count !== 3 && count !== 10))
    throw invalid();
  const fields = Object.entries(WEATHER_FIELDS);
  for (const [key, field] of fields) {
    if (
      units[field] !== UNITS[key as keyof typeof UNITS] ||
      !Array.isArray(daily[field]) ||
      daily[field].length !== count
    )
      throw invalid();
  }
  const days = daily.time.map((date, i) =>
    Object.fromEntries([
      ['date', date],
      ...fields.map(([key, field]) => [key, (daily[field] as unknown[])[i]]),
    ]),
  );
  return parseForecast({
    point: getWeatherPoint(point),
    timezone: input.timezone,
    utcOffsetSeconds: input.utc_offset_seconds,
    fetchedAt,
    days: days.slice(-3),
    history: count === 10 ? days.slice(0, 7) : undefined,
    hours: readProviderHours(input.hourly, input.hourly_units, count * 24).slice(-72),
  });
}
