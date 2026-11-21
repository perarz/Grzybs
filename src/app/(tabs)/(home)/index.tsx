import { Screen } from '@/components/Screen';
import { SettingsButton } from '@/components/settings/SettingsButton';
import { HomeDestinations } from '@/components/home/HomeDestinations';
import { DailyDiscovery } from '@/components/home/DailyDiscovery';
import { CollectionPreview } from '@/components/home/CollectionPreview';

export default function HomeScreen() {
  return (
    <Screen
      title="Bliżej lasu."
      eyebrow="Grzybnik / Twój przewodnik"
      headerRight={<SettingsButton />}
    >
      <HomeDestinations />
      <DailyDiscovery />
      <CollectionPreview />
    </Screen>
  );
}
