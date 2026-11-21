import type { WeatherHour } from './types';

const invalid = () => new Error('Brak prawidłowych danych godzinowych prognozy.');
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid();
  return value as Record<string, unknown>;
}
function series(value: unknown, length = 72): unknown[] {
  if (!Array.isArray(value) || value.length !== length) throw invalid();
  return value;
}
function metric(value: unknown, minimum = -Infinity): number | null {
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum) throw invalid();
  return value;
}
export function readProviderHours(data: unknown, units: unknown, length = 72) {
  const table = record(data);
  const unit = record(units);
  if (
    unit.time !== 'iso8601' ||
    unit.temperature_2m !== '°C' ||
    unit.precipitation !== 'mm' ||
    unit.wind_speed_10m !== 'km/h'
  )
    throw invalid();
  const temperatures = series(table.temperature_2m, length);
  const rain = series(table.precipitation, length);
  const winds = series(table.wind_speed_10m, length);
  return series(table.time, length).map((time, i) => ({
    time,
    temperature: temperatures[i],
    precipitation: rain[i],
    wind: winds[i],
  }));
}
export function parseHourSeries(data: unknown, firstDate: string): WeatherHour[] {
  const start = Date.parse(`${firstDate}T00:00:00Z`);
  return series(data).map((item, index) => {
    const row = record(item);
    // Open-Meteo supplies ISO local times with a single UTC offset for the whole response.
    const expectedTime = new Date(start + index * 3600000).toISOString().slice(0, 16);
    if (row.time !== expectedTime) throw invalid();
    return {
      time: expectedTime,
      temperature: metric(row.temperature),
      precipitation: metric(row.precipitation, 0),
      wind: metric(row.wind, 0),
    };
  });
}
