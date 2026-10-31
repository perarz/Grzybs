import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';

export default function ForecastScreen() {
  return (
    <Screen title="Prognoza" subtitle="Czy warto dziś iść na grzyby?">
      <Card>
        <AppText variant="heading">Indeks grzybowy</AppText>
        <AppText color="textMuted">
          Wkrótce: ocena 0–100 na podstawie opadów i temperatury z ostatnich dwóch tygodni.
        </AppText>
      </Card>
    </Screen>
  );
}
