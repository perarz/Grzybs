import { Tabs } from 'expo-router';

import { AtlasIcon, LearnIcon, MapIcon } from '@/components/icons/TabIcons';
import { TabBarIcon } from '@/components/TabBarIcon';
import { typography, useTheme } from '@/theme';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: typography.label,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <MapIcon color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      {/* Atlas is the index route, so the app opens on it – in the middle of the tab bar. */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Atlas',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <AtlasIcon color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Nauka',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <LearnIcon color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
    </Tabs>
  );
}
