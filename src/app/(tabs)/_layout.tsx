import { Tabs } from 'expo-router';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { TabBar } from '@/components/TabBar';
import { useTheme } from '@/theme';

export const unstable_settings = { anchor: '(home)' };

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      // Back from Mapa returns to the anchor (Start), as Android users expect.
      backBehavior="initialRoute"
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Start',
          // Leaving Start (e.g. from Nauka to Mapa) closes its inner screens,
          // so coming back always shows the Start page itself.
          popToTopOnBlur: true,
          tabBarIcon: ({ color, size }) => <FieldIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <FieldIcon name="pin" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
