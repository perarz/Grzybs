import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { selectionHaptic } from '@/features/feedback/haptics';
import { durations, radius, spacing, useTheme } from '@/theme';

import { TabBarItem } from './TabBarItem';

const ICON_SIZE = 24;
const INDICATOR_HEIGHT = 3;
// The highlighted plate leaves a margin on both sides of the tab.
const PLATE_INSET = spacing.xl;

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
          {/* A soft light falling from the edge line, fading out before the label. */}
          <Svg style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="tabGlow" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.glow} stopOpacity="0.28" />
                <Stop offset="1" stopColor={colors.glow} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#tabGlow)" />
          </Svg>
          <View style={[styles.line, { backgroundColor: colors.glow }]} />
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
  line: { height: INDICATOR_HEIGHT, borderRadius: radius.xs },
});
