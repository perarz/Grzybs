import { isRunningInExpoGo } from 'expo';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Google Maps on Android crashes natively without an API key. Expo Go carries its own key and
 * iOS uses Apple Maps, so only a standalone Android build built without the key goes without a map.
 */
export function canShowNativeMap() {
  if (Platform.OS !== 'android' || isRunningInExpoGo()) return true;
  return Constants.expoConfig?.extra?.googleMapsReady === true;
}
