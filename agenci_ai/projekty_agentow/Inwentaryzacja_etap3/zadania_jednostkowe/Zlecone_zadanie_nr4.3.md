# ZLECENIE ZADANIA NR: 4.3

## 1. Kontekst Zadania

- **Stan Aktualny:** W pliku `src/api/authApi.ts` w funkcjach `weryfikujToken` i `wyloguj` nagłówek `Authorization` jest dodawany ręcznie, co omija centralny mechanizm interceptora `axios`.
- **Powiązane Poprzednie Zadanie:** Audyt (Pytanie 8) wykazał to naruszenie.
- **Cel Główny Tego Zadania:** Usunięcie ręcznego dodawania nagłówków i zapewnienie, że wszystkie żądania autoryzacyjne przechodzą przez interceptor.

## 2. Szczegółowy Opis Zlecenia i Etapy Realizacji

1.  Przejdź do pliku `src/api/authApi.ts`.
2.  W funkcji `weryfikujToken`:
    - Usuń trzeci argument z wywołania `axiosInstance.post`, czyli obiekt `{ headers: { Authorization: ... } }`.
    - Zmień sygnaturę funkcji tak, aby nie przyjmowała już argumentu `token`, ponieważ interceptor pobierze go z `localStorage`.
3.  W funkcji `wyloguj`:
    - Usuń trzeci argument z wywołania `axiosInstance.post`, czyli obiekt `{ headers: { Authorization: ... } }`.
    - Zmień sygnaturę funkcji tak, aby nie przyjmowała już argumentu `token`.
4.  Przejdź do wszystkich miejsc w aplikacji, gdzie wywoływane są funkcje `weryfikujToken` i `wyloguj` (np. w komponentach lub store `authStore.ts`) i zaktualizuj ich wywołania, usuwając przekazywany argument `token`.
5.  Dokładnie zweryfikuj, czy po zmianach funkcje weryfikacji tokenu i wylogowywania działają poprawnie. Sprawdź, czy wylogowanie czyści dane i przekierowuje użytkownika.

## 3. Oczekiwany Rezultat

- Z funkcji `weryfikujToken` i `wyloguj` w `authApi.ts` usunięto ręczne ustawianie nagłówka `Authorization`.
- Zaktualizowano wywołania tych funkcji w całej aplikacji.
- Procesy weryfikacji tokenu i wylogowywania działają poprawnie, opierając się na tokenie automatycznie dodawanym przez interceptor.
- Kod jest spójny i w pełni wykorzystuje centralny mechanizm obsługi API.

## 4. Wymagania Dotyczące Raportu od Wykonawcy

- Raport musi zawierać szczegółowy opis wykonanych kroków.
- W raporcie muszą znaleźć się fragmenty kodu "przed" i "po" dla wszystkich modyfikowanych plików.
- Raport musi zawierać opis przeprowadzonej weryfikacji (np. "Zalogowano się, a następnie wylogowano. Sprawdzono w narzędziach deweloperskich, że żądanie /logout zostało wysłane z poprawnym nagłówkiem Authorization dodanym przez interceptor").
