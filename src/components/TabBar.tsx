import type { BottomTabBarProps } from 'expo-router/tabs';
import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { selectionHaptic } from '@/features/feedback/haptics';
import { radius, spacing, springs, useTheme } from '@/theme';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

const ICON_SIZE = 24;
const INDICATOR_WIDTH = 28;
const INDICATOR_HEIGHT = 3;

/** The forest floor: a dark green bar with typewritten labels and an amber marker that slides to the open tab. */
export function TabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { colors } = useTheme();
  const [barWidth, setBarWidth] = useState(0);
  const tabWidth = barWidth / state.routes.length;

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(
          state.index * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2,
          springs.settle,
        ),
      },
    ],
  }));

  function handleLayout(event: LayoutChangeEvent) {
    setBarWidth(event.nativeEvent.layout.width);
  }

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.bar,
        {
          backgroundColor: colors.treeNear,
          paddingBottom: insets.bottom + spacing.xs,
        },
      ]}
    >
      {barWidth > 0 ? (
        <Animated.View
          style={[styles.indicator, { backgroundColor: colors.accent }, indicatorStyle]}
        />
      ) : null}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = index === state.index;
        const color = focused ? colors.onForest : colors.onForestMuted;
        const label = options.title ?? route.name;

        function openTab() {
          selectionHaptic();
          // Same contract as the default tab bar: listeners may cancel the switch.
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        }

        return (
          <PressableScale
            key={route.key}
            haptic="none"
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={openTab}
            style={styles.tab}
          >
            {options.tabBarIcon?.({ focused, color, size: ICON_SIZE })}
            <AppText variant="label" style={{ color }}>
              {label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: spacing.sm,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderBottomLeftRadius: radius.xs,
    borderBottomRightRadius: radius.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
});
