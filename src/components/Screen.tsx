import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, type ComponentRef, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';

import { layout, spacing, useTheme } from '@/theme';

import { BackToTopButton } from './BackToTopButton';
import { BackButton } from './BackButton';
import { CollapsingTopBar } from './CollapsingTopBar';
import { PageMasthead } from './PageMasthead';
import { useBackToTop } from './useBackToTop';

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
  const { handleScroll, showTop, goToTop } = useBackToTop(scrollRef, scrollY, backToTop);

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
            accessory={titleAccessory}
          />
        )}
        <View style={styles.body}>{children}</View>
      </Animated.ScrollView>
      {backToTop && showTop && <BackToTopButton onPress={goToTop} />}
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
