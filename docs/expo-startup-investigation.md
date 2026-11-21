# Diagnostyka startu Androida — 2026-11-19

Status: przyczyna odtworzona, trwała naprawa nie została wdrożona.

## Środowisko

- Expo Go Android 58.0.5 (versionCode 465).
- Expo 58.0.22, expo-modules-core 58.0.29, expo-sqlite 58.0.15.
- React Native 0.88.1.
- Kontrola zgodności z lokalnym bundledNativeModules przechodzi; kontrola online
  zakończyła się błędem HTTP Proxy timed out.

## Reprodukcja

1. Otworzyć projekt przez `exp://127.0.0.1:8081` w nowym procesie Expo Go.
2. Otworzyć ten sam projekt przez adres LAN bez zakończenia procesu Expo Go.
3. Drugi runtime zgłasza `Cannot find native module 'ExpoSQLite'`.

Powtórzono też z tymczasowym wejściem aplikacji zawierającym wyłącznie:

```js
import React from 'react';
import { registerRootComponent } from 'expo';
import { Text } from 'react-native';
import { openDatabaseSync } from 'expo-sqlite';
const db = openDatabaseSync('repro.db');
const value = db.getFirstSync('SELECT 1 AS value').value;
function App() {
  return <Text>SQLite ready: {value}</Text>;
}
registerRootComponent(App);
```

To samo zachowanie bez Routera, providerów, migracji i ekranów Grzybnika.
Tymczasowe wejście usunięto; main ponownie wskazuje `expo-router/entry`.
Danych użytkownika nie czyszczono.

## Dowody z urządzenia

Minimalny przykład, jeden proces 22896, dwa wątki JS:

```text
21:52:14.347 22896 22975 I ExpoModulesCore: Expo Modules v2 installed 4 module(s) on globalThis.expo.modules
21:52:28.529 22896 23041 W ExpoModulesCore: Expo Modules v2 was already installed
21:52:29.024 22896 23041 E ReactNativeJS: [runtime not ready]: Error: Cannot find native module 'ExpoSQLite'
```

Zainstalowany `expo-modules-core/.../v2/ExpoModulesV2Host.kt` przechowuje jeden
`private var runtime: ReactRuntime?` w singletonie `object ExpoModulesV2Host`.
`install(reactContext)` kończy się, gdy runtime istnieje, nawet dla innego kontekstu.
SQLite używa Modules v2. Log urządzenia odpowiada tej ścieżce: drugi runtime
nie otrzymuje modułów v2. Naprawa powinna przypisywać rejestrację i zwalnianie
modułów do właściwego kontekstu/runtime, a nie do całego procesu.

Zmiana JS, migracji lub skryptu startowego nie naprawia natywnego rejestratora
w już zainstalowanym Expo Go. Wymagana jest oficjalna poprawka natywnego hosta
oraz ponowny test na wersji zawierającej tę poprawkę. Nie potwierdzono dostępności
takiego wydania. Nie modyfikowano node_modules ani nie dodawano automatycznych restartów.

## Wycofane obejścia

Przywrócono `npm run android` → `expo start --android`.
Usunięto skrypty start/reopen i instrukcje przedstawiające restart jako naprawę.
Projekt nie jest uznany za wolny od tego problemu.
