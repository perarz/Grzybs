import { Tabs } from 'expo-router';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { TabBar } from '@/components/TabBar';
import { useTheme } from '@/theme';

export const unstable_settings = { initialRouteName: '(home)' };

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Start',
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
