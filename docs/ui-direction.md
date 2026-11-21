# Grzybnik — UI i nawigacja

## Ustalenia 2026-11-15

Zachowujemy ciemną zieleń i bursztyn. Dwie zakładki: Start i Mapa. Atlas, Nauka,
kolekcja, szczegóły i ustawienia są ekranami wewnątrz Startu, z widocznym dolnym
paskiem. Ponowne naciśnięcie aktywnego Startu wraca do jego początku. Zmiana
zakładki zachowuje stos ekranów. Dane użytkownika pozostają w istniejącej bazie.
Autor nie chce podłączać Sleek: stosujemy lokalne wskazówki projektowania i
wdrażania skilla bez wywoływania jego API.

## Kierunek

Spokojny, terenowy przewodnik. Głęboka zieleń buduje tło i warstwy, jasny krem
zapewnia czytelność, bursztyn wyróżnia działania. Oswald tworzy zwarte nagłówki,
Source Sans Pro służy do treści, monospaced tylko do krótkich etykiet. Zdjęcia
prawdziwych gatunków nadają charakter. Prosta nawigacja, umiarkowane rogi,
cienkie obramowania zamiast ciężkich cieni. Ikony konturowe o wspólnej kresce.

Start: dominujące zdjęcie z wejściem do Atlasu, osobne wejście do Nauki,
kompaktowy grzyb dnia i ostatnie własne odkrycia. Pusta kolekcja zachęca do
pierwszego zdjęcia, a nie pokazuje fikcyjnych znalezisk.
Atlas: krótki nagłówek, wyszukiwanie, istniejące filtry i siatka zdjęć.
Szczegóły: zdjęcie, nazwy, dodanie zdjęcia, ostrzeżenia, cechy i sezon przed
rozwijanymi opisami. Nauka i ustawienia używają tego samego języka kart.
Mapa: pogoda u góry, dodawanie na dole po lewej, GPS po prawej; zapisane miejsca
dostępne bez rozwijania menu. Ostrzeżenie o zachodzie powyżej przycisków.

## Przegląd względem wskazówek skilla

- Ujednolicić nagłówki: obecnie Atlas ma gradient, Nauka rozbudowany las.
- Zachować tokeny kolorów/odstępów, usunąć lokalne kolory z ruszanych nagłówków.
- Dodać realny Start, nie atrapę ze statystykami i fikcyjnymi danymi.
- Dolny pasek należy do wspólnej nawigacji, nie do każdego ekranu.
- Zachować popularne nazwy w listach; łacinę pokazywać w szczegółach.
- Zweryfikować szeroki i wąski ekran, większy tekst, puste/błędne dane,
  klawiaturę, powroty, deep linki i dostępność przycisków.
- Lint, typecheck i eksport nie zastępują sprawdzenia natywnego UI.

## Weryfikacja wdrożenia 2026-11-15

- Lint, TypeScript i 89 testów przechodzą. Dwa nowe testy kontrolują faktyczne
  drzewo tras Expo na Androidzie i iOS.
- Eksporty Android/Hermes i iOS/Hermes przechodzą.
- Niezależny przegląd kodu: poprawiono zawijanie nagłówka kolekcji przy większym
  tekście, stałe szerokości zdjęć w niepełnym rzędzie i powielony tytuł czytnika.
- Natywnego wyglądu, klawiatury i przejść nie zweryfikowano: ADB odmawia
  uruchomienia serwera w tej sesji (Operation not permitted).
- Podczas dodawania testów tras przypadkowo nadpisano wcześniejszy nieśledzony
  plik testów nawigacji. Odtworzono 17 testów regresji geometrii, światła, GPS
  i kompasu; nie jest to dokładne odzyskanie oryginalnej zawartości. Testy tras
  mają teraz osobny plik route-tree.test.cjs. Kod GPS nie był zmieniany.

## Dopracowanie 2026-11-19

- Kolekcja: stała szerokość kart w niepełnym rzędzie; podgląd Startu skaluje
  miniatury do powiększonego tekstu i szerokości ekranu.
- Wyszukiwarka: przycisk czyszczenia 48 × 48, po wyczyszczeniu zachowany fokus.
- Wybór poziomu: panel nie zamyka się podczas zapisu; opcje mają pełne etykiety
  dla czytnika ekranu.
- Mapa: udany zapis auta i usunięcie punktu są widoczne także wtedy, gdy kolejny
  odczyt bazy zawiedzie. Nieudany zapis zachowuje poprzednią pozycję auta.
- Mapa i Nauka: opóźniony odczyt nie aktualizuje stanu po opuszczeniu ekranu.
- Lint, TypeScript i 97 testów przechodzą, w tym osiem nowych regresji.
- Eksporty Android/Hermes i iOS/Hermes przechodzą.
- Natywny podgląd pozostaje niezweryfikowany: ADB nadal zgłasza
  `Operation not permitted` przy uruchamianiu serwera.
