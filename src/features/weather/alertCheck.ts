import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getTimes } from 'suncalc';
import { SPECIES } from '@/data/species';
import type { Month } from '@/features/atlas/types';
import { ALERT_CHANNEL, ALERT_TASK } from './alertConstants';
import { database, readAlertSettings } from './alertSettings';
import { fetchForecast } from './forecast';
import { mushroomIndex } from './mushroomIndex';
import { shouldNotifyMushrooms } from './notificationPolicy';
import type { WeatherForecast } from './types';

const MAX_LOCATION_AGE = 7 * 86400000;

let running = false;
export async function checkMushroomAlert(provided?: WeatherForecast) {
  if (running) return;
  running = true;
  try {
    const db = await database();
    const settings = await readAlertSettings();
    if (
      !settings?.enabled ||
      settings.latitude === null ||
      settings.longitude === null ||
      !settings.location_updated_at
    )
      return;
    if (Date.now() - settings.location_updated_at > MAX_LOCATION_AGE) return;
    if (!(await Notifications.getPermissionsAsync()).granted) return;
    const point = { latitude: settings.latitude, longitude: settings.longitude };
    const forecast =
      provided &&
      provided.point.latitude === point.latitude &&
      provided.point.longitude === point.longitude
        ? provided
        : await fetchForecast(point);
    const now = Date.now();
    const month = Number(forecast.days[0]?.date.slice(5, 7)) as Month;
    const fraction = SPECIES.filter((s) => s.months.includes(month)).length / SPECIES.length;
    const score = mushroomIndex(forecast, now, fraction)?.score ?? null;
    const sun = getTimes(
      new Date(now),
      point.latitude,
      point.longitude,
      0,
      forecast.utcOffsetSeconds / 60,
    );
    const conditions = {
      forecast,
      score,
      now,
      sunrise: sun.sunrise?.getTime() ?? null,
      sunset: sun.sunset?.getTime() ?? null,
      lastSentAt: settings.last_sent_at,
    };
    if (!shouldNotifyMushrooms(conditions)) return;
    // Reserve atomically across foreground/background instances; recheck opt-out and location.
    const claim = await db.runAsync(
      'UPDATE mushroom_alerts SET last_sent_at = ? WHERE id = 1 AND enabled = 1 AND latitude = ? AND longitude = ? AND last_sent_at IS ?',
      now,
      point.latitude,
      point.longitude,
      settings.last_sent_at,
    );
    if (claim.changes !== 1) return;
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: ALERT_TASK,
        content: {
          title: 'Dobry moment na grzyby 🍄',
          body: `Warunki ${score}/10 w ostatnio wybranej okolicy. Może warto zajrzeć do lasu?`,
          data: { screen: 'map' },
        },
        trigger: Platform.OS === 'android' ? { channelId: ALERT_CHANNEL } : null,
      });
    } catch (error) {
      await db.runAsync(
        'UPDATE mushroom_alerts SET last_sent_at = ? WHERE id = 1 AND last_sent_at = ?',
        settings.last_sent_at,
        now,
      );
      throw error;
    }
  } finally {
    running = false;
  }
}
