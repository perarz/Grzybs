# Grzybnik 🍄

Aplikacja grzybiarza z dwiema zakładkami: **Start** i **Mapa**. Start otwiera atlas, naukę i kolekcję własnych znalezisk, pokazuje też grzyba dnia. Mapa przechowuje prywatne miejscówki i punkt auta. Dolny pasek pozostaje widoczny także w atlasie, nauce i szczegółach grzyba. Dane lokalne i atlas działają offline; pogoda i kafelki mapy wymagają internetu.

> Projekt powstał jako zadanie rekrutacyjne do Software Mansion.

<!-- TODO: GIF / zrzuty ekranu -->

## Platforma i testy

- **Przygotowana głównie pod:** Android
- **Testowana na fizycznym urządzeniu:** TODO (uzupełnić przed oddaniem)
- **Emulator:** Android Studio, Medium Phone (API 37), Expo Go 58.0.5. Pierwszy start i ekran Start sprawdzone 2026-11-21; pozostałe ekrany czekają na przegląd na urządzeniu.
- **Kontrole automatyczne:** lint, TypeScript i 123 testy przechodzą (2026-11-21). Eksport Android/Hermes i iOS/Hermes potwierdzony 2026-11-19.

## Nawigacja i wygląd

- **Start:** Atlas, Nauka, grzyb dnia i ostatnie zdjęcia; zębatka otwiera ustawienia.
- **Atlas i Nauka:** osobne ekrany w stosie Startu. Strzałka wraca do poprzedniego ekranu; naciśnięcie aktywnej zakładki Start wraca na początek.
- **Twoje odkrycia:** własna galeria z dodawaniem zdjęć i przejściem do gatunku.
- **Mapa:** pogoda i ostrzeżenie o zachodzie u góry, dodawanie po lewej, zapisane miejsca i GPS po prawej.
- Kierunek i kontrola jakości: `docs/ui-direction.md`. Redesign z 2026-11-15 wymaga jeszcze sprawdzenia wizualnego na urządzeniu.

## Funkcje

| Moduł  | Opis                                                                                        | Status           |
| ------ | ------------------------------------------------------------------------------------------- | ---------------- |
| Atlas  | 26 gatunków, klucz do oznaczania, sobowtóry, kolekcja własnych zdjęć, filtr odkryć i źródła | Zaimplementowany |
| Nauka  | Grzyb dnia, quiz, sobowtóry, wyjaśnienia i lokalne statystyki                               | Zaimplementowana |
| Pogoda | Prognoza na 3 dni, automatyczne pobieranie, pamięć offline i oznaczenie starszych danych    | Zaimplementowana |
| Mapa   | Miejscówki, parkowanie, kompas i odległość do auta, ostrzeżenie o zachodzie                 | Zaimplementowana |

Kontrole automatyczne i eksport pakietów nie zastępują testów natywnego GPS, aparatu,
haptyki i wyglądu na telefonie. Te scenariusze pozostają do weryfikacji.

## Uruchomienie

Wymagania: Node.js LTS (wersja w `.nvmrc`), npm.

```bash
npm install
npx expo start
```

- **Emulator Androida:** uruchom emulator w Android Studio, potem w terminalu z `expo start` naciśnij `a` (Expo CLI sam zainstaluje Expo Go).
- **Telefon:** zainstaluj Expo Go ze sklepu i zeskanuj kod QR z terminala.
- **Gdy Expo Go ma już otwarty inny projekt** (albo tę apkę spod innego adresu, np. po szybkim rozruchu emulatora), Expo Go 58 na Androidzie nie daje jej bazy SQLite. Apka wykrywa to przy starcie i raz sama się przeładowuje; jeśli to nie pomoże, pokazuje ekran z prośbą o zamknięcie Expo Go. Szczegóły: `docs/expo-startup-investigation.md`.

## Skrypty

| Komenda             | Co robi                                           |
| ------------------- | ------------------------------------------------- |
| `npm start`         | serwer deweloperski Expo                          |
| `npm run lint`      | ESLint + Prettier                                 |
| `npm run typecheck` | sprawdzenie typów (tsc)                           |
| `npm run format`    | formatowanie kodu Prettier                        |
| `npm test`          | testy logiki, danych, SQLite i scenariuszy błędów |

## Stack

Expo SDK 58 · React Native 0.88 · TypeScript (strict) · expo-router · Reanimated · Gesture Handler · react-native-svg · expo-haptics · react-native-maps · expo-location · expo-sensors · expo-image-picker · expo-sqlite · zustand · suncalc

## Struktura

```
src/app/         ekrany (expo-router), zakładki w (tabs)/
src/components/  współdzielone komponenty UI
src/features/    logika funkcji (atlas, collection, learn, spots, navigation, safety, feedback, weather, onboarding, startup)
src/db/          SQLite: połączenie i migracje
src/data/        statyczne dane gatunków
src/theme/       kolory (jasny/ciemny), typografia, odstępy, ruch
```

## Decyzje techniczne

- **Offline-first:** dane użytkownika w SQLite z wersjonowanymi migracjami (`PRAGMA user_version`); sieci wymagają kafelki mapy, pobieranie nowej pogody i otwierane źródła.
- **Expo Go:** wyłącznie biblioteki dostępne w Expo Go – aplikację da się uruchomić bez budowania natywnego.
- **Odporność na błędy:** globalny `ErrorBoundary` z przyciskiem „Spróbuj ponownie” zamiast crasha. Wejście `index.ts` sprawdza moduły natywne, zanim wczyta router i bazę – obejście znanego błędu Expo Go 58 bez czerwonego ekranu.
- **Wygląd „las”:** domyślnie ciemna zieleń z akcentem koloru kurki, niezależnie od ustawień telefonu, proste, wspólne nagłówki i duże zdjęcia gatunków na ekranie Start. Nagłówki i nazwy krojem Oswald, tekst krojem Source Sans Pro, łacina kursywą Fraunces, etykiety maszynowym IBM Plex Mono, jadalność jako pieczątka, krótkie opisy i karty z fotografiami.
- **Klucz do oznaczania:** zamiast panelu filtrów – pytania krok po kroku w wysuwanym arkuszu (spód kapelusza, kolor, pierścień, pochwa, zmiana barwy, siedlisko). Każda odpowiedź ma ilustrację i liczbę gatunków, które zostaną; odpowiedzi prowadzące donikąd są wyszarzone.
- **Ruch i dotyk:** każdy klikalny element ugina się na sprężynie i odpowiada haptyką (`expo-haptics`), duże tytuły zwijają się w pasek jak w iOS, karty płynnie przestawiają się przy filtrowaniu (Reanimated – layout animations i CSS transitions).
- **Źródła w aplikacji:** panel „O atlasie” w zakładce Atlas zawiera materiały źródłowe, autorów i licencje wszystkich zdjęć oraz fontów. Informacje są dostępne offline; odnośniki otwierają przeglądarkę.

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

- [Oswald](https://github.com/googlefonts/OswaldFont) – The Oswald Project Authors,
- [Source Sans Pro](https://github.com/adobe-fonts/source-sans) – Adobe,
- [Fraunces](https://github.com/undercasetype/Fraunces) – The Fraunces Project Authors,
- [IBM Plex Mono](https://github.com/IBM/plex) – IBM Corp.

## Zastrzeżenie

Aplikacja ma charakter edukacyjny i **nie zastępuje konsultacji z grzyboznawcą**. Nigdy nie jedz grzyba, którego nie jesteś w 100% pewien.

## Kolekcja znalezisk

W atlasie wybierz „Dodaj znalezisko”: zdjęcie z aparatu lub galerii → ręczny wybór
gatunku → sprawdzenie cech groźnych sobowtórów → zapis. Zdjęcie nie jest rozpoznawane
automatycznie. Odblokowanie nie potwierdza identyfikacji ani jadalności.

Zdjęcia są kopiowane do dokumentów aplikacji, a obserwacje do SQLite. Wiele znalezisk
tego samego gatunku zwiększa liczbę obserwacji, ale nie licznik odkrytych gatunków.
Własne zdjęcia można obejrzeć na stronie gatunku także offline.

`npm test` uruchamia testy logiki i scenariuszy błędów, bez dodatkowych bibliotek
testowych. Natywne API aparatu, plików i lokalizacji są zastępowane atrapami;
operacje SQLite są również testowane na prawdziwej bazie w pamięci. `npm run lint` i `npm run typecheck` sprawdzają kod.

Do sprawdzenia w Expo Go (telefon i emulator Androida): anulowanie wyboru zdjęcia,
odmowa dostępu do aparatu, zapis gatunku bez groźnych sobowtórów i z nimi, ponowne
znalezisko tego samego gatunku oraz zachowanie zdjęć i postępu po restarcie offline.
Test wyglądu i natywnych modułów Etapu 4 pozostaje do wykonania.

## Nauka

Zakładka Nauka zawiera grzyba dnia, quiz nazw i budowy oraz grę Sobowtór. Rundy
mają pięć pytań bez limitu czasu. Po odpowiedzi widać wyjaśnienie; ukończone rundy
zapisują liczbę sesji i najlepszy wynik procentowy osobno dla każdego trybu.
Pytania korzystają z danych atlasu, a nauka działa bez internetu.

Statystyki są lokalne w SQLite. Powtórzenie zapisu tej samej rundy nie dubluje
wyniku. Przerwana przed końcem runda nie trafia do statystyk.

Testy statystyk używają `node:sqlite` (Node 22.13+; projekt sprawdzony na Node 26),
bez nowych zależności. Sprawdzają migrację istniejącej bazy i ponawianie zapisu.

Test ręczny w Expo Go: ukończ oba tryby, sprawdź poprawną i błędną odpowiedź,
kliknij szybko dwukrotnie, rozpocznij kolejną rundę i sprawdź rekord po restarcie
w trybie samolotowym. Zamknij niedokończoną rundę — liczba ukończonych nie powinna
wzrosnąć. Otwórz szczegóły grzyba dnia. Ocena UI na urządzeniu pozostaje do wykonania.

## Mapa i notatnik terenowy

Miejscówki i punkt parkowania są prywatnymi zapisami w lokalnym SQLite. Można
wskazać punkt przytrzymaniem mapy lub użyć świeżej pozycji GPS, nadać nazwę
i notatkę, a następnie edytować lub usunąć wpis. Zapis auta zastępuje poprzedni
punkt dopiero po potwierdzeniu.

GPS uruchamia się po otwarciu mapy za zgodą użytkownika i działa tylko na widocznym ekranie mapy, gdy
aplikacja jest na pierwszym planie. Po wyjściu z mapy lub przejściu w tło
śledzenie ustaje. Zapis z GPS wymaga pozycji nie starszej niż 60 sekund
i deklarowanej dokładności do 100 metrów.

Powrót pokazuje odległość w linii prostej i kierunek do auta — nie wyznacza
trasy pieszej i nie zna przeszkód terenowych. Przy braku wiarygodnego kompasu
pozostaje kierunek względem północy oraz zapisane współrzędne.

Kafelki mapy wymagają sieci i dostępnego dostawcy map. Miejsca, notatki oraz
obliczenia kierunku, odległości i zachodu słońca pozostają lokalne. Ostrzeżenie
o zachodzie działa na ekranie mapy; aplikacja nie wysyła powiadomień w tle.

Mapy działają w Expo Go bez własnego klucza. Własny build Androida wymaga
osobnej konfiguracji klucza Google Maps — nie dodano ani nie opublikowano kluczy.
Natywny GPS, kompas i wygląd mapy wymagają jeszcze sprawdzenia na urządzeniu.

## Pogoda przed wyprawą

Na mapie można rozwinąć lub zwinąć tabelę z temperaturą, opadami i wiatrem.
Pokazuje bieżącą godzinę, godzinę za dwie godziny oraz jutro o 12:00 w strefie czasowej miejsca.
Miejsce wybierane jest kolejno: wskazany punkt, świeży GPS, zaparkowane auto lub pierwsza
zapisana miejscówka. Panel pokazuje używaną lokalizację. Obok pogody jest orientacyjny indeks warunków 1–10.
Wykorzystuje sumę opadów, liczbę dni z opadem i temperaturę z siedmiu zakończonych dni.
Dla strefy Europe/Warsaw uwzględnia również odsetek gatunków atlasu w sezonie.
Progi są heurystyką aplikacji. Przy braku pełnej historii lub po zmianie dnia indeks nie wyświetla oceny.

Po otwarciu mapy aplikacja pobiera brakującą lub nieaktualną prognozę. Ikona odświeżania pozwala ponowić pobranie. Do dostawcy
trafiają współrzędne zaokrąglone do dwóch miejsc po przecinku, bez nazw miejsc, notatek
ani zdjęć. SQLite przechowuje ostatnie prognozy dla maksymalnie 10 obszarów. Dane starsze
niż 6 godzin lub obejmujące wcześniejszy dzień są oznaczone jako nieaktualne. Brak sieci
nie usuwa zapisanej prognozy; brakujące pomiary nie są zamieniane na zero.

Źródło: [Open-Meteo](https://open-meteo.com/), dane na licencji
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Projekt korzysta z bezpłatnego API do zastosowań niekomercyjnych; przed komercyjnym
wydaniem należy dostosować dostęp do [warunków dostawcy](https://open-meteo.com/en/terms).
Testy używają kontrolowanych odpowiedzi API i prawdziwego SQLite w pamięci; nie
potwierdzają działania sieci ani wyglądu prognozy na urządzeniu.

### Powiadomienia o warunkach na grzyby

W panelu pod `?` przy indeksie jest przełącznik „Daj znać, gdy warto”.
Alert wymaga indeksu co najmniej 7/10, prognozy nie starszej niż 6 godzin,
czasu lokalnego 8:00–16:59 oraz więcej niż godziny do zachodu słońca (po wschodzie).
Maksymalnie jeden alert dziennie, z dodatkową przerwą co najmniej 20 godzin.
Powiadomienie otwiera mapę. Wynik jest orientacyjną oceną warunków, nie gwarancją wysypu.

Zadanie w tle sprawdza pogodę nie częściej niż co godzinę; termin wykonania wybiera system.
Korzysta z ostatnio wybranego obszaru (współrzędne zaokrąglone do 0,01°), bez GPS w tle.
Po 7 dniach bez aktualizacji okolicy na mapie alerty milkną. Wyłączenie przełącznika
zatrzymuje zadanie. Bez zgody na powiadomienia alerty nie są wysyłane.

Pełne działanie wymaga własnego development/release buildu. Expo Go na Androidzie
nie udostępnia TaskManager, a na iOS nie obsługuje jego pracy w tle; UI informuje o
niedostępności przy próbie włączenia. W Expo Go moduł powiadomień nie jest nawet wczytywany, więc start nie wypisuje jego ostrzeżeń. System może opóźnić lub pominąć zadanie,
szczególnie po wymuszonym zamknięciu aplikacji. Nie planujemy powtarzanego alertu
na stałą godzinę ze starymi warunkami. Dostarczenie w tle wymaga testu na fizycznym
telefonie w samodzielnym buildzie.

### Pierwsze uruchomienie

Krótki onboarding pozwala wybrać doświadczenie i przejść 4 pytania (6 dla „Starego wyjadacza”).
Pytanie humorystyczne nie liczy się do wyniku. Quiz można pominąć. Ponowny pierwszy start jest dostępny przez ukryty reset deweloperski. Profil jest zapisany lokalnie w SQLite (migracje 5–6).
Nauka otwiera wspólną ścieżkę kroków. Wynik onboardingu to rozgrzewka,
nie potwierdzenie umiejętności oznaczania jadalnych grzybów.

Jedyny reset pierwszego uruchomienia: trzy kliknięcia dużego napisu „Atlas” w ciągu
2 sekund, tylko w wersji deweloperskiej. Usuwa wyłącznie profil onboardingu.
Nie ma resetu w Nauce, gestu przytrzymania ani opcji w menu deweloperskim.

Poziom „Pierwszy koszyk” ma osobny zestaw: wybór zdjęcia, prawda/fałsz,
sytuacja terenowa i pytanie o budowę grzyba. Wszystkie cztery odpowiedzi liczą się do wyniku.
Zdjęcia korzystają z lokalnego atlasu i zachowują podpisy autorów/licencje.
Treści o budowie: https://www.gov.pl/web/wsse-rzeszow/obziz-bezpieczne-grzybobranie
oraz materiały „Grzyby polskich lasów” Lasów Państwowych.

### Ścieżka nauki i passa

Nauka ma 50 kroków: po 10 między sześcioma rangami, od Początkującego do
Zaawansowanego. Pięć etapów ma konkretne tematy: borowik, podgrzybek, pieprznik,
kania i pieczarka. Każdy krok zaczyna się od krótkiej lekcji, potem sprawdza właśnie
poznane cechy. Zdjęcia, schematy spodu, porównania sobowtórów i kalendarz sezonu
stanowią materiał do ćwiczeń. Powtórka i sprawdzian używają wyłącznie zagadnień
poznanych wcześniej w etapie, bez losowania nieomówionych gatunków.
Nie ma osobnych kafelków trybów ani awansu za XP. Ranga oznacza postęp w kursie.

Zaliczenie wymaga wszystkich poprawnych odpowiedzi. W trakcie ćwiczenia można
wrócić do wskazówki, zachowując dotychczasowe odpowiedzi. Nieudana próba prowadzi
z powrotem do materiału, a potem pozwala spróbować ponownie. Zadanie terenowe korzysta z sezonu gatunku referencyjnego
etapu w atlasie. Poza sezonem zastępuje je rozpoznawanie zdjęcia; w sezonie również
można wybrać ćwiczenie w domu. Własne zdjęcie trafia do kolekcji przez standardowy
formularz z ręcznym wyborem gatunku i potwierdzeniem zasad bezpieczeństwa.

Migracje 7–8 dodają `course_steps` i dzienną aktywność `course_activity`. Transakcja pozwala zapisać wyłącznie kolejny krok;
ponowienie zapisu nie zmienia daty ani nie dubluje postępu. Dawne wyniki pozostają
w `learning_sessions` i liczą się do historii passy, ale nie odblokowują kroków kursu.
Ponowne zaliczenie ukończonego kroku także podtrzymuje passę, bez ponownego awansu.

Pierwszy zaliczony krok lub powtórka danego dnia przedłuża passę. Seria z wczoraj pozostaje
aktywna do końca dzisiejszego dnia; pominięty dzień zeruje passę, zachowując postęp.
Daty używają lokalnej strefy telefonu. Postęp odświeża się po powrocie do Nauki,
a zegar passy również po wznowieniu aplikacji i co minutę.
