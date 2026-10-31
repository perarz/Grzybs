import { Tabs } from 'expo-router';

import { AtlasIcon, CollectionIcon, ForecastIcon, MapIcon } from '@/components/icons/TabIcons';
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
        name="index"
        options={{
          title: 'Prognoza',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <ForecastIcon color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="atlas"
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
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Zbiory',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon focused={focused}>
              <CollectionIcon color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
    </Tabs>
  );
}
