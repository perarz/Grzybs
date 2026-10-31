import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';

export default function MapScreen() {
  return (
    <Screen title="Mapa" subtitle="Twoje miejscówki i bezpieczny powrót">
      <Card>
        <AppText variant="heading">Miejscówki</AppText>
        <AppText color="textMuted">
          Wkrótce: prywatne punkty na mapie i nawigacja do zaparkowanego auta.
        </AppText>
      </Card>
    </Screen>
  );
}
