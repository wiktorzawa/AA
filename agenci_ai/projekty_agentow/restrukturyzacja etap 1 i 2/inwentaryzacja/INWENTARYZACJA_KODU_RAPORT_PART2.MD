# Inwentaryzacja Kodu - Raport Część 2: Plan Restrukturyzacji Frontendu

**Data:** 01.07.2025
**Status:** W toku

## 1. Wprowadzenie

Niniejszy dokument stanowi plan działania dla drugiej fazy restrukturyzacji, skupionej wyłącznie na architekturze frontendu. Faza ta jest odpowiedzią na krytyczne rozbieżności zidentyfikowane w **Finałowym Raporcie z Audytu Kodu** z dnia 01.07.2025.

**Główny cel:** Doprowadzenie frontendu do nowoczesnego, spójnego i w pełni funkcjonalnego stanu, zgodnego z pierwotnymi założeniami modernizacyjnymi.

## 2. Zidentyfikowane Problemy i Plan Naprawczy

Poniżej znajduje się lista zadań podzielona na fazy. Każde zadanie zostanie delegowane do wykonawcy, a jego ukończenie będzie musiało zostać potwierdzone i zweryfikowane na podstawie raportu.

---

### **Faza I: Unifikacja i Uodpornienie Warstwy API**

**Cel:** Ujednolicenie i zabezpieczenie obsługi żądań API, w tym automatyczne zarządzanie cyklem życia tokenu autoryzacyjnego.

- **Zadanie 1.1: Implementacja Zaawansowanego Interceptora Axios**
  - **Opis:** Rozbudowa instancji Axios o kompleksowe interceptory.
    1.  **Interceptor Żądania (`request`):** Automatyczne dołączanie tokena `Authorization: Bearer <token>` do wszystkich żądań wychodzących.
    2.  **Interceptor Odpowiedzi (`response`):** Implementacja logiki obsługi błędu `401 Unauthorized`. W przypadku jego wystąpienia, interceptor powinien:
        - Podjąć próbę odświeżenia tokenu przez wywołanie endpointu `/auth/refresh-token`.
        - Jeśli odświeżenie się powiedzie, automatycznie ponowić pierwotne żądanie z nowym tokenem.
        - Jeśli odświeżenie się nie powiedzie, wylogować użytkownika (wyczyścić stan sesji).
  - **Status:** `[x] Ukończone`

---

### **Faza II: Modernizacja i Utrwalenie Zarządzania Stanem**

**Cel:** Pełne zastąpienie `AuthContext` przez nowoczesny, utrwalony stos (`Zustand` + `TanStack Query`).

- **Zadanie 2.1: Stworzenie Utrwalonego, Globalnego Store'a Sesji w Zustand**
  - **Opis:** Implementacja store'a Zustand do przechowywania stanu sesji (dane użytkownika, tokeny, status zalogowania). Kluczowym elementem jest użycie `persist middleware` z `zustand/middleware`, aby synchronizować stan z `localStorage` i zapewnić jego przetrwanie po odświeżeniu strony.
  - **Status:** `[x] Ukończone`

- **Zadanie 2.2: Refaktoryzacja Logiki Logowania i Wylogowania**
  - **Opis:** Przepisanie funkcji `login` i `logout` tak, aby operowały wyłącznie na nowym, utrwalonym store'ie Zustand.
  - **Status:** `[x] Ukończone`

- **Zadanie 2.3: Całkowite Usunięcie `AuthContext`**
  - **Opis:** Usunięcie pliku `AuthContext.tsx` i komponentu `AuthProvider` z drzewa aplikacji. Zastąpienie wszystkich wywołań `useAuth()` odpowiednimi selektorami z hooka `useAuthStore` (lub podobnego).
  - **Status:** `[x] Ukończone`

---

### **Faza III: Pełne Wdrożenie `TanStack Query` (Pobieranie i Mutacje)**

**Cel:** Wykorzystanie `TanStack Query` do zarządzania całym cyklem życia danych serwerowych (CRUD), eliminacja danych mockowych i zapewnienie spójności UI.

- **Zadanie 3.1: Refaktoryzacja `SupplierDeliveriesPage` (useQuery)**
  - **Opis:** Zastąpienie mockowych danych na stronie listy dostaw dostawcy (`SupplierDeliveriesPage.tsx`) przez hook `useQuery`, który będzie pobierał dane z rzeczywistego API.
  - **Status:** `[x] Ukończone`

- **Zadanie 3.2: Implementacja Mutacji i Unieważniania Zapytań (useMutation)**
  - **Opis:** Wprowadzenie hooka `useMutation` do obsługi operacji modyfikujących dane (np. w formularzu dodawania nowej dostawy). Po każdej udanej mutacji (w callbacku `onSuccess`), należy zaimplementować wzorzec `Query Invalidation` poprzez wywołanie `queryClient.invalidateQueries`, aby automatycznie odświeżyć listę dostaw i zapewnić spójność danych w interfejsie użytkownika.
  - **Status:** `[x] Ukończone`

---

### **Faza IV: Weryfikacja Końcowa i Testy Dymne**

**Cel:** Potwierdzenie, że aplikacja jest w pełni stabilna i wszystkie kluczowe funkcjonalności działają poprawnie po głębokiej restrukturyzacji.

- **Zadanie 4.1: Przeprowadzenie Testów Dymnych (Smoke Tests)**
  - **Opis:** Uruchomienie całej aplikacji (backend i frontend) i przeprowadzenie manualnej weryfikacji kluczowych ścieżek użytkownika w celu upewnienia się, że żadne krytyczne funkcje nie zostały uszkodzone.
  - **Status:** `[x] Ukończone i zweryfikowane`
