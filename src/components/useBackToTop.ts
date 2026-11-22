import { useState, type ComponentRef, type RefObject } from 'react';
import type { ScrollView } from 'react-native';
import {
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

// Scrolling up by this much (in px) shows the button; scrolling down by it hides it.
const DIRECTION_THRESHOLD = 24;
// The button stays hidden until the page is scrolled past this share of the viewport.
const MIN_SCROLL_SHARE = 0.6;

/** Tracks the scroll position and decides when to offer a "back to top" button. */
export function useBackToTop(
  scrollRef: RefObject<ComponentRef<typeof ScrollView> | null>,
  scrollY: SharedValue<number>,
  enabled: boolean,
) {
  const [showTop, setShowTop] = useState(false);
  const reducedMotion = useReducedMotion();
  const directionDistance = useSharedValue(0);
  const topVisible = useSharedValue(false);
  const returning = useSharedValue(false);
  const handleScroll = useAnimatedScrollHandler({
    onBeginDrag: () => {
      returning.set(false);
    },
    onScroll: (event) => {
      const y = Math.max(0, event.contentOffset.y);
      const delta = scrollY.get() - y;
      scrollY.set(y);
      if (!enabled) return;
      const distance = directionDistance.get();
      directionDistance.set(delta * distance < 0 ? delta : distance + delta);
      let visible = topVisible.get();
      if (y < event.layoutMeasurement.height * MIN_SCROLL_SHARE || returning.get()) visible = false;
      else if (directionDistance.get() > DIRECTION_THRESHOLD) visible = true;
      else if (directionDistance.get() < -DIRECTION_THRESHOLD) visible = false;
      if (visible !== topVisible.get()) {
        topVisible.set(visible);
        scheduleOnRN(setShowTop, visible);
      }
    },
  });
  const goToTop = () => {
    returning.set(true);
    topVisible.set(false);
    directionDistance.set(0);
    setShowTop(false);
    scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion });
  };

  return { handleScroll, showTop, goToTop };
}
