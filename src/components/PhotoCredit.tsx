import * as Linking from 'expo-linking';

import type { SpeciesPhoto } from '@/features/atlas/types';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

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
    <PressableScale haptic="none" accessibilityRole="link" onPress={openSource}>
      <AppText variant="caption" color="textMuted">
        Fot. {photo.author} · {photo.license} · Wikimedia Commons ↗
      </AppText>
    </PressableScale>
  );
}
