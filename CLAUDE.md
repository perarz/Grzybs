# Grzybnik – zasady projektu

Uniwersalna aplikacja grzybiarza (zadanie rekrutacyjne Software Mansion) z dwiema zakładkami:
**Start** (Atlas, Nauka, kolekcja zdjęć i ustawienia) oraz **Mapa** (miejscówki, pogoda, powrót do auta).
Atlas obejmuje gatunki i sobowtóry; Nauka — ścieżkę 50 kolejnych kroków, krótkie lekcje przed ćwiczeniami, tematyczne etapy i dzienną passę.
React Native + Expo (SDK 58) + TypeScript + expo-router. Główny cel: emulator Androida i Expo Go.
Interfejs po polsku, kod, nazwy plików i commity po angielsku.

Autor uczy się Reacta w trakcie projektu – kod ma być **prosty, czytelny i solidny**.

@AGENTS.md

## Wymagania zadania (Software Mansion) – nadrzędne

Treść zadania jest najważniejszym punktem odniesienia przy każdej decyzji.

- React Native + Expo. Ocena odbywa się **głównie na emulatorze Androida** – pierwszy start przez `npx expo start` + `a` musi działać bez błędów i ostrzeżeń.
- Oddanie: **publiczne repozytorium na GitHubie**; README.md z krótkim opisem funkcji, instrukcją uruchomienia oraz nagraniem (GIF / MP4) lub zrzutami działającej aplikacji. README musi podać główny system (Android) i czy aplikację testowano na fizycznym urządzeniu (tylko zgodnie z prawdą – potwierdza autor).
- Kryteria: jakość, czytelność i organizacja kodu; funkcjonalność i intuicyjność (UX); estetyka (UI) i płynność; nakład pracy i poziom techniczny.
- Dodatkowo punktowane: przemyślany UI/UX, płynne mikroanimacje i detale, nieszablonowe podejście (np. filtrowanie cech grzyba, alerty o gatunkach trujących), zapis offline, czytelna struktura i kultura pracy z kodem.

## Projektowanie UI — preferencja autora

- Przy każdym zadaniu dotyczącym UI/UX korzystaj ze skilla `design-mobile-apps` wskazanego przez autora: https://github.com/designed-by-ai/skills (folder `skills/design-mobile-apps`). Przeczytaj jego `SKILL.md` przed projektowaniem.
- Instalacja wskazana przez autora: `npx skills add https://github.com/designed-by-ai/skills --skill design-mobile-apps`.
- Stan na 2026-11-15: potwierdzono lokalną instalację i przeczytano `/Users/kacper/.agents/skills/design-mobile-apps/SKILL.md`. W tym samym katalogu są `designing.md`, `implementing.md`, `endpoints.md` i `styling/`. Czytaj te pliki zgodnie z zadaniem. Skill wymaga połączenia z usługą Sleek; w sesji sprawdzającej `SLEEK_API_KEY` nie był skonfigurowany. Sprawdź aktualny stan autoryzacji przed użyciem API; nie utożsamiaj instalacji skilla z połączeniem konta.
- Autor zdecydował 2026-11-15, że nie podłącza konta Sleek. Stosuj lokalne wskazówki projektowania i wdrażania tego skilla bez API Sleek; nie ponawiaj autoryzacji. Nie zapisuj kluczy API w repozytorium.
- Kierunek UI i przegląd względem skilla: `docs/ui-direction.md`. Dwie zakładki: Start i Mapa. Start zawiera stos Atlasu, Nauki, kolekcji, szczegółów i ustawień, z widocznym dolnym paskiem.

## Zasady kodu

- Najprostsze rozwiązanie, które działa. Zero abstrakcji „na zapas”.
- Jeden komponent = jedna odpowiedzialność. Plik > ~150 linii → podziel (nie dotyczy statycznych danych w `src/data`).
- Logika (obliczenia, baza, API) poza komponentami: `src/features/*/` jako funkcje lub hooki.
- Czytelne nazwy zamiast komentarzy; komentarz tylko, gdy wyjaśnia „dlaczego”.
- TypeScript strict, zero `any`.
- Style tylko przez tokeny z `src/theme` (kolory, odstępy, typografia, promienie, ruch) – żadnych „magicznych” wartości w komponentach.
- Wygląd „las”: domyślnie ciemna zieleń na każdym telefonie, niezależnie od jego ustawień (`useTheme` zwraca `palette.dark`, `app.json`: `dark`), akcent w kolorze kurki; proste nagłówki i ciemnozielony pasek zakładek; Oswald (nagłówki), Source Sans Pro (treść), kursywa Fraunces (łacina), IBM Plex Mono (etykiety), umiarkowane promienie. Unikaj szablonowego wyglądu (pigułki, duże promienie, generyczne palety). Wybór z wielu opcji – krok po kroku w `BottomSheet`, nie wielkie panele.
- Kolory: `accent` tylko na tekst i cienkie linie na tle strony, `glow` + `onGlow` na wypełnienia i elementy na ciemnych powierzchniach. Kontrast: min. 4,5:1 dla tekstu, 3:1 dla grafiki. Jasna paleta w `colors.ts` jest teraz nieużywana – to zapas na ewentualny przełącznik.
- Wszystko klikalne przez `PressableScale` (sprężyna + haptyka); zmiany stanu animowane (Reanimated), nie skokowe. Wyjątek: pasek zakładek jest stale na ekranie, więc rusza się spokojnie – `withTiming`, bez sprężyn i bez uginania (sprężyny były tam dla autora zbyt rozbujane).
- Wszystko, co może zawieść (lokalizacja, czujniki, sieć, baza, uprawnienia), ma obsługę błędu i stan zastępczy – aplikacja nigdy się nie crashuje.
- Offline-first: dane użytkownika w SQLite (`src/db`); lokalne funkcje działają bez sieci; wyjątki: kafelki mapy, pobieranie pogody i otwierane źródła.
- Zdjęcie nie rozpoznaje grzyba automatycznie – jest „dowodem znaleziska”; gatunek wybiera użytkownik, a przy groźnym sobowtórze potwierdza cechy.

## Biblioteki

- Instalacja tylko przez `npx expo install <pakiet>` (dev: `npx expo install <pakiet> -- --save-dev`).
- Wszystko musi działać w **Expo Go** – żadnych modułów wymagających development builda.
- Nowa biblioteka – tylko po zapytaniu autora.

## Treści o grzybach

- Fakty (jadalność, toksyczność, sobowtóry) muszą być prawdziwe. Przy braku pewności – oznacz `TODO: verify`, nie zgaduj.
- Zdjęcia tylko na wolnej licencji (np. Wikimedia Commons) z zapisanym autorem i licencją (sekcja źródeł w aplikacji i README) – albo własne ilustracje SVG.

## Struktura

```
src/app/            ekrany i layouty (expo-router); (tabs)/ = (home) (Start i stos ekranów), map (Mapa); (home)/atlas, learn, collection, settings, species/[id], compare
src/components/     współdzielone komponenty UI; podfoldery: atlas, species, compare, key, forest, icons
src/features/       logika per funkcja: atlas, collection, learn, spots, navigation, safety, weather, onboarding, feedback (haptyka), startup
src/db/             SQLite: połączenie, migracje
src/data/           statyczne dane (gatunki, sobowtóry, zdjęcia)
src/theme/          kolory (jasny/ciemny), typografia i fonty, odstępy, promienie, ruch, próbki kolorów
```

Wejście aplikacji: `index.ts` (sprawdza moduły natywne, potem `expo-router/entry`). Import przez alias `@/` → `src/`.

## Workflow

- Małe kroki. Po każdym: `npm run lint` + `npm run typecheck` + commit (`feat:` / `fix:` / `chore:` / `refactor:`).
- Po etapie krótko podsumuj faktyczne zmiany i wyniki testów. Bez zadań domowych, odpytywania autora i pytań sprawdzających — autor wyraźnie z nich zrezygnował. Pracuj samodzielnie w zakresie bieżącego polecenia.
- Z autorem rozmawiaj po polsku, krótko i prostym językiem. Pisze bezpośrednio i ocenia wygląd po efekcie, więc zmiany UI sprawdź zrzutem z emulatora, zanim powiesz, że są gotowe.

## Plan etapów

- Etap 0 – Setup ✅
- Etap 1 – Test 3D ✅ → porzucony (proceduralne modele wyglądały zbyt słabo – zamiast nich zdjęcia)
- Etap 2 – Dane 26 gatunków (cechy, sezony, sobowtóry, zdjęcia na wolnej licencji) ✅
- Etap 3 – Atlas: karty, kategorie, wyszukiwarka, klucz do oznaczania; ekran gatunku (zegar sezonu, sobowtóry z alertem, suwak porównania) ✅
- Etap 4 – Odblokowywanie zdjęciem: zaimplementowane; oczekuje testu w Expo Go i oceny wyglądu
- Etap 5 – Nauka: grzyb dnia, gra „Sobowtór”, quiz, zapis wyników — zaimplementowane; oczekuje testu UI w Expo Go
- Etap 6 – Mapa: miejscówki, parkowanie, kierunek/odległość do auta, ostrzeżenie o zachodzie, obsługa GPS — zaimplementowane; bez natywnego testu UI
- Etap 7 – Źródła i szlif: panel źródeł, przegląd błędów i testy regresji zaimplementowane; weryfikacja treści i testy natywne nadal otwarte
- Etap 8 – Indeks grzybowy 1–10 i pogoda: prognoza na 3 dni z pamięcią offline zaimplementowana; test natywnego UI otwarty
- Etap 9 – README

## Komendy

```bash
npx expo start          # serwer deweloperski (a = emulator Androida, QR = Expo Go)
npm run lint            # ESLint + Prettier
npm run typecheck       # tsc --noEmit
npm run format          # Prettier – formatowanie wszystkich plików
npm test                # testy jednostkowe czystych funkcji (gdy dojdą)
```

## Stan projektu (2026-11-21)

- Gotowe: etapy 0–8 i przebudowa wyglądu, wszystko w commitach na `main` (etapy 4–8 zacommitowane 2026-11-21 jako jeden commit). Repo nie ma zdalnego – GitHub tylko na prośbę autora.
- Start w Expo Go: błąd `Cannot find native module 'ExpoSQLite'` przy pierwszym `npx expo start` + `a` naprawiony 2026-11-21 (`index.ts` + `src/features/startup`, opis w `docs/expo-startup-investigation.md`). Pierwszy start nie wypisuje już ostrzeżeń routera ani `expo-notifications`.
- Etap 4: aparat/galeria, ręczny wybór, kontrola cech groźnych sobowtórów, zapis zdjęć w dokumentach aplikacji i SQLite, licznik unikalnych gatunków, oznaczenia kart, zdjęcia na stronie gatunku.
- Etap 5: codzienny gatunek, quiz cech/nazw łacińskich, sobowtóry, losowane rundy po 5 pytań z wyjaśnieniami, najlepszy wynik i liczba rund w SQLite. Migracja 2 dodaje `learning_sessions`, nie zmienia tabel znalezisk. Identyfikator rundy chroni przed podwójnym naliczaniem po ponowieniu zapisu.
- Etap 6: mapa Google/Apple w Expo Go, dodawanie/edycja/usuwanie miejscówek, zapis auta z potwierdzeniem zastąpienia, współrzędne offline, odległość/azymut oraz true-heading kompas z fallbackiem. GPS automatycznie po otwarciu mapy za zgodą użytkownika; timeout, odmowa zgody, błędy i restart śledzenia obsłużone. Zapis GPS wymaga <=60 s i dokładności <=100 m. Ostrzeżenie o zachodzie z SunCalc działa tylko przy otwartej mapie, bez powiadomień w tle.
- UI: mapa jako notatnik terenowy, ciemna mapa, tarcza kompasu, lista punktów, panel dodawania. Atlas ma filtr „Moje odkrycia”, mocniejsze wyróżnienie odkrytych kart i licznik obserwacji.
- Etap 7: panel „O atlasie” z materiałami, 26 autorami/licencjami zdjęć i fontami; poprawki opóźnionych odczytów GPS, wygasania kompasu, kolejkowanych kliknięć quizu, odzyskiwania zdjęcia i niedostępnego pliku. README odpowiada aktualnym funkcjom.
- Etap 8: Open-Meteo, prognoza 3 dni (temperatura, opady, prawdopodobieństwo, wiatr), automatyczne pobieranie na mapie i ręczne odświeżanie ikoną; współrzędne zaokrąglone do 2 miejsc. Migracja 3 dodaje weather_cache (10 obszarów), starsze niż 6 h lub poprzedni dzień dane oznaczone jako nieaktualne. Timeout, anulowanie, błędy sieci/zapisu oraz zmiana miejsca obsłużone. Orientacyjny indeks 1–10 ocenia warunki na podstawie poprzednich 7 dni. Bezpłatne API niekomercyjne; warunki opisane w README.
- Szlif UI: kompaktowy nagłówek lasu, uproszczona góra Atlasu, zdjęcia do krawędzi kart, siatka 1–3 kolumn zależna od szerokości i skali fontu; treść maks. 720 px, spokojniejsze przyciski pomocnicze i cele dotykowe 48 px. Nauka, pogoda i powrót do auta mają ujednoliconą hierarchię. Zmiany wymagają wizualnej weryfikacji na urządzeniu.
- Następny krok: natywna weryfikacja dotychczasowych funkcji, pozostałe TODO treści i ewentualne bonusy, gdy podstawy zostaną ocenione wizualnie. Użytkownik daje swobodę pracy z maksymalnie dwoma subagentami i nie chce zadań ani odpytywania.
- Test wizualny 2026-11-21 (emulator, ADB działa): pierwszy start, ekran Start, ekran awaryjny startu. Pozostałe ekrany po przebudowie 2026-11-15 nadal czekają na przegląd na urządzeniu.
- Pod Etap 4 są już: tabela `finds` (`src/db/migrations.ts`), wielokrotnego użytku `BottomSheet`, zainstalowane `expo-image-picker` i `expo-file-system`.
- Kompas korzysta z `expo-location.watchHeadingAsync`; nieużywane `zustand`, `expo-sensors` i `@types/suncalc` usunięto 2026-11-21.

Otwarte sprawy:

- Odzyskiwanie zdjęcia po odtworzeniu aplikacji jest teraz automatyczne; przetestowano scenariusz na atrapach, bez fizycznego aparatu.

- `src/data/species.ts`: miesiące krowiaka mają `TODO: verify`.
- Panel źródeł jest dostępny w Atlasie. Metadane zdjęć są kompletne; testy danych nie stanowią merytorycznej weryfikacji całego atlasu.
- Haptyka nie jest potwierdzona na fizycznym telefonie, a emulator jej nie odda.
- README: zrzuty ekranu i wpis o testach na fizycznym urządzeniu mają `TODO`.
- 2026-11-19 autor podał, że ma 3 dni do oddania. Priorytet: stabilność, dopracowanie istniejących funkcji i natywna weryfikacja.
- `npm test`: 123 testy (2026-11-21) – kolekcja, pytania, ścieżka nauki, migracje/statystyki, miejsca, geometria, światło dzienne, GPS, pogoda, trasy i start w Expo Go. Testy statystyk używają prawdziwego SQLite w pamięci przez `node:sqlite` (Node 22.13+; na tej maszynie Node 26). Testy kolekcji nadal używają atrap modułów natywnych.

## Uruchamianie (Mac autora)

- `ANDROID_HOME` jest w `~/.zshrc`, więc w nowym terminalu `a` w `npx expo start` sam włącza emulator (AVD `Medium_Phone_API_37.0`). Serwer uruchomiony przed tą zmianą tego nie umie.
- Powłoka agenta może nie wczytać `~/.zshrc`: wtedy `source ~/.nvm/nvm.sh` przed `npx`/`npm` i pełna ścieżka `~/Library/Android/sdk/platform-tools/adb`.
- Otwieranie apki przez adb: `adb shell am force-stop host.exp.exponent`, potem `adb shell am start -a android.intent.action.VIEW -d "<adres exp:// z terminala>"`. Konkretny ekran: `<adres>/--/species/amanita-phalloides`.
- Zrzut ekranu: `adb exec-out screencap -p > plik.png`. Po otwarciu apki poczekaj na załadowanie (kilkanaście sekund po przeładowaniu), zanim wyślesz kliknięcia lub zrobisz zrzut – inaczej klawisz wstecz wychodzi z apki, a zdjęcia są jeszcze puste.

Pułapki:

- Expo Go 58 (Android) daje moduły v2 (`expo-sqlite`, `expo-haptics`, `expo-application`) tylko pierwszemu silnikowi JS w procesie. Apka sama to naprawia przy starcie (jedno przeładowanie, potem ekran „Expo Go potrzebuje restartu”). Nie importuj niczego z aplikacji w `index.ts` przed `hasNativeModules()`.
- Otwarcie apki w chwili startu emulatora zostawia Expo Go na kółku ładowania, bez żądania do Metro. Poczekaj na sieć i otwórz ponownie.
- Typy tras (`typedRoutes`) generuje działający serwer – po dodaniu trasy musi być uruchomiony, zanim odpalisz `typecheck`.

## Uwagi techniczne (sprawdzone na tym SDK)

- `Link asChild` gubi styl podany jako funkcja – karty robimy przez `PressableScale` i `router.push`.
- Reanimated z React Compiler: `.get()` / `.set()` zamiast `.value`. Przejścia kolorów i obrotów: CSS transitions z Reanimated 4.
- Gesture Handler 3: hooki (`usePanGesture`), nie `Gesture.Pan()`. Callbacki działają na wątku UI, a kod JS (np. haptyka) wywołuj przez `scheduleOnRN` z `react-native-worklets`.
- `Modal` na Androidzie potrzebuje własnego `GestureHandlerRootView` (jest już w `BottomSheet`).
- Pasek statusu: wygrywa ostatni zamontowany, dlatego główny `StatusBar` w `_layout` stoi przed `Stack`. Ekran gatunku ustawia jasne ikony nad zdjęciem, a `Screen` przywraca kolor motywu.
- Własny `TabBar` używa `emitter` i `navigateToTab`; typ `BottomTabBarProps` jest w `expo-router/tabs`.

- SunCalc jest w wersji **2.1.1**, ma własne typy; stare `@types/suncalc` opisują inny interfejs. V2 zwraca kąty w stopniach, brak zdarzeń jako `null` oraz `alwaysUp/alwaysDown`; offset dnia to minuty na wschód od UTC.
- Natywny build Androida poza Expo Go wymaga klucza Google Maps; nie skonfigurowano go.
- `expo-notifications`, zadania w tle i `MushroomAlertsLifecycle` wczytuj tylko przez `src/features/weather/alerts.ts` – w Expo Go ten moduł ich nie ładuje (inaczej ostrzeżenia przy każdym starcie).
- Expo Router 58: `unstable_settings.anchor` zamiast `initialRouteName`; zakładki z kotwicą potrzebują `backBehavior="initialRoute"`.
