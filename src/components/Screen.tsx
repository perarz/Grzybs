import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing, useTheme } from '@/theme';

import { BackButton } from './BackButton';
import { CollapsingTopBar, TOP_BAR_HEIGHT } from './CollapsingTopBar';
import { ForestHeader } from './forest/ForestHeader';

type ScreenProps = {
  title: string;
  /** A small typewritten line above the title. */
  eyebrow?: string;
  subtitle?: string;
  showBack?: boolean;
  children?: ReactNode;
};

// Roughly the height of the eyebrow and the large title – by then the title is gone.
const TITLE_REVEAL_AT = 72;

/** A scrolling page under a forest header, with an iOS-style large title that collapses. */
export function Screen({ title, eyebrow, subtitle, showBack = false, children }: ScreenProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });

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
        contentContainerStyle={styles.content}
      >
        <ForestHeader
          scrollY={scrollY}
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          topPadding={insets.top + (showBack ? TOP_BAR_HEIGHT : spacing.xl)}
        />
        <View style={styles.body}>{children}</View>
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
    paddingBottom: spacing.xxl,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
});
