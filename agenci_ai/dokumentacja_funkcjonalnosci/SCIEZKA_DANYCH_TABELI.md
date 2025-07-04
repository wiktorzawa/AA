# Ścieżka Danych: Od Bazy Danych do Tabeli w Interfejsie Użytkownika

**Data:** 01.07.2025

Ten dokument wyjaśnia, w jaki sposób informacja z bazy danych backendu trafia do tabeli wyświetlanej użytkownikowi w przeglądarce. Zrozumienie tej ścieżki jest kluczowe do zrozumienia, gdzie i dlaczego definiujemy nazwy kolumn.

---

### Krok 1: Źródło Prawdy (Baza Danych - Backend)

Wszystko zaczyna się w bazie danych. Tabela `dost_nowa_dostawa` przechowuje surowe, podstawowe dane o każdej dostawie.

- **Plik:** Schemat bazy danych
- **Przykład pól:** `id_dostawy`, `nazwa_pliku`, `nr_palet_dostawy`, `status_weryfikacji`, `data_utworzenia`.
- **Rola:** Jest to ostateczne, surowe źródło danych.

---

### Krok 2: Kontrakt API (Serwis - Backend)

Backend nie wysyła surowych danych z bazy. Najpierw je przetwarza, aby były bardziej użyteczne dla frontendu. Ten proces dzieje się w **serwisie**.

- **Plik:** `backend/src/services/deliveryService.ts`
- **Logika:** Funkcja `getDeliveries` pobiera dane z bazy, ale może też je wzbogacić, np. obliczając `liczba_produktow` czy `wartosc_calkowita` (których nie ma bezpośrednio w tabeli `dost_nowa_dostawa`).
- **Rola:** Endpoint API (np. `/api/deliveries`) definiuje **kontrakt** – czyli ostateczny format obiektu JSON, który otrzyma frontend.

**Przykładowy obiekt JSON z API:**

```json
{
  "id_dostawy": "DST/PL123",
  "nazwa_pliku": "dostawa_agd.xlsx",
  "status_weryfikacji": "nowa",
  "data_utworzenia": "2025-07-01T14:00:00.000Z",
  "liczba_produktow": 150,
  "wartosc_calkowita": 25000.0,
  "nr_palet_dostawy": "PALETA-A, PALETA-B"
}
```

---

### Krok 3: Pobieranie Danych (API Client - Frontend)

Frontend musi mieć sposób, aby poprosić backend o dane.

- **Plik:** `src/api/deliveryApi.ts`
- **Logika:** Funkcja `getDeliveries` wysyła żądanie `GET` na adres `/api/deliveries` i zwraca tablicę obiektów JSON zdefiniowanych w Kroku 2.
- **Rola:** Jest to "posłaniec", który przynosi dane z backendu.

---

### Krok 4: Zarządzanie Stanem (TanStack Query - Frontend)

Pobrane dane muszą być gdzieś przechowywane i zarządzane w aplikacji.

- **Plik:** `src/pages/supplier/SupplierDeliveriesPage.tsx`
- **Logika:** Hook `useQuery({ queryKey: ['deliveries'], queryFn: getDeliveries })` wywołuje funkcję z Kroku 3. `TanStack Query` zajmuje się resztą: obsługą stanu ładowania, błędów, cache'owaniem danych.
- **Rola:** Jest to "magazyn" danych po stronie frontendu.

---

### Krok 5: Prezentacja (Komponent React - Frontend)

To jest ostatni i najważniejszy etap, w którym dane stają się widoczne dla użytkownika.

- **Plik:** `src/pages/supplier/SupplierDeliveriesPage.tsx`
- **Logika:** Komponent React iteruje po danych dostarczonych przez `useQuery` i renderuje tabelę (`<table>`).
- **Rola:** Jest to warstwa prezentacji. I to **TUTAJ** definiujemy, jak kolumny mają się nazywać.
  - **Nagłówki (`<th>`):** To są statyczne, "ludzkie" etykiety, które wpisujemy bezpośrednio w kodzie. **To właśnie te etykiety musimy poprawić.**
  - **Komórki (`<td>`):** Tutaj wstawiamy konkretne wartości z obiektu JSON (np. `delivery.nazwa_pliku`).

### Wniosek

Nazwy kolumn, które widzi użytkownik, **nie są pobierane z bazy danych ani z API**. Są one na stałe wpisane w kodzie komponentu React (`<th>`). Naszym zadaniem jest upewnienie się, że te na stałe wpisane etykiety **logicznie odpowiadają danym**, które wstawiamy do komórek (`<td>`) z obiektu dostarczonego przez API.
