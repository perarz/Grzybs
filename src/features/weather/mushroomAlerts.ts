import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { isCoordinate } from '@/features/navigation/geo';
import { checkMushroomAlert } from './alertCheck';
import { ALERT_CHANNEL, ALERT_TASK } from './alertConstants';
import { database } from './alertSettings';
import { getWeatherPoint } from './forecast';
import type { WeatherPoint } from './types';

export async function setMushroomAlerts(enabled: boolean, point: WeatherPoint | null) {
  const db = await database();
  if (!enabled) {
    await db.runAsync('UPDATE mushroom_alerts SET enabled = 0 WHERE id = 1');
    if (await TaskManager.isTaskRegisteredAsync(ALERT_TASK))
      await BackgroundTask.unregisterTaskAsync(ALERT_TASK);
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
    await Notifications.setNotificationChannelAsync(ALERT_CHANNEL, {
      name: 'Warunki na grzyby',
      importance: AndroidImportance.DEFAULT,
    });
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) throw new Error('Zezwól na powiadomienia w ustawieniach telefonu.');
  await BackgroundTask.registerTaskAsync(ALERT_TASK, { minimumInterval: 60 });
  const rounded = getWeatherPoint(point);
  await db.runAsync(
    'UPDATE mushroom_alerts SET enabled = 1, latitude = ?, longitude = ?, location_updated_at = ? WHERE id = 1',
    rounded.latitude,
    rounded.longitude,
    Date.now(),
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
TaskManager.defineTask(ALERT_TASK, async () => {
  try {
    await checkMushroomAlert();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});
