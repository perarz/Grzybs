# Grzybnik 🍄

Mobilny przewodnik grzybiarza: atlas gatunków z ostrzeżeniami przed trującymi sobowtórami, prywatna mapa miejscówek z powrotem do auta, rejestr zbiorów i prognoza „grzybowej pogody”. Działa offline – w lesie zasięg bywa słaby.

> Projekt powstał jako zadanie rekrutacyjne do Software Mansion.

<!-- TODO: GIF / zrzuty ekranu -->

## Platforma i testy

- **Przygotowana głównie pod:** Android
- **Testowana na fizycznym urządzeniu:** TODO (uzupełnić przed oddaniem)
- **Emulator:** Android Studio, Medium Phone (API 37)

## Funkcje

| Moduł    | Opis                                                                               | Status    |
| -------- | ---------------------------------------------------------------------------------- | --------- |
| Atlas    | ~25 gatunków z Polski, filtrowanie po cechach, sobowtóry z alertami, sezonowość    | planowane |
| Zbiory   | Znaleziska ze zdjęciami, Grzybodex, statystyki                                     | planowane |
| Mapa     | Prywatne miejscówki, „Zaparkowałem tutaj”, powrót do auta z kompasem, alarm zmroku | planowane |
| Prognoza | Indeks grzybowy 0–100 z opadów i temperatury (Open-Meteo), cache offline           | planowane |

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

Expo SDK 57 · React Native 0.86 · TypeScript (strict) · expo-router · Reanimated · Gesture Handler · react-native-svg · react-native-maps · expo-location · expo-sensors · expo-image-picker · expo-sqlite · zustand · suncalc

## Struktura

```
src/app/         ekrany (expo-router), zakładki w (tabs)/
src/components/  współdzielone komponenty UI
src/features/    logika funkcji (forecast, atlas, spots, navigation, collection, safety)
src/db/          SQLite: połączenie i migracje
src/data/        statyczne dane gatunków
src/theme/       kolory (jasny/ciemny), typografia, odstępy
```

## Decyzje techniczne

- **Offline-first:** dane użytkownika w SQLite z wersjonowanymi migracjami (`PRAGMA user_version`); sieć tylko do pogody.
- **Expo Go:** wyłącznie biblioteki dostępne w Expo Go – aplikację da się uruchomić bez budowania natywnego.
- **Odporność na błędy:** globalny `ErrorBoundary` z przyciskiem „Spróbuj ponownie” zamiast crasha.
- TODO: uzupełniać w kolejnych etapach.

## Źródła i licencje

TODO: zdjęcia (autor, licencja), źródła wiedzy o gatunkach, dane pogodowe ([Open-Meteo](https://open-meteo.com/), CC BY 4.0).

## Zastrzeżenie

Aplikacja ma charakter edukacyjny i **nie zastępuje konsultacji z grzyboznawcą**. Nigdy nie jedz grzyba, którego nie jesteś w 100% pewien.
