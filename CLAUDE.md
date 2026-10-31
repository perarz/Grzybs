# Grzybnik – zasady projektu

Aplikacja mobilna o grzybiarstwie (zadanie rekrutacyjne Software Mansion).
React Native + Expo (SDK 57) + TypeScript + expo-router. Główny cel: emulator Androida i Expo Go.
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
- Offline-first: dane użytkownika w SQLite (`src/db`), sieć tylko do pogody (z cache ostatniego wyniku).

## Biblioteki

- Instalacja tylko przez `npx expo install <pakiet>` (dev: `npx expo install <pakiet> -- --save-dev`).
- Wszystko musi działać w **Expo Go** – żadnych modułów wymagających development builda.
- Nowa biblioteka – tylko po zapytaniu autora.

## Treści o grzybach

- Fakty (jadalność, toksyczność, sobowtóry) muszą być prawdziwe. Przy braku pewności – oznacz `TODO: verify`, nie zgaduj.
- Zdjęcia tylko na wolnej licencji (np. Wikimedia Commons) z zapisanym autorem i licencją (sekcja źródeł w aplikacji i README) – albo własne ilustracje SVG.

## Struktura

```
src/app/            ekrany i layouty (expo-router); (tabs)/ = Prognoza, Atlas, Mapa, Zbiory
src/components/     współdzielone komponenty UI
src/features/       logika per funkcja: forecast, atlas, spots, navigation, collection, safety
src/db/             SQLite: połączenie, migracje
src/data/           statyczne dane (gatunki)
src/theme/          kolory (jasny/ciemny), typografia, odstępy, promienie
```

Import przez alias `@/` → `src/`.

## Workflow

- Małe kroki. Po każdym: `npm run lint` + `npm run typecheck` + commit (`feat:` / `fix:` / `chore:` / `refactor:`).
- Po każdym ETAPIE stop: podsumowanie, jak przetestować (Expo Go na telefonie + emulator Androida), wyjaśnienie kluczowego kodu prostym językiem, 3 krótkie pytania sprawdzające. Czekaj na „dalej”.

## Komendy

```bash
npx expo start          # serwer deweloperski (a = emulator Androida, QR = Expo Go)
npm run lint            # ESLint + Prettier
npm run typecheck       # tsc --noEmit
npm run format          # Prettier – formatowanie wszystkich plików
npm test                # testy jednostkowe (od etapu 6)
```
