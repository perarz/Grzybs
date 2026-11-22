import { useEffect } from 'react';
import { AppState } from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { checkMushroomAlert } from './alertCheck';

export function MushroomAlertsLifecycle() {
  useEffect(() => {
    const check = () => {
      void checkMushroomAlert().catch(() => undefined);
    };
    check();
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });
    const timer = setInterval(
      () => {
        if (AppState.currentState === 'active') check();
      },
      60 * 60 * 1000,
    );
    let active = true;
    let handled: string | null = null;
    function response(value: Notifications.NotificationResponse | null) {
      if (!active || !value || value.notification.request.content.data?.screen !== 'map') return;
      const id = `${value.notification.request.identifier}:${value.notification.date}`;
      if (id === handled) return;
      handled = id;
      router.navigate('/(tabs)/map');
      void Notifications.clearLastNotificationResponseAsync().catch(() => undefined);
    }
    const subscription = Notifications.addNotificationResponseReceivedListener(response);
    void Notifications.getLastNotificationResponseAsync()
      .then(response)
      .catch(() => undefined);
    return () => {
      active = false;
      appState.remove();
      subscription.remove();
      clearInterval(timer);
    };
  }, []);
  return null;
}
