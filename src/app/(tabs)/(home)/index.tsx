import { router } from 'expo-router';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { Screen } from '@/components/Screen';
import { SettingsButton } from '@/components/settings/SettingsButton';
import { HomeDestinations } from '@/components/home/HomeDestinations';
import { DailyDiscovery } from '@/components/home/DailyDiscovery';
import { CollectionPreview } from '@/components/home/CollectionPreview';
import { StaggeredIn } from '@/components/home/StaggeredIn';
import { spacing } from '@/theme';

// A clear sideways swipe, not a slightly crooked scroll.
const SWIPE_START = spacing.xl;
const SWIPE_DISTANCE = spacing.xxl * 3;

function openMap() {
  router.navigate('/map');
}

export default function HomeScreen() {
  // Swiping left on Start opens Mapa; Mapa has no swipe back, the map itself pans.
  const swipe = usePanGesture({
    activeOffsetX: [-SWIPE_START, Number.MAX_SAFE_INTEGER],
    failOffsetY: [-SWIPE_START, SWIPE_START],
    onDeactivate: (event) => {
      if (event.translationX < -SWIPE_DISTANCE) scheduleOnRN(openMap);
    },
  });
  return (
    <GestureDetector gesture={swipe}>
      <Screen title="Panel główny" eyebrow="Grzybs" titleAccessory={<SettingsButton />}>
        <StaggeredIn order={0}>
          <HomeDestinations />
        </StaggeredIn>
        <StaggeredIn order={1}>
          <DailyDiscovery />
        </StaggeredIn>
        <StaggeredIn order={2}>
          <CollectionPreview />
        </StaggeredIn>
      </Screen>
    </GestureDetector>
  );
}
