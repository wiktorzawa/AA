# ZLECENIE ZADANIA NR: 1.1

## 1. Kontekst Zadania

- **Stan Aktualny:** Komponent `AdminAddDeliveryPage.tsx` używa obecnie statycznej, mockowanej listy dostawców (`MOCK_SUPPLIERS`). Dodatkowo, `useEffect` jest używany do reakcji na zmianę danych użytkownika, co jest logiką, którą można uprościć i zintegrować z `TanStack Query`.
- **Powiązane Poprzednie Zadanie:** Audyt (Pytanie 1) wykazał istnienie komponentu z mockowanymi danymi.
- **Cel Główny Tego Zadania:** Zastąpienie mockowanych danych dynamicznym pobieraniem listy dostawców z API przy użyciu `TanStack Query` oraz usunięcie zbędnego `useEffect`.

## 2. Szczegółowy Opis Zlecenia i Etapy Realizacji

1.  Przejdź do pliku `src/pages/admin/AdminAddDeliveryPage.tsx`.
2.  Usuń stałą `MOCK_SUPPLIERS`.
3.  Zaimplementuj hook `useQuery` z `TanStack Query` do pobierania listy dostawców.
    - Użyj klucza query z `QUERY_KEYS` (jeśli nie istnieje odpowiedni, utwórz go w `src/constants.ts`, np. `SUPPLIERS`).
    - Stwórz nową funkcję `fetchSuppliers` w `src/api/supplierApi.ts` (jeśli nie istnieje), która będzie odpowiedzialna za zapytanie do endpointu `/api/suppliers`.
4.  Zastąp mapowanie po `MOCK_SUPPLIERS` w elemencie `<Select>` mapowaniem po danych zwróconych przez `useQuery`.
5.  Obsłuż stany `isLoading` oraz `isError` zwrócone przez `useQuery`. Na przykład, deaktywuj `Select` podczas ładowania i wyświetl komunikat o błędzie.
6.  Przeanalizuj i usuń istniejący `useEffect`. Logika ustawiania dostawcy na podstawie zalogowanego użytkownika powinna być wykonana po pomyślnym załadowaniu danych z `useQuery`. Można to zrobić w bloku `onSuccess` w opcjach `useQuery` lub w `useEffect` zalezależnym od danych z `useQuery`.
7.  Zweryfikuj, czy po zmianach komponent działa poprawnie – lista dostawców jest ładowana, a pole jest poprawnie ustawiane dla zalogowanego dostawcy.

## 3. Oczekiwany Rezultat

- Komponent `AdminAddDeliveryPage.tsx` pobiera listę dostawców dynamicznie z API.
- Usunięto tablicę `MOCK_SUPPLIERS`.
- W komponencie obsłużone są stany `isLoading` oraz `isError` dla zapytania o dostawców.
- Istniejący `useEffect` został usunięty lub zrefaktoryzowany do pracy z `useQuery`.
- Kod jest w pełni zgodny z TypeScript i nie generuje błędów kompilacji.

## 4. Wymagania Dotyczące Raportu od Wykonawcy

- Raport musi zawierać szczegółowy opis wykonanych kroków.
- W raporcie muszą znaleźć się fragmenty kodu "przed" i "po" dla każdego modyfikowanego pliku (`AdminAddDeliveryPage.tsx`, `supplierApi.ts`, `constants.ts`).
- Raport musi zawierać opis przeprowadzonej weryfikacji (np. "Uruchomiono aplikację, zweryfikowano, że lista dostawców ładuje się z API, sprawdzono obsługę stanu ładowania i błędu").
- W raporcie musi znaleźć się sekcja opisująca napotkane błędy i sposób ich rozwiązania.
- W raporcie musi znaleźć się osobna sekcja na "Propozycje Dodatkowych Zmian", jeśli takie zostaną zidentyfikowane.
