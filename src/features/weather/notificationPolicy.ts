import type { WeatherForecast } from './types';

export const MUSHROOM_ALERT_MIN_SCORE = 7;
const MAX_FORECAST_AGE = 6 * 60 * 60 * 1000;
const MIN_DAYLIGHT_LEFT = 60 * 60 * 1000;

type AlertConditions = {
  forecast: WeatherForecast;
  score: number | null;
  now: number;
  sunrise: number | null;
  sunset: number | null;
  lastSentAt: number | null;
};

/** Checked at delivery time: no queued evening alerts or repeating daily reminders. */
export function shouldNotifyMushrooms({
  forecast,
  score,
  now,
  sunrise,
  sunset,
  lastSentAt,
}: AlertConditions): boolean {
  if (!Number.isFinite(now) || !Number.isFinite(forecast.fetchedAt)) return false;
  if (score === null || !Number.isFinite(score) || score < MUSHROOM_ALERT_MIN_SCORE || score > 10)
    return false;
  const age = now - forecast.fetchedAt;
  if (age < 0 || age > MAX_FORECAST_AGE) return false;
  if (sunrise === null || sunset === null || !Number.isFinite(sunrise) || !Number.isFinite(sunset))
    return false;
  if (now < sunrise || sunset - now <= MIN_DAYLIGHT_LEFT) return false;
  if (!Number.isFinite(forecast.utcOffsetSeconds)) return false;
  const local = new Date(now + forecast.utcOffsetSeconds * 1000);
  if (local.getUTCHours() < 8 || local.getUTCHours() >= 17) return false;
  const day = local.toISOString().slice(0, 10);
  if (forecast.days[0]?.date !== day) return false;
  if (lastSentAt !== null) {
    if (!Number.isFinite(lastSentAt) || lastSentAt > now) return false;
    const lastDay = new Date(lastSentAt + forecast.utcOffsetSeconds * 1000)
      .toISOString()
      .slice(0, 10);
    if (lastDay === day || now - lastSentAt < 20 * 60 * 60 * 1000) return false;
  }
  return true;
}
