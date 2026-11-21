import type { WeatherForecast, WeatherHour, WeatherPeriod } from './types';

const HOUR = 3600000;
function period(label: string, hour?: WeatherHour): WeatherPeriod {
  return {
    label,
    temperature: hour?.temperature ?? null,
    precipitation: hour?.precipitation ?? null,
    wind: hour?.wind ?? null,
  };
}

export function weatherPeriods(forecast: WeatherForecast, now = Date.now()): WeatherPeriod[] {
  const offset = forecast.utcOffsetSeconds * 1000;
  const hours = forecast.hours ?? [];
  function atHour(instant: number) {
    const slot = new Date(instant + offset).toISOString().slice(0, 13) + ':00';
    return hours.find((row) => row.time === slot);
  }
  // Provider timestamps keep the offset at fetch time. Use actual local civil time for
  // tomorrow's noon, including when the clocks change between the two days.
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: forecast.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  function localStamp(instant: number) {
    const parts = Object.fromEntries(
      formatter.formatToParts(instant).map(({ type, value }) => [type, value]),
    );
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  }
  const today = localStamp(now).slice(0, 10);
  const tomorrow = new Date(Date.parse(today) + 24 * HOUR).toISOString().slice(0, 10) + 'T12:00';
  const noon = hours.find(
    ({ time }) => localStamp(Date.parse(`${time}:00Z`) - offset) === tomorrow,
  );
  return [
    period('Teraz', atHour(now)),
    period('Za 2 h', atHour(now + 2 * HOUR)),
    period('Jutro 12:00', noon),
  ];
}
