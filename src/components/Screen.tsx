import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing, typography, useTheme } from '@/theme';

import { AppText } from './AppText';
import { BackButton } from './BackButton';
import { CollapsingTopBar, TOP_BAR_HEIGHT } from './CollapsingTopBar';

type ScreenProps = {
  title: string;
  /** A small typewritten line above the title. */
  eyebrow?: string;
  subtitle?: string;
  showBack?: boolean;
  children?: ReactNode;
};

// Roughly the height of the eyebrow and the large title – by then the title is gone.
const TITLE_REVEAL_AT = 64;
const OVERSCROLL_DISTANCE = 120;
const OVERSCROLL_TITLE_SCALE = 1.08;

/** A scrolling page with an iOS-style large title that collapses into the top bar. */
export function Screen({ title, eyebrow, subtitle, showBack = false, children }: ScreenProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });
  // Pulling past the top (iOS bounce) gently enlarges the title.
  const titleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollY.get(),
          [-OVERSCROLL_DISTANCE, 0],
          [OVERSCROLL_TITLE_SCALE, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Takes the status bar back from a screen below that changed it (e.g. light icons over a photo). */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        // Taps on chips and buttons work while the keyboard is open; scrolling hides it.
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + (showBack ? TOP_BAR_HEIGHT : spacing.xl) },
        ]}
      >
        <View style={styles.header}>
          {eyebrow ? (
            <AppText variant="label" color="accent">
              {eyebrow}
            </AppText>
          ) : null}
          <Animated.Text
            accessibilityRole="header"
            style={[typography.display, styles.title, { color: colors.text }, titleStyle]}
          >
            {title}
          </Animated.Text>
          {subtitle ? <AppText color="textMuted">{subtitle}</AppText> : null}
        </View>
        {children}
      </Animated.ScrollView>
      <CollapsingTopBar
        scrollY={scrollY}
        title={title}
        revealAt={TITLE_REVEAL_AT}
        left={showBack ? <BackButton /> : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  title: {
    transformOrigin: 'left center',
  },
});
