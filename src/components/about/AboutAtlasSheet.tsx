import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FONT_SOURCES, KNOWLEDGE_SOURCES } from '@/data/sources';
import { SPECIES } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { spacing, useTheme } from '@/theme';

import { SourceLink } from './SourceLink';

export function AboutAtlasSheet({ onClose }: { onClose: () => void }) {
  const { colors } = useTheme();
  return (
    <BottomSheet
      onClose={onClose}
      header={(close) => (
        <View style={styles.section}>
          <AppText variant="label" color="accent">
            Grzybnik · źródła i informacje
          </AppText>
          <AppText variant="title">O atlasie</AppText>
          <Button label="Zamknij" variant="secondary" onPress={close} />
        </View>
      )}
    >
      {() => (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.section}>
            <AppText variant="heading">Obserwuj. Porównuj. Ucz się.</AppText>
            <AppText>
              Atlas i quizy służą nauce. Zdjęcie znaleziska jest zapisem Twojej obserwacji —
              aplikacja nie rozpoznaje go automatycznie. Odblokowanie gatunku nie potwierdza
              identyfikacji ani jadalności.
            </AppText>
            <AppText color="textMuted">
              Opisy i porównania nie zastępują konsultacji z grzyboznawcą. Lista gatunków i
              sobowtórów nie obejmuje wszystkich grzybów.
            </AppText>
          </View>
          <View style={styles.section}>
            <AppText variant="heading">Twoje dane</AppText>
            <AppText>
              Zdjęcia, znaleziska, wyniki i zapisane miejsca są przechowywane na tym urządzeniu.
              Aplikacja nie ma kont ani synchronizacji; usunięcie jej danych może usunąć Twoją
              kolekcję.
            </AppText>
            <AppText color="textMuted">
              Kafelki mapy, pobieranie pogody i otwierane źródła wymagają internetu. Powrót do auta
              pokazuje kierunek w linii prostej, a nie wyznaczoną trasę.
            </AppText>
            <AppText color="textMuted">
              Mapa pobiera pogodę automatycznie. Open-Meteo otrzymuje współrzędne zaokrąglone do 2
              miejsc po przecinku, bez nazw, notatek i zdjęć. Ostatnie prognozy są zapisane offline;
              starsze dane są oznaczane jako nieaktualne.
            </AppText>
          </View>
          <View style={styles.section}>
            <AppText variant="heading">Materiały wykorzystane w atlasie</AppText>
            {KNOWLEDGE_SOURCES.map((source) => (
              <SourceLink key={source.url} {...source} />
            ))}
          </View>
          <View style={styles.section}>
            <AppText variant="heading">Zdjęcia · {SPECIES.length} gatunków</AppText>
            <AppText color="textMuted">
              Zdjęcia z Wikimedia Commons zostały zmniejszone do 800 px i są dołączone do aplikacji.
              Oryginał oraz szczegóły licencji otworzysz pod nazwą gatunku.
            </AppText>
            {SPECIES.map((species) => {
              const photo = SPECIES_PHOTOS[species.id];
              return (
                <View key={species.id} style={[styles.credit, { borderColor: colors.border }]}>
                  <SourceLink title={species.namePl} url={photo.url} />
                  <AppText variant="caption" color="textMuted">
                    Fot. {photo.author} · {photo.license}
                  </AppText>
                </View>
              );
            })}
          </View>
          <View style={styles.section}>
            <AppText variant="heading">Typografia</AppText>
            {FONT_SOURCES.map((source) => (
              <SourceLink key={source.url} {...source} />
            ))}
          </View>
        </ScrollView>
      )}
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.xl },
  section: { gap: spacing.md },
  credit: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.sm, gap: spacing.xs },
});
