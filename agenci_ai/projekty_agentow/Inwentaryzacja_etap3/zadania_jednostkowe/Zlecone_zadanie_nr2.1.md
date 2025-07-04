# ZLECENIE ZADANIA NR: 2.1

## 1. Kontekst Zadania

- **Stan Aktualny:** W projekcie istnieje niestandardowy komponent tabeli z rozwijanymi wierszami (`tabela-rozwijana-produkty.tsx`), który jest złożony i trudny w utrzymaniu.
- **Powiązane Poprzednie Zadanie:** Audyt (Pytanie 4) zidentyfikował ten komponent jako idealnego kandydata do refaktoryzacji.
- **Cel Główny Tego Zadania:** Zastąpienie niestandardowego komponentu tabeli gotowym rozwiązaniem `Advanced Table` z biblioteki Flowbite React PRO w celu uproszczenia kodu i zwiększenia spójności UI.

## 2. Szczegółowy Opis Zlecenia i Etapy Realizacji

1.  Dokładnie przeanalizuj dokumentację komponentu `Advanced Table` w bibliotece Flowbite React PRO, zwracając szczególną uwagę na implementację rozwijanych wierszy (`Expandable Rows`).
2.  Przejdź do pliku `src/pages/admin/AdminProductsPage.tsx`, gdzie używany jest komponent `TabelaRozwijanaProdukty`.
3.  Zastąp użycie `<TabelaRozwijanaProdukty products={products} />` nową implementacją opartą bezpo��rednio na komponentach z Flowbite (np. `<Table>`, `<Table.Head>`, `<Table.Body>`, `<Table.Row>`, itd.).
4.  Zaimplementuj logikę rozwijanych wierszy zgodnie z dokumentacją Flowbite. Zawartość rozwijanego wiersza powinna być taka sama jak w obecnej implementacji (notatki, dane logistyczne, akcje).
5.  Usuń plik `src/components/tables/tabela-rozwijana-produkty.tsx`, ponieważ nie będzie już potrzebny.
6.  Zweryfikuj, czy nowa tabela działa identycznie jak stara: czy poprawnie wyświetla dane, czy wiersze rozwijają się i zwijają po kliknięciu przycisku.

## 3. Oczekiwany Rezultat

- Niestandardowy komponent `TabelaRozwijanaProdukty` został w całości zastąpiony przez implementację wykorzystującą `Advanced Table` z Flowbite React PRO.
- Plik `src/components/tables/tabela-rozwijana-produkty.tsx` został usunięty.
- Nowa tabela w `AdminProductsPage.tsx` jest w pełni funkcjonalna i wizualnie spójna z poprzednią wersją.
- Kod jest czystszy, prostszy i w pełni zgodny z TypeScript.

## 4. Wymagania Dotyczące Raportu od Wykonawcy

- Raport musi zawierać szczegółowy opis wykonanych kroków.
- W raporcie muszą znaleźć się fragmenty kodu "przed" (z `AdminProductsPage.tsx` i usuniętego pliku) i "po" (z `AdminProductsPage.tsx`).
- Raport musi zawierać opis przeprowadzonej weryfikacji (np. "Uruchomiono stronę, zweryfikowano renderowanie tabeli, przetestowano rozwijanie/zwijanie wierszy dla kilku produktów").
- W raporcie musi znaleźć się sekcja opisująca ewentualne napotkane problemy (np. z dostosowaniem danych do nowego komponentu) i sposób ich rozwiązania.
