import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';

export default function AtlasScreen() {
  return (
    <Screen title="Atlas" subtitle="Poznaj gatunki i odblokuj je swoimi zdjęciami">
      <Card>
        <AppText variant="heading">Gatunki</AppText>
        <AppText color="textMuted">
          Wkrótce: popularne grzyby z Polski z filtrowaniem po cechach i ostrzeżeniami przed
          groźnymi sobowtórami.
        </AppText>
      </Card>
      <Card>
        <AppText variant="heading">Twoja kolekcja</AppText>
        <AppText color="textMuted">
          Wkrótce: zrób zdjęcie znaleziska, aby odblokować gatunek w atlasie.
        </AppText>
      </Card>
      {__DEV__ ? (
        <Button label="Test 3D (dev)" onPress={() => router.push('/dev/3d-test')} />
      ) : null}
    </Screen>
  );
}
