import { Image } from 'expo-image';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { DragHandleIcon } from '@/components/icons/UiIcons';
import { radius, useTheme } from '@/theme';

import { NameTag } from './NameTag';

type SliderSide = {
  source: number;
  label: string;
};

type ComparisonSliderProps = {
  left: SliderSide;
  right: SliderSide;
};

const KNOB_SIZE = 44;
const LINE_WIDTH = 3;
const ICON_SIZE = 24;
// A finger must move this far sideways before it grabs the slider,
// so a vertical swipe over the photos still scrolls the page.
const DRAG_THRESHOLD = 10;

/** Two photos on top of each other – dragging the divider shows more of one or the other. */
export function ComparisonSlider({ left, right }: ComparisonSliderProps) {
  const { colors } = useTheme();
  const frameWidth = useSharedValue(0);
  // How much of the frame shows the left photo: 0 – none, 1 – all of it.
  const split = useSharedValue(0.5);

  // Gesture callbacks and animated styles run on the UI thread, so dragging stays smooth.
  const pan = usePanGesture({
    activeOffsetX: [-DRAG_THRESHOLD, DRAG_THRESHOLD],
    failOffsetY: [-DRAG_THRESHOLD, DRAG_THRESHOLD],
    onUpdate: (event) => {
      if (frameWidth.get() === 0) return;
      split.set(Math.min(Math.max(event.x / frameWidth.get(), 0), 1));
    },
  });

  const leftClipStyle = useAnimatedStyle(() => ({ width: split.get() * frameWidth.get() }));
  // The left photo keeps the full frame width inside its clip, so it's cut – not squeezed.
  const leftPhotoStyle = useAnimatedStyle(() => ({ width: frameWidth.get() }));
  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: split.get() * frameWidth.get() }],
  }));

  function handleLayout(event: LayoutChangeEvent) {
    frameWidth.set(event.nativeEvent.layout.width);
  }

  return (
    <GestureDetector gesture={pan}>
      <View
        accessibilityLabel={`Porównanie zdjęć: ${left.label} i ${right.label}`}
        onLayout={handleLayout}
        style={[styles.frame, { backgroundColor: colors.surfaceMuted }]}
      >
        <Image source={right.source} style={StyleSheet.absoluteFill} contentFit="cover" />
        <Animated.View style={[styles.leftClip, leftClipStyle]}>
          <Animated.View style={[styles.leftPhoto, leftPhotoStyle]}>
            <Image source={left.source} style={StyleSheet.absoluteFill} contentFit="cover" />
          </Animated.View>
        </Animated.View>
        <Animated.View style={[styles.handle, handleStyle]}>
          <View style={[styles.line, { backgroundColor: colors.surface }]} />
          <View
            style={[styles.knob, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <DragHandleIcon color={colors.text} size={ICON_SIZE} />
          </View>
        </Animated.View>
        <NameTag label={left.label} side="left" />
        <NameTag label={right.label} side="right" />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  leftClip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  leftPhoto: {
    height: '100%',
  },
  handle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    // Centres the handle on the divider – translateX then moves it to the split point.
    left: -KNOB_SIZE / 2,
    width: KNOB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  line: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: LINE_WIDTH,
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
