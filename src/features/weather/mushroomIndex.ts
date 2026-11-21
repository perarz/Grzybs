import type { WeatherForecast } from './types';

// Field-guide heuristic. The weights are editorial, not fitted to fruiting observations.
export function mushroomIndex(
  forecast: WeatherForecast | null,
  now: number,
  inSeasonFraction: number,
) {
  const week = forecast?.history;
  if (!forecast || week?.length !== 7) return null;
  const today = new Date(now + forecast.utcOffsetSeconds * 1000).toISOString().slice(0, 10);
  if (forecast.days[0]?.date !== today) return null;
  let rain = 0,
    wetDays = 0,
    heat = 0;
  for (const day of week) {
    if (day.precipitation === null || day.minTemp === null || day.maxTemp === null) return null;
    rain += day.precipitation;
    if (day.precipitation >= 1) wetDays++;
    heat += (day.minTemp + day.maxTemp) / 2;
  }
  const mean = heat / week.length;
  const rainPoints = Math.min(4, rain / 5) + Math.min(2, wetDays / 2);
  const warmth = mean >= 8 && mean <= 19 ? 1 : mean > 0 && mean < 26 ? 0.5 : 0;
  const polishSeason = forecast.timezone === 'Europe/Warsaw';
  const temperaturePoints = warmth * (polishSeason ? 2 : 3);
  const seasonPoints = polishSeason ? Math.max(0, Math.min(1, inSeasonFraction)) : 0;
  const score = Math.min(
    mean <= 0 || rain < 1 ? 3 : 10,
    Math.round(1 + rainPoints + temperaturePoints + seasonPoints),
  );
  return { score, rain, mean, wetDays, polishSeason };
}
