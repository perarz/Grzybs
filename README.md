# Grzybnik 🍄

Uniwersalna aplikacja grzybiarza w trzech częściach: **Atlas** gatunków z ostrzeżeniami przed trującymi sobowtórami (gatunki odblokowujesz zdjęciami swoich znalezisk), **Nauka** z grą i quizami oraz **Mapa** z prywatnymi miejscówkami i powrotem do auta. Działa offline – w lesie zasięg bywa słaby.

> Projekt powstał jako zadanie rekrutacyjne do Software Mansion.

<!-- TODO: GIF / zrzuty ekranu -->

## Platforma i testy

- **Przygotowana głównie pod:** Android
- **Testowana na fizycznym urządzeniu:** TODO (uzupełnić przed oddaniem)
- **Emulator:** Android Studio, Medium Phone (API 37)

## Funkcje

| Moduł | Opis                                                                                                                                     | Status                                        |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Atlas | 26 gatunków z Polski ze zdjęciami, filtrowanie po cechach, sobowtóry z alertami, sezonowość; odblokowywanie gatunków zdjęciem znaleziska | przeglądanie gotowe, odblokowywanie w budowie |
| Nauka | Grzyb dnia, gra „Sobowtór”, quiz o cechach gatunków                                                                                      | planowane                                     |
| Mapa  | Prywatne miejscówki, „Zaparkowałem tutaj”, powrót do auta z kompasem, alarm zmroku                                                       | planowane                                     |

## Uruchomienie

Wymagania: Node.js LTS (wersja w `.nvmrc`), npm.

```bash
npm install
npx expo start
```

- **Emulator Androida:** uruchom emulator w Android Studio, potem w terminalu z `expo start` naciśnij `a` (Expo CLI sam zainstaluje Expo Go).
- **Telefon:** zainstaluj Expo Go ze sklepu i zeskanuj kod QR z terminala.

## Skrypty

| Komenda             | Co robi                    |
| ------------------- | -------------------------- |
| `npm start`         | serwer deweloperski Expo   |
| `npm run lint`      | ESLint + Prettier          |
| `npm run typecheck` | sprawdzenie typów (tsc)    |
| `npm run format`    | formatowanie kodu Prettier |

## Stack

Expo SDK 58 · React Native 0.88 · TypeScript (strict) · expo-router · Reanimated · Gesture Handler · react-native-svg · react-native-maps · expo-location · expo-sensors · expo-image-picker · expo-sqlite · zustand · suncalc

## Struktura

```
src/app/         ekrany (expo-router), zakładki w (tabs)/
src/components/  współdzielone komponenty UI
src/features/    logika funkcji (atlas, collection, learn, spots, navigation, safety)
src/db/          SQLite: połączenie i migracje
src/data/        statyczne dane gatunków
src/theme/       kolory (jasny/ciemny), typografia, odstępy
```

## Decyzje techniczne

- **Offline-first:** dane użytkownika w SQLite z wersjonowanymi migracjami (`PRAGMA user_version`); aplikacja nie potrzebuje sieci (poza kafelkami mapy).
- **Expo Go:** wyłącznie biblioteki dostępne w Expo Go – aplikację da się uruchomić bez budowania natywnego.
- **Odporność na błędy:** globalny `ErrorBoundary` z przyciskiem „Spróbuj ponownie” zamiast crasha.
- **Wygląd „zielnik”:** papier, tusz i jeden rdzawy akcent zamiast szablonowej palety. Nazwy szeryfowym Fraunces, łacina kursywą, etykiety maszynowym IBM Plex Mono, jadalność jako pieczątka, karty jak arkusze zielnika z numerem okazu.
- **Ruch i dotyk:** każdy klikalny element ugina się na sprężynie i odpowiada haptyką (`expo-haptics`), duże tytuły zwijają się w pasek jak w iOS, karty płynnie przestawiają się przy filtrowaniu (Reanimated – layout animations i CSS transitions).
- TODO: uzupełniać w kolejnych etapach.

## Źródła i licencje

**Wiedza o gatunkach** (jadalność, toksyczność, sezony, siedliska, sobowtóry) – opracowana własnymi słowami na podstawie:

- artykułów o poszczególnych gatunkach w [polskiej Wikipedii](https://pl.wikipedia.org),
- [Medycyna Praktyczna – zatrucie piestrzenicą kasztanowatą](https://www.mp.pl/pacjent/pierwsza_pomoc/441487,zatrucie-piestrzenica-kasztanowata),
- poradnika Lasów Państwowych [„Bezpieczne grzybobranie”](https://www.lasy.gov.pl/pl/informacje/aktualnosci/wystawa-o-grzybach-juz-otwarta/BEZPIECZNE-GRZYBOBRANIE.pdf/@@download/file/BEZPIECZNE-GRZYBOBRANIE.pdf),
- kalendarzy grzybiarza stacji sanitarno-epidemiologicznych ([gov.pl](https://www.gov.pl/web/psse-wabrzezno/w-lesie-grzybow-coraz-wiecej)).

Niepewne fakty są oznaczone w kodzie jako `TODO: verify`.

**Zdjęcia gatunków** pochodzą z [Wikimedia Commons](https://commons.wikimedia.org), są na licencjach Creative Commons i zostały zmniejszone do 800 px. Kliknij nazwę gatunku, aby zobaczyć oryginał.

| Gatunek                                                                                                               | Autor                               | Licencja        |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------------- |
| [Borowik szlachetny](https://commons.wikimedia.org/wiki/File:Boletus_edulis_IT.jpg)                                   | ReddishClover                       | CC BY-SA 4.0    |
| [Podgrzybek brunatny](https://commons.wikimedia.org/wiki/File:Boletus_badius_G1.jpg)                                  | Jerzy Opioła                        | CC BY-SA 4.0    |
| [Koźlarz babka](https://commons.wikimedia.org/wiki/File:Leccinum_scabrum_G3.1.jpg)                                    | Jerzy Opioła                        | CC BY-SA 4.0    |
| [Koźlarz czerwony](https://commons.wikimedia.org/wiki/File:Leccinum_aurantiacum_G4.JPG)                               | Jerzy Opioła                        | CC BY-SA 3.0    |
| [Maślak zwyczajny](https://commons.wikimedia.org/wiki/File:Suillus_luteus_2.jpg)                                      | Jerzy Opioła                        | CC BY-SA 3.0    |
| [Pieprznik jadalny](https://commons.wikimedia.org/wiki/File:Cantharellus_cibarius_20090717-02.jpg)                    | Heisenberg-pl                       | CC BY-SA 3.0    |
| [Czubajka kania](https://commons.wikimedia.org/wiki/File:Macrolepiota-procera.jpg)                                    | Chrumps                             | CC BY-SA 4.0    |
| [Gołąbek zielonawy](https://commons.wikimedia.org/wiki/File:Russula_virescens_B%C5%BB2.1.jpg)                         | Jerzy Opioła                        | CC BY-SA 3.0    |
| [Pieczarka polna](https://commons.wikimedia.org/wiki/File:2012-02-13_Agaricus_campestris_L_199588.jpg)                | Byrain (Mushroom Observer)          | CC BY-SA 3.0    |
| [Opieńka miodowa](<https://commons.wikimedia.org/wiki/File:Armillaria_mellea_PN1_(5).jpg>)                            | Jerzy Opioła                        | CC BY-SA 4.0    |
| [Mleczaj rydz](https://commons.wikimedia.org/wiki/File:Lactarius_deliciosus.jpg)                                      | Eric Steinert                       | CC BY-SA 3.0    |
| [Smardz jadalny](https://commons.wikimedia.org/wiki/File:2011-04-30_Morchella_esculenta.jpg)                          | Andreas Kunze                       | CC BY-SA 3.0    |
| [Purchawka chropowata](https://commons.wikimedia.org/wiki/File:Lycoperdon_perlatum_a3.jpg)                            | Jerzy Opioła                        | CC BY-SA 4.0    |
| [Goryczak żółciowy](https://commons.wikimedia.org/wiki/File:Tylopilus_felleus_060914c.jpg)                            | bernd gliwa                         | CC BY-SA 2.5    |
| [Lisówka pomarańczowa](https://commons.wikimedia.org/wiki/File:Hygrophoropsis_aurantiaca_B%C5%BB5.2.jpg)              | Jerzy Opioła                        | CC BY-SA 3.0    |
| [Muchomor czerwony](https://commons.wikimedia.org/wiki/File:Amanita_muscaria_3_vliegenzwammen_op_rij.jpg)             | Onderwijsgek                        | CC BY-SA 3.0 nl |
| [Muchomor plamisty](https://commons.wikimedia.org/wiki/File:Amanita_pantherina_ts4.jpg)                               | Tomasz Sobczak                      | CC BY-SA 4.0    |
| [Maślanka wiązkowa](https://commons.wikimedia.org/wiki/File:Hypholoma_fasciculare_LC0091.jpg)                         | Jörg Hempel                         | CC BY-SA 2.0 de |
| [Mleczaj wełnianka](https://commons.wikimedia.org/wiki/File:Lactarius_torminosus_G2.jpg)                              | Jerzy Opioła                        | CC BY-SA 3.0    |
| [Tęgoskór pospolity](<https://commons.wikimedia.org/wiki/File:Earthballs_(908565114).jpg>)                            | Jason Hollinger                     | CC BY 2.0       |
| [Pieczarka karbolowa](https://commons.wikimedia.org/wiki/File:2010-11-13_Agaricus_xanthodermus_Genev_120348_crop.jpg) | Lord Mayonnaise (Mushroom Observer) | CC BY-SA 3.0    |
| [Krowiak podwinięty](https://commons.wikimedia.org/wiki/File:Paxillus_involutus_G2.jpg)                               | Selso                               | CC BY-SA 3.0    |
| [Muchomor sromotnikowy](<https://commons.wikimedia.org/wiki/File:Amanita_phalloides_a1_(1).JPG>)                      | Jerzy Opioła                        | CC BY-SA 4.0    |
| [Muchomor jadowity](<https://commons.wikimedia.org/wiki/File:Amanita_virosa_a1_(7).JPG>)                              | Jerzy Opioła                        | CC BY-SA 4.0    |
| [Hełmówka jadowita](https://commons.wikimedia.org/wiki/File:Galerina_marginata_61108.jpg)                             | Dan Molter (Mushroom Observer)      | CC BY-SA 3.0    |
| [Piestrzenica kasztanowata](https://commons.wikimedia.org/wiki/File:Gyromitra_esculenta_BPN1.jpg)                     | Jerzy Opioła                        | CC BY-SA 4.0    |

**Fonty** (licencja [SIL Open Font License 1.1](https://openfontlicense.org), pliki licencji w `assets/fonts/`):

- [Fraunces](https://github.com/undercasetype/Fraunces) – The Fraunces Project Authors,
- [IBM Plex Mono](https://github.com/IBM/plex) – IBM Corp.

## Zastrzeżenie

Aplikacja ma charakter edukacyjny i **nie zastępuje konsultacji z grzyboznawcą**. Nigdy nie jedz grzyba, którego nie jesteś w 100% pewien.
