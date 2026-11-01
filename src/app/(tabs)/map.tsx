import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';

export default function MapScreen() {
  return (
    <Screen eyebrow="Teren" title="Mapa" subtitle="Twoje spoty i bezpieczny powrót.">
      <Card>
        <AppText variant="heading">Miejscówki</AppText>
        <AppText color="textMuted">Wkrótce: prywatne punkty na mapie z notatkami.</AppText>
      </Card>
      <Card>
        <AppText variant="heading">Powrót do auta</AppText>
        <AppText color="textMuted">
          Wkrótce: zapisz miejsce parkowania i wróć do auta z kompasem, zanim zrobi się ciemno.
        </AppText>
      </Card>
    </Screen>
  );
}
