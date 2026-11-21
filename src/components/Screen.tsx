import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ReduceMotion,
  useReducedMotion,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { durations, layout, radius, spacing, useTheme } from '@/theme';

import { scheduleOnRN } from 'react-native-worklets';
import { PressableScale } from './PressableScale';
import { FieldIcon } from './icons/FieldIcon';
import { BackButton } from './BackButton';
import { CollapsingTopBar } from './CollapsingTopBar';
import { PageMasthead } from './PageMasthead';

type ScreenProps = {
  title: string;
  /** A small typewritten line above the title. */
  eyebrow?: string;
  subtitle?: string;
  showBack?: boolean;
  header?: ReactNode;
  children?: ReactNode;
  backToTop?: boolean;
  /** Shown to the right of the large title – it scrolls away with it. */
  titleAccessory?: ReactNode;
  /** Return to the question heading when a lesson advances. */
  resetScrollKey?: number;
};

// Roughly the height of the eyebrow and the large title – by then the title is gone.
const TITLE_REVEAL_AT = 72;

/** A scrolling page under a forest header, with an iOS-style large title that collapses. */
export function Screen({
  title,
  eyebrow,
  subtitle,
  showBack = false,
  header,
  children,
  backToTop = false,
  titleAccessory,
  resetScrollKey,
}: ScreenProps) {
  const { colors, isDark } = useTheme();
  const scrollY = useSharedValue(0);

  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  useEffect(() => {
    if (resetScrollKey !== undefined) scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [resetScrollKey]);
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
      if (!backToTop) return;
      const distance = directionDistance.get();
      directionDistance.set(delta * distance < 0 ? delta : distance + delta);
      let visible = topVisible.get();
      if (y < event.layoutMeasurement.height * 0.6 || returning.get()) visible = false;
      else if (directionDistance.get() > 24) visible = true;
      else if (directionDistance.get() < -24) visible = false;
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      {/* Takes the status bar back from a screen below that changed it (e.g. light icons over a photo). */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        // Taps on chips and buttons work while the keyboard is open; scrolling hides it.
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.content}
      >
        {header ? (
          header
        ) : (
          <PageMasthead
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            showBack={showBack}
            accessory={titleAccessory}
          />
        )}
        <View style={styles.body}>{children}</View>
      </Animated.ScrollView>
      {backToTop && showTop && (
        <Animated.View
          entering={FadeIn.duration(durations.fast).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(durations.fast).reduceMotion(ReduceMotion.System)}
          style={styles.toTop}
        >
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Wróć na górę atlasu"
            onPress={goToTop}
            style={[
              styles.topButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <FieldIcon name="arrowUp" size={23} color={colors.text} />
          </PressableScale>
        </Animated.View>
      )}
      <CollapsingTopBar
        scrollY={scrollY}
        title={title}
        revealAt={TITLE_REVEAL_AT}
        left={showBack ? <BackButton /> : undefined}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  toTop: { position: 'absolute', bottom: spacing.lg, alignSelf: 'center' },
  topButton: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.pill,
    borderWidth: 1,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  body: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
});
