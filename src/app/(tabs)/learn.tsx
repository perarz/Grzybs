import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';

export default function LearnScreen() {
  return (
    <Screen title="Nauka" subtitle="Ucz się rozpoznawać grzyby">
      <Card>
        <AppText variant="heading">Grzyb dnia</AppText>
        <AppText color="textMuted">Wkrótce: codziennie nowy gatunek i ciekawostka o nim.</AppText>
      </Card>
      <Card>
        <AppText variant="heading">Sobowtór</AppText>
        <AppText color="textMuted">
          Wkrótce: szybkie rundy – który z dwóch podobnych grzybów zostaje w koszyku?
        </AppText>
      </Card>
      <Card>
        <AppText variant="heading">Quiz</AppText>
        <AppText color="textMuted">Wkrótce: sprawdź, czy znasz cechy gatunków.</AppText>
      </Card>
    </Screen>
  );
}
