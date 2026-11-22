import { Screen } from '@/components/Screen';
import { SettingsButton } from '@/components/settings/SettingsButton';
import { HomeDestinations } from '@/components/home/HomeDestinations';
import { DailyDiscovery } from '@/components/home/DailyDiscovery';
import { CollectionPreview } from '@/components/home/CollectionPreview';
import { StaggeredIn } from '@/components/home/StaggeredIn';

export default function HomeScreen() {
  return (
    <Screen title="Panel główny" eyebrow="Grzybs" titleAccessory={<SettingsButton />}>
      <StaggeredIn order={0}>
        <HomeDestinations />
      </StaggeredIn>
      <StaggeredIn order={1}>
        <DailyDiscovery />
      </StaggeredIn>
      <StaggeredIn order={2}>
        <CollectionPreview />
      </StaggeredIn>
    </Screen>
  );
}
