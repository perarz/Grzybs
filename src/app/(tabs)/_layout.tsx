import { Tabs } from 'expo-router';

import { AtlasIcon, LearnIcon, MapIcon } from '@/components/icons/TabIcons';
import { TabBar } from '@/components/TabBar';
import { TabBarIcon } from '@/components/TabBarIcon';
import { useTheme } from '@/theme';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      {/* Atlas is the index route, so the app opens on it – on the left of the tab bar. */}
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
