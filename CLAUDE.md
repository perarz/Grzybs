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
- Jeden komponent = jedna odpowiedzialność. Plik > ~150 linii → podziel.
- Logika (obliczenia, baza, API) poza komponentami: `src/features/*/` jako funkcje lub hooki.
- Czytelne nazwy zamiast komentarzy; komentarz tylko, gdy wyjaśnia „dlaczego”.
- TypeScript strict, zero `any`.
- Style tylko przez tokeny z `src/theme` (kolory, odstępy, typografia, promienie) – żadnych „magicznych” wartości w komponentach.
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
src/app/            ekrany i layouty (expo-router); (tabs)/ = map (Mapa), index (Atlas, start), learn (Nauka)
src/components/     współdzielone komponenty UI
src/features/       logika per funkcja: atlas, collection, learn, spots, navigation, safety
src/db/             SQLite: połączenie, migracje
src/data/           statyczne dane (gatunki)
src/theme/          kolory (jasny/ciemny), typografia, odstępy, promienie
```

Import przez alias `@/` → `src/`.

## Workflow

- Małe kroki. Po każdym: `npm run lint` + `npm run typecheck` + commit (`feat:` / `fix:` / `chore:` / `refactor:`).
- Po każdym ETAPIE stop: podsumowanie, jak przetestować (Expo Go na telefonie + emulator Androida), wyjaśnienie kluczowego kodu prostym językiem, 3 krótkie pytania sprawdzające. Czekaj na „dalej”.

## Plan etapów

- Etap 0 – Setup ✅
- Etap 1 – Test 3D ✅ (działa w Expo Go; canvas renderuje na żądanie, dotyk omija canvas)
- Etap 2 – Dane ~25 gatunków (cechy, sezony, sobowtóry, parametry 3D)
- Etap 3 – Atlas: karty, kategorie, wyszukiwarka, filtr cech; ekran gatunku (zegar sezonu, sobowtóry z alertem, suwak porównania, 3D)
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
