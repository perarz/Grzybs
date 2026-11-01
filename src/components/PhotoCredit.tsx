import * as Linking from 'expo-linking';
import { Pressable } from 'react-native';

import type { SpeciesPhoto } from '@/features/atlas/types';

import { AppText } from './AppText';

type PhotoCreditProps = {
  photo: SpeciesPhoto;
};

/** Free licenses require naming the author – tapping opens the photo page on Wikimedia Commons. */
export function PhotoCredit({ photo }: PhotoCreditProps) {
  function openSource() {
    // No browser or no network – the credit stays visible, so there's nothing else to do.
    Linking.openURL(photo.url).catch(() => undefined);
  }

  return (
    <Pressable accessibilityRole="link" onPress={openSource}>
      <AppText variant="caption" color="textMuted" numberOfLines={2}>
        Fot. {photo.author} · {photo.license} · Wikimedia Commons
      </AppText>
    </Pressable>
  );
}
