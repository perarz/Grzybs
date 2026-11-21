import type { ConfigContext, ExpoConfig } from 'expo/config';

// A standalone Android build needs its own Google Maps key (Expo Go brings one).
// It comes from the EAS environment, never from the repository.
const googleMapsKey = process.env.GOOGLE_MAPS_API_KEY;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  plugins: [
    ...(config.plugins ?? []),
    ...(googleMapsKey
      ? [['react-native-maps', { androidGoogleMapsApiKey: googleMapsKey }] as [string, object]]
      : []),
  ],
  extra: { ...config.extra, googleMapsReady: Boolean(googleMapsKey) },
});
