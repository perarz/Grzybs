import { AppText } from '@/components/AppText';
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
    </Screen>
  );
}
