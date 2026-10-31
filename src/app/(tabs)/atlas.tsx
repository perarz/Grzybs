import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';

export default function AtlasScreen() {
  return (
    <Screen title="Atlas" subtitle="Poznaj gatunki i ich groźne sobowtóry">
      <Card>
        <AppText variant="heading">Gatunki</AppText>
        <AppText color="textMuted">
          Wkrótce: popularne grzyby z Polski z filtrowaniem po cechach.
        </AppText>
      </Card>
      {__DEV__ ? (
        <Button label="Test 3D (dev)" onPress={() => router.push('/dev/3d-test')} />
      ) : null}
    </Screen>
  );
}
