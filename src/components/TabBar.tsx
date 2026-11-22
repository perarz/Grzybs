import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { selectionHaptic } from '@/features/feedback/haptics';
import { durations, spacing, useTheme } from '@/theme';

import { TabBarItem } from './TabBarItem';

const ICON_SIZE = 24;
const INDICATOR_HEIGHT = 3;
// The light leaves a small margin on both sides of the tab; it fades out anyway.
const PLATE_INSET = spacing.sm;

/** The forest floor: a dark bar whose lit plate, with a moss-green edge, slides to the open tab. */
export function TabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { colors } = useTheme();
  const [barWidth, setBarWidth] = useState(0);
  const tabWidth = barWidth / state.routes.length;

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(state.index * tabWidth + PLATE_INSET, {
          duration: durations.base,
        }),
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
          borderTopColor: colors.border,
          paddingBottom: insets.bottom + spacing.xs,
        },
      ]}
    >
      {barWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.plate, { width: tabWidth - PLATE_INSET * 2 }, indicatorStyle]}
        >
          {/* A soft oval of light under the edge, fading out on every side – no hard corners. */}
          <Svg style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient id="tabGlow" cx="50%" cy="0%" rx="50%" ry="100%">
                <Stop offset="0" stopColor={colors.glow} stopOpacity="0.32" />
                <Stop offset="1" stopColor={colors.glow} stopOpacity="0" />
              </RadialGradient>
              <LinearGradient id="tabLine" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={colors.glow} stopOpacity="0" />
                <Stop offset="0.5" stopColor={colors.glow} stopOpacity="1" />
                <Stop offset="1" stopColor={colors.glow} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#tabGlow)" />
            <Rect width="100%" height={INDICATOR_HEIGHT} fill="url(#tabLine)" />
          </Svg>
        </Animated.View>
      ) : null}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = index === state.index;
        const color = focused ? colors.glow : colors.onForestMuted;
        const label = options.title ?? route.name;

        function openTab() {
          selectionHaptic();
          // Same contract as the default tab bar: listeners may cancel the switch.
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (event.defaultPrevented) return;
          if (focused && route.name === '(home)') router.dismissTo('/');
          else if (!focused) navigateToTab(route.key);
        }

        return (
          <TabBarItem
            key={route.key}
            label={label}
            focused={focused}
            color={color}
            icon={options.tabBarIcon?.({ focused, color, size: ICON_SIZE })}
            onPress={openTab}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
  },
  plate: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
});
