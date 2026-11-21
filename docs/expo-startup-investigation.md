# Błąd `Cannot find native module 'ExpoSQLite'` przy starcie w Expo Go

Status: **naprawione w aplikacji 2026-11-21**. Przyczyna leży w Expo Go, ale apka sama ją
obsługuje: przy pierwszym starcie z `npx expo start` + `a` nie pokazuje już czerwonego błędu.

## Przyczyna

Expo Go 58 na Androidzie (58.0.5, versionCode 465 – najnowsza wersja dla SDK 58 według
`https://exp.host/--/api/v2/versions`) daje moduły Expo nowego typu („v2”) tylko jednemu
silnikowi JS w procesie. W projekcie są to `expo-sqlite`, `expo-haptics`, `expo-application`
i część `expo` (log: „installed 4 module(s)”).

`expo-modules-core/android/.../v2/ExpoModulesV2Host.kt` trzyma jedno pole `runtime`:

- `install(reactContext)` kończy się od razu, jeśli `runtime != null` – także dla innego
  silnika („⚠️ Expo Modules v2 was already installed”),
- `uninstall()` (wołane przy niszczeniu dowolnego `AppContext`) zamyka i zeruje to pole.

Ten sam kod jest w `expo-modules-core` 58.0.29, 58.0.30 i 58.1.0 – poprawki nie ma.

Drugi silnik JS w procesie Expo Go powstaje, gdy Expo Go trzyma już otwarty projekt:

- emulator wstaje z zapisanego stanu (szybki rozruch) razem z Expo Go i apką z poprzedniej
  sesji – tak było 2026-11-21: stara kopia pod `127.0.0.1:8081`, a `a` otwiera adres LAN,
- apka jest otwarta pod dwoma adresami (`127.0.0.1` i LAN, albo zmieniony adres IP sieci),
- działają dwa serwery Expo (8081 i 8082),
- w Expo Go jest otwarty inny projekt (np. u osoby sprawdzającej kilka zadań).

Wtedy `import 'expo-sqlite'` w `src/app/_layout.tsx` rzuca wyjątek przy wczytywaniu modułu,
cały układ tras traci eksport domyślny i Expo Go pokazuje czerwony ekran.

## Naprawa

1. `package.json` → `"main": "index.ts"`. `index.ts` najpierw sprawdza
   (`src/features/startup/nativeModules.ts`, `requireOptionalNativeModule('ExpoSQLite')`),
   czy silnik ma moduły, a dopiero potem wczytuje `expo-router/entry`. Nic przed tym
   sprawdzeniem nie importuje modułów v2.
2. Bez modułów rejestruje `StartupRecovery`, który raz przeładowuje własny silnik JS
   (`DevSettings.reload`). Zniszczenie silnika woła `uninstall()`, więc nowy silnik dostaje
   moduły. Log z emulatora:
   ```text
   10:51:17.733 W ExpoModulesCore: ⚠️ Expo Modules v2 was already installed
   10:51:26.990 I ExpoModulesCore: ✅ AppContext was destroyed
   10:51:52.420 I ExpoModulesCore: ✅ Expo Modules v2 installed 4 module(s) on globalThis.expo.modules
   ```
3. Próba jest zapisywana w pliku w pamięci podręcznej (`expo-file-system` to moduł starego
   typu, działa w niepełnym silniku). Druga awaria w ciągu 30 s nie przeładowuje już
   automatycznie – zostaje czytelny ekran „Expo Go potrzebuje restartu” z przyciskiem.
   Bez dostępu do pliku apka też nie przeładowuje się sama, więc nie ma pętli.

Przeładowanie odbiera moduły staremu silnikowi w tle. To ta sama kopia, której użytkownik
już nie ogląda; przy powrocie do niej przejdzie ona przez tę samą ścieżkę.

## Weryfikacja (emulator Medium Phone API 37, Expo Go 58.0.5)

- Stara kopia z poprzedniej sesji + `npx expo start --android` (to samo co `a`): ekran
  Start bez błędu, naprawa w ok. 2,5 s (przy wolnym pobieraniu paczki dłużej).
- Druga kopia pod innym adresem przy działającej pierwszej: to samo.
- Wymuszony ekran awaryjny: czytelny, w kolorach aplikacji, przycisk przeładowuje.
- `tests/startup-recovery.test.cjs`: jedno automatyczne przeładowanie, brak pętli,
  brak przeładowania bez pamięci podręcznej, wejście bez statycznych importów aplikacji.

## Inne ostrzeżenia pierwszego startu (usunięte)

- `unstable_settings.initialRouteName` → `anchor`; zakładki mają `backBehavior="initialRoute"`,
  więc „wstecz” z Mapy dalej wraca na Start.
- `expo-notifications` wypisuje dwa ostrzeżenia już przy imporcie w Expo Go. Alertów w tle
  i tak nie da się tam włączyć, więc `src/features/weather/alerts.ts` wczytuje moduł z
  powiadomieniami tylko poza Expo Go (tam też rejestruje zadanie w tle przy starcie).

## Dalej otwarte

- Pierwszy start w Expo Go na iOS i na fizycznym Androidzie nie był sprawdzony.
- `npx expo start` sugeruje aktualizację `expo` 58.0.22 → 58.0.26 i 11 innych pakietów
  (`npx expo install --check`). Natywnego błędu to nie naprawi – siedzi w Expo Go.
