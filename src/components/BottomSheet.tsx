import { useEffect, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { durations, radius, spacing, springs, useTheme } from '@/theme';

type BottomSheetProps = {
  /** Called after the sheet has slid away – the parent then stops rendering it. */
  onClose: () => void;
  /** Rendered in the draggable top part. Gets `close`, which slides the sheet away first. */
  header: (close: () => void) => ReactNode;
  children: (close: () => void) => ReactNode;
};

// A fixed height, so the sheet doesn't jump when its content changes (e.g. the next question).
const HEIGHT_SHARE = 0.86;
// A drag this long, or a flick this fast, closes the sheet; anything less springs back.
const CLOSE_DISTANCE = 120;
const CLOSE_VELOCITY = 900;
const HANDLE_WIDTH = 40;
const HANDLE_HEIGHT = 5;

/** A sheet rising from the bottom, closed by dragging it down or tapping the dimmed backdrop. */
export function BottomSheet({ onClose, header, children }: BottomSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  // How far the sheet is pushed below its resting place – the whole screen height means hidden.
  const offset = useSharedValue(height);

  useEffect(() => {
    offset.set(withSpring(0, springs.sheet));
  }, [offset]);

  // Runs both from a button (JS thread) and from the drag gesture (UI thread).
  function slideAway() {
    'worklet';
    offset.set(
      withTiming(height, { duration: durations.base }, (finished) => {
        if (finished) scheduleOnRN(onClose);
      }),
    );
  }

  const drag = usePanGesture({
    // Only a downward drag grabs the sheet.
    activeOffsetY: 10,
    onUpdate: (event) => {
      offset.set(Math.max(0, event.translationY));
    },
    onDeactivate: (event) => {
      if (event.translationY > CLOSE_DISTANCE || event.velocityY > CLOSE_VELOCITY) {
        slideAway();
      } else {
        offset.set(withSpring(0, springs.settle));
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.get() }] }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offset.get(), [0, height], [1, 0]),
  }));

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={slideAway}
    >
      {/* Android modals live outside the app's gesture root, so they need their own. */}
      <GestureHandlerRootView style={styles.root}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.backdrop }, backdropStyle]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Zamknij"
            onPress={slideAway}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              height: height * HEIGHT_SHARE,
              paddingBottom: insets.bottom + spacing.md,
            },
            sheetStyle,
          ]}
        >
          <GestureDetector gesture={drag}>
            <View style={styles.header}>
              <View style={[styles.handle, { backgroundColor: colors.border }]} />
              {header(slideAway)}
            </View>
          </GestureDetector>
          <View style={styles.body}>{children(slideAway)}</View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    overflow: 'hidden',
  },
  header: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  body: {
    flex: 1,
  },
  handle: {
    alignSelf: 'center',
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: radius.pill,
  },
});
