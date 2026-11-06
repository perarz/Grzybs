# Grzybnik – zasady projektu

Uniwersalna aplikacja grzybiarza (zadanie rekrutacyjne Software Mansion) w trzech częściach:
**Atlas** (gatunki, sobowtóry, odblokowywanie gatunków zdjęciem znaleziska), **Nauka** (grzyb dnia,
gra „Sobowtór”, quiz) i **Mapa** (spoty, powrót do auta).
React Native + Expo (SDK 58) + TypeScript + expo-router. Główny cel: emulator Androida i Expo Go.
Interfejs po polsku, kod, nazwy plików i commity po angielsku.

Autor uczy się Reacta w trakcie projektu – kod ma być **prosty, czytelny i solidny**.

@AGENTS.md

## Zasady kodu

- Najprostsze rozwiązanie, które działa. Zero abstrakcji „na zapas”.
- Jeden komponent = jedna odpowiedzialność. Plik > ~150 linii → podziel (nie dotyczy statycznych danych w `src/data`).
- Logika (obliczenia, baza, API) poza komponentami: `src/features/*/` jako funkcje lub hooki.
- Czytelne nazwy zamiast komentarzy; komentarz tylko, gdy wyjaśnia „dlaczego”.
- TypeScript strict, zero `any`.
- Style tylko przez tokeny z `src/theme` (kolory, odstępy, typografia, promienie, ruch) – żadnych „magicznych” wartości w komponentach.
- Wygląd „las”: domyślnie ciemna zieleń na każdym telefonie, niezależnie od jego ustawień (`useTheme` zwraca `palette.dark`, `app.json`: `dark`), akcent w kolorze kurki; nagłówek z warstwami świerków (paralaksa), ciemnozielony pasek zakładek; Fraunces (nazwy, tytuły), kursywa Fraunces (łacina), IBM Plex Mono (etykiety), małe promienie. Unikaj szablonowego wyglądu (pigułki, duże promienie, generyczne palety). Wybór z wielu opcji – krok po kroku w `BottomSheet`, nie wielkie panele.
- Kolory: `accent` tylko na tekst i cienkie linie na tle strony, `glow` + `onGlow` na wypełnienia i elementy na ciemnych powierzchniach. Kontrast: min. 4,5:1 dla tekstu, 3:1 dla grafiki. Jasna paleta w `colors.ts` jest teraz nieużywana – to zapas na ewentualny przełącznik.
- Wszystko klikalne przez `PressableScale` (sprężyna + haptyka); zmiany stanu animowane (Reanimated), nie skokowe. Wyjątek: pasek zakładek jest stale na ekranie, więc rusza się spokojnie – `withTiming`, bez sprężyn i bez uginania (sprężyny były tam dla autora zbyt rozbujane).
- Wszystko, co może zawieść (lokalizacja, czujniki, sieć, baza, uprawnienia), ma obsługę błędu i stan zastępczy – aplikacja nigdy się nie crashuje.
- Offline-first: dane użytkownika w SQLite (`src/db`); wszystko działa bez sieci (poza kafelkami mapy).
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
src/app/            ekrany i layouty (expo-router); (tabs)/ = index (Atlas, start, lewa), map (Mapa, środek), learn (Nauka, prawa); species/[id], compare
src/components/     współdzielone komponenty UI; podfoldery: atlas, species, compare, key, forest, icons
src/features/       logika per funkcja: atlas, collection, learn, spots, navigation, safety, feedback (haptyka)
src/db/             SQLite: połączenie, migracje
src/data/           statyczne dane (gatunki, sobowtóry, zdjęcia)
src/theme/          kolory (jasny/ciemny), typografia i fonty, odstępy, promienie, ruch, próbki kolorów
```

Import przez alias `@/` → `src/`.

## Workflow

- Małe kroki. Po każdym: `npm run lint` + `npm run typecheck` + commit (`feat:` / `fix:` / `chore:` / `refactor:`).
- Po każdym ETAPIE stop: podsumowanie, jak przetestować (Expo Go na telefonie + emulator Androida), wyjaśnienie kluczowego kodu prostym językiem, 3 krótkie pytania sprawdzające. Czekaj na „dalej”.
- Z autorem rozmawiaj po polsku, krótko i prostym językiem. Pisze bezpośrednio i ocenia wygląd po efekcie, więc zmiany UI sprawdź zrzutem z emulatora, zanim powiesz, że są gotowe.

## Plan etapów

- Etap 0 – Setup ✅
- Etap 1 – Test 3D ✅ → porzucony (proceduralne modele wyglądały zbyt słabo – zamiast nich zdjęcia)
- Etap 2 – Dane 26 gatunków (cechy, sezony, sobowtóry, zdjęcia na wolnej licencji) ✅
- Etap 3 – Atlas: karty, kategorie, wyszukiwarka, klucz do oznaczania; ekran gatunku (zegar sezonu, sobowtóry z alertem, suwak porównania) ✅
- Etap 4 – Odblokowywanie zdjęciem: zdjęcie → wybór gatunku → kontrola sobowtórów → animacja odkrycia, postęp w atlasie
- Etap 5 – Nauka: grzyb dnia, gra „Sobowtór”, quiz
- Etap 6 – Mapa: spoty, „Zaparkowałem tutaj”, powrót do auta (kompas/mapa), alarm zmroku, obsługa GPS
- Etap 7 – Bezpieczeństwo i szlif
- Etap 8 – Bonus: prognoza grzybowa, kolejne tryby nauki
- Etap 9 – README

## Komendy

```bash
npx expo start          # serwer deweloperski (a = emulator Androida, QR = Expo Go)
npm run lint            # ESLint + Prettier
npm run typecheck       # tsc --noEmit
npm run format          # Prettier – formatowanie wszystkich plików
npm test                # testy jednostkowe czystych funkcji (gdy dojdą)
```

## Stan projektu (2026-11-06)

- Gotowe: etapy 0–3 oraz przebudowa wyglądu (las, haptyka, ruch, klucz do oznaczania zamiast panelu filtrów). Wszystko w commitach na `main`. Repo nie ma zdalnego – GitHub tylko na prośbę autora.
- Następny krok: Etap 4, jeszcze nie zaczęty. Zacznij, gdy autor napisze „dalej”.
- Pod Etap 4 są już: tabela `finds` (`src/db/migrations.ts`), wielokrotnego użytku `BottomSheet`, zainstalowane `expo-image-picker` i `expo-file-system`.
- Zainstalowane, ale jeszcze nieużywane: `zustand`, `suncalc`, `expo-sensors`, `expo-location`, `react-native-maps`, `expo-image-picker`, `expo-file-system`.

Otwarte sprawy:

- `src/data/species.ts`: miesiące krowiaka mają `TODO: verify`.
- Ekran źródeł w aplikacji (Etap 7) – na razie podpis przy każdym zdjęciu i tabela w README.
- Haptyka nie jest potwierdzona na fizycznym telefonie, a emulator jej nie odda.
- README: zrzuty ekranu i wpis o testach na fizycznym urządzeniu mają `TODO`.
- Termin oddania zadania: nieznany, autor nie odpowiedział.
- Brak `npm test` i biblioteki testowej (dodanie wymaga zapytania autora).

## Uruchamianie (Mac autora)

- `ANDROID_HOME` jest w `~/.zshrc`, więc w nowym terminalu `a` w `npx expo start` sam włącza emulator (AVD `Medium_Phone_API_37.0`). Serwer uruchomiony przed tą zmianą tego nie umie.
- Powłoka agenta może nie wczytać `~/.zshrc`: wtedy `source ~/.nvm/nvm.sh` przed `npx`/`npm` i pełna ścieżka `~/Library/Android/sdk/platform-tools/adb`.
- Otwieranie apki przez adb: `adb shell am force-stop host.exp.exponent`, potem `adb shell am start -a android.intent.action.VIEW -d "<adres exp:// z terminala>"`. Konkretny ekran: `<adres>/--/species/amanita-phalloides`.
- Zrzut ekranu: `adb exec-out screencap -p > plik.png`. Po otwarciu apki poczekaj na załadowanie (kilkanaście sekund po przeładowaniu), zanim wyślesz kliknięcia lub zrobisz zrzut – inaczej klawisz wstecz wychodzi z apki, a zdjęcia są jeszcze puste.

Pułapki:

- Dwie kopie apki w Expo Go (`127.0.0.1` i adres LAN) dają `Cannot find native module 'ExpoSQLite'`. To nie błąd kodu – zamknij Expo Go i otwórz apkę raz, adresem z terminala.
- Otwarcie apki w chwili startu emulatora zostawia Expo Go na kółku ładowania, bez żądania do Metro. Poczekaj na sieć i otwórz ponownie.
- Typy tras (`typedRoutes`) generuje działający serwer – po dodaniu trasy musi być uruchomiony, zanim odpalisz `typecheck`.

## Uwagi techniczne (sprawdzone na tym SDK)

- `Link asChild` gubi styl podany jako funkcja – karty robimy przez `PressableScale` i `router.push`.
- Reanimated z React Compiler: `.get()` / `.set()` zamiast `.value`. Przejścia kolorów i obrotów: CSS transitions z Reanimated 4.
- Gesture Handler 3: hooki (`usePanGesture`), nie `Gesture.Pan()`. Callbacki działają na wątku UI, a kod JS (np. haptyka) wywołuj przez `scheduleOnRN` z `react-native-worklets`.
- `Modal` na Androidzie potrzebuje własnego `GestureHandlerRootView` (jest już w `BottomSheet`).
- Pasek statusu: wygrywa ostatni zamontowany, dlatego główny `StatusBar` w `_layout` stoi przed `Stack`. Ekran gatunku ustawia jasne ikony nad zdjęciem, a `Screen` przywraca kolor motywu.
- Własny `TabBar` używa `emitter` i `navigateToTab`; typ `BottomTabBarProps` jest w `expo-router/tabs`.
