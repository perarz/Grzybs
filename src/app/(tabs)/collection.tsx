import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';

export default function CollectionScreen() {
  return (
    <Screen title="Zbiory" subtitle="Twój Grzybodex i statystyki">
      <Card>
        <AppText variant="heading">Grzybodex</AppText>
        <AppText color="textMuted">
          Wkrótce: znaleziska ze zdjęciami i kolekcja odkrytych gatunków.
        </AppText>
      </Card>
    </Screen>
  );
}
