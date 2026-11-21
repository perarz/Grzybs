import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { openDatabaseAsync } from 'expo-sqlite';
import { getTimes } from 'suncalc';
import { DATABASE_NAME, initDatabase } from '@/db/initDatabase';
import { SPECIES } from '@/data/species';
import { isCoordinate } from '@/features/navigation/geo';
import type { Month } from '@/features/atlas/types';
import { fetchForecast, getWeatherPoint } from './forecast';
import { mushroomIndex } from './mushroomIndex';
import { shouldNotifyMushrooms } from './notificationPolicy';
import type { WeatherForecast, WeatherPoint } from './types';

const TASK = 'grzybnik-mushroom-conditions';
const CHANNEL = 'mushroom-conditions';
const MAX_LOCATION_AGE = 7 * 86400000;
export type AlertSettings = {
  enabled: number;
  latitude: number | null;
  longitude: number | null;
  location_updated_at: number | null;
  last_sent_at: number | null;
};
async function database() {
  const db = await openDatabaseAsync(DATABASE_NAME);
  await initDatabase(db);
  return db;
}
export async function readAlertSettings() {
  return (await database()).getFirstAsync<AlertSettings>(
    'SELECT * FROM mushroom_alerts WHERE id = 1',
  );
}
export async function updateAlertLocation(point: WeatherPoint) {
  const rounded = getWeatherPoint(point);
  if (!isCoordinate(rounded)) return;
  await (
    await database()
  ).runAsync(
    'UPDATE mushroom_alerts SET latitude = ?, longitude = ?, location_updated_at = ? WHERE id = 1 AND enabled = 1',
    rounded.latitude,
    rounded.longitude,
    Date.now(),
  );
}
export async function setMushroomAlerts(enabled: boolean, point: WeatherPoint | null) {
  const db = await database();
  if (!enabled) {
    await db.runAsync('UPDATE mushroom_alerts SET enabled = 0 WHERE id = 1');
    if (await TaskManager.isTaskRegisteredAsync(TASK))
      await BackgroundTask.unregisterTaskAsync(TASK);
    return;
  }
  if (!point || !isCoordinate(point)) throw new Error('Najpierw wybierz okolicę na mapie.');
  if (
    isRunningInExpoGo() ||
    !(await TaskManager.isAvailableAsync()) ||
    (await BackgroundTask.getStatusAsync()) !== BackgroundTask.BackgroundTaskStatus.Available
  ) {
    throw new Error(
      'Alerty w tle wymagają własnej wersji aplikacji. W Expo Go nie można ich tutaj włączyć.',
    );
  }
  if (Platform.OS === 'android')
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Warunki na grzyby',
      importance: AndroidImportance.DEFAULT,
    });
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) throw new Error('Zezwól na powiadomienia w ustawieniach telefonu.');
  await BackgroundTask.registerTaskAsync(TASK, { minimumInterval: 60 });
  const rounded = getWeatherPoint(point);
  await db.runAsync(
    'UPDATE mushroom_alerts SET enabled = 1, latitude = ?, longitude = ?, location_updated_at = ? WHERE id = 1',
    rounded.latitude,
    rounded.longitude,
    Date.now(),
  );
}

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
        identifier: TASK,
        content: {
          title: 'Dobry moment na grzyby 🍄',
          body: `Warunki ${score}/10 w ostatnio wybranej okolicy. Może warto zajrzeć do lasu?`,
          data: { screen: 'map' },
        },
        trigger: Platform.OS === 'android' ? { channelId: CHANNEL } : null,
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
TaskManager.defineTask(TASK, async () => {
  try {
    await checkMushroomAlert();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});
