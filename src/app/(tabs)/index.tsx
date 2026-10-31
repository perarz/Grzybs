import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SpeciesPreviewStrip } from '@/components/SpeciesPreviewStrip';
import { SPECIES } from '@/data/species';

export default function AtlasScreen() {
  return (
    <Screen title="Atlas" subtitle="Poznaj gatunki i odblokuj je swoimi zdjęciami">
      <Card>
        <AppText variant="heading">Gatunki</AppText>
        <AppText color="textMuted">
          Gatunków w atlasie: {SPECIES.length}. Wkrótce: filtrowanie po cechach i ostrzeżenia przed
          groźnymi sobowtórami.
        </AppText>
        <SpeciesPreviewStrip />
      </Card>
      <Card>
        <AppText variant="heading">Twoja kolekcja</AppText>
        <AppText color="textMuted">
          Wkrótce: zrób zdjęcie znaleziska, aby odblokować gatunek w atlasie.
        </AppText>
      </Card>
    </Screen>
  );
}
