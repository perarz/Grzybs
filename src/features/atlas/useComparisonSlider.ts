import { useEffect } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { usePanGesture } from 'react-native-gesture-handler';
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { selectionHaptic } from '@/features/feedback/haptics';
import { durations, springs } from '@/theme';

// A finger must move this far sideways before it grabs the slider,
// so a vertical swipe over the photos still scrolls the page.
const DRAG_THRESHOLD = 10;
const GRABBED_KNOB_SCALE = 1.15;
// On arrival the divider nudges right and back once – a hint that it can be dragged.
const HINT_DELAY = 500;
const HINT_SPLIT = 0.62;

/** Drag logic of the before/after slider: where the divider is and how the knob reacts. */
export function useComparisonSlider() {
  const frameWidth = useSharedValue(0);
  // How much of the frame shows the left photo: 0 – none, 1 – all of it.
  const split = useSharedValue(0.5);
  const knobScale = useSharedValue(1);
  const isPastMiddle = useSharedValue(false);

  useEffect(() => {
    split.set(
      withDelay(
        HINT_DELAY,
        withSequence(
          withTiming(HINT_SPLIT, { duration: durations.slow }),
          withSpring(0.5, springs.settle),
        ),
      ),
    );
  }, [split]);

  // Gesture callbacks and animated styles run on the UI thread, so dragging stays smooth.
  // Haptics live on the JS thread – scheduleOnRN hands them over.
  const gesture = usePanGesture({
    activeOffsetX: [-DRAG_THRESHOLD, DRAG_THRESHOLD],
    failOffsetY: [-DRAG_THRESHOLD, DRAG_THRESHOLD],
    onActivate: () => {
      knobScale.set(withSpring(GRABBED_KNOB_SCALE, springs.press));
      scheduleOnRN(selectionHaptic);
    },
    onUpdate: (event) => {
      if (frameWidth.get() === 0) return;
      const nextSplit = Math.min(Math.max(event.x / frameWidth.get(), 0), 1);
      split.set(nextSplit);
      // A tick each time the divider crosses the middle.
      if (nextSplit > 0.5 !== isPastMiddle.get()) {
        isPastMiddle.set(nextSplit > 0.5);
        scheduleOnRN(selectionHaptic);
      }
    },
    onFinalize: () => {
      knobScale.set(withSpring(1, springs.press));
    },
  });

  const leftClipStyle = useAnimatedStyle(() => ({ width: split.get() * frameWidth.get() }));
  // The left photo keeps the full frame width inside its clip, so it's cut – not squeezed.
  const leftPhotoStyle = useAnimatedStyle(() => ({ width: frameWidth.get() }));
  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: split.get() * frameWidth.get() }],
  }));
  const knobStyle = useAnimatedStyle(() => ({ transform: [{ scale: knobScale.get() }] }));
  // A name fades out as its photo gets squeezed, so it never sits on the other species.
  const leftTagStyle = useAnimatedStyle(() => ({
    opacity: interpolate(split.get(), [0.2, 0.4], [0, 1], Extrapolation.CLAMP),
  }));
  const rightTagStyle = useAnimatedStyle(() => ({
    opacity: interpolate(split.get(), [0.6, 0.8], [1, 0], Extrapolation.CLAMP),
  }));

  function handleLayout(event: LayoutChangeEvent) {
    frameWidth.set(event.nativeEvent.layout.width);
  }

  return {
    gesture,
    handleLayout,
    leftClipStyle,
    leftPhotoStyle,
    handleStyle,
    knobStyle,
    leftTagStyle,
    rightTagStyle,
  };
}
