import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { DragHandleIcon } from '@/components/icons/UiIcons';
import { useComparisonSlider } from '@/features/atlas/useComparisonSlider';
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

/** Two photos on top of each other – dragging the divider shows more of one or the other. */
export function ComparisonSlider({ left, right }: ComparisonSliderProps) {
  const { colors } = useTheme();
  const { gesture, handleLayout, leftClipStyle, leftPhotoStyle, handleStyle, knobStyle } =
    useComparisonSlider();

  return (
    <GestureDetector gesture={gesture}>
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
          <Animated.View
            style={[
              styles.knob,
              { backgroundColor: colors.surface, borderColor: colors.border },
              knobStyle,
            ]}
          >
            <DragHandleIcon color={colors.text} size={ICON_SIZE} />
          </Animated.View>
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
    borderRadius: radius.md,
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
