# Plan Operacyjny Restrukturyzacji Aplikacji

## Faza I: Porządki i Usunięcie Balastu (Najwyższy Priorytet)

**Cel:** Szybkie zmniejszenie złożoności projektu przez usunięcie ewidentnie martwego i nieużywanego kodu.

- **Zadanie 1: Usunięcie modułu Allegro (Backend)** - ✅ **Wykonane**
  - **Instrukcja:** Usuń z folderu `backend/src/` następujące pliki i foldery: `controllers/allegroController.ts`, `routes/allegroRoutes.ts` oraz `services/allegroService.ts`. Następnie usuń wszystkie odwołania (importy) do tych plików w całej aplikacji.

- **Zadanie 2: Usunięcie szablonów UI (Frontend)** - ✅ **Wykonane**
  - **Instrukcja:** Usuń cały folder `frontend/src/components/blocks/application-ui/`.

- **Zadanie 3: Usunięcie zduplikowanych plików API (Frontend)** - ✅ **Wykonane**
  - **Instrukcja:** Usuń następujące pliki z folderu `frontend/src/api/`: `login_auth_data.api.ts`, `login_table_staff.api.ts`, `login_table_suppliers.api.ts`.

- **Zadanie 4: Usunięcie nieużywanych helperów (Frontend)** - ✅ **Wykonane**
  - **Instrukcja:** Usuń następujące pliki z folderu `frontend/src/helpers/`: `is-browser.ts` i `is-small-screen.ts`.

## Faza II: Standaryzacja i Unifikacja

**Cel:** Wprowadzenie spójności technologicznej, co ułatwi utrzymanie i zmniejszy ryzyko błędów.

- **Zadanie 5: (PILNE) Naprawa błędów kompilacji TypeScript** - ✅ **Wykonane**
  - **Instrukcja:** Zdiagnozuj i napraw wszystkie błędy kompilacji TypeScript w całym monorepo (frontend i backend), aby umożliwić pomyślne wykonanie skryptów `build`.

- **Zadanie 6: Unifikacja AWS SDK (Backend)** - ✅ **Wykonane**
  - **Instrukcja:** Zrefaktoryzuj kod tak, aby używał wyłącznie `@aws-sdk/client-s3` (v3). Następnie odinstaluj pakiet `aws-sdk` (v2).

- **Zadanie 7: Unifikacja Walidacji (Backend)** - ✅ **Wykonane**
  - **Instrukcja:** Zastąp wszystkie użycia `express-validator` logiką opartą na `zod`. Po zakończeniu refaktoryzacji odinstaluj pakiet `express-validator`.

- **Zadanie 8: Centralizacja Obsługi Błędów (Backend)** - ✅ **Wykonane**
  - **Instrukcja:** Upewnij się, że middleware `errorHandler.middleware.ts` jest zaimplementowane na samym końcu łańcucha middleware w `server.ts`. Zrefaktoryzuj logikę w kontrolerach, aby używały `next(error)` zamiast `res.status().json()`.

## Faza III: Refaktoryzacja Logiki Backendu

**Cel:** Poprawa architektury backendu przez przeniesienie logiki biznesowej do warstwy serwisowej.

- **Zadanie 9: Refaktoryzacja `deliveryController.ts`** - ✅ **Wykonane**
  - **Instrukcja:** Przenieś logikę parsowania `req.query` z pliku `deliveryController.ts` do nowej metody w `deliveryService.ts`.

- **Zadanie 10: Audyt pozostałych kontrolerów** - ✅ **Wykonane**
  - **Instrukcja:** Przeanalizuj pozostałe kontrolery pod kątem logiki biznesowej i przenieś ją do odpowiednich serwisów.

## Faza IV: Modernizacja Frontendu

**Cel:** Wprowadzenie nowoczesnego zarządzania stanem i danymi.

- **Zadanie 11: Wprowadzenie TanStack Query (React Query)** - ✅ **Wykonane**
  - **Instrukcja:** Zainstaluj `@tanstack/react-query` i skonfiguruj `QueryClientProvider` w `main.tsx`.

- **Zadanie 12: Pierwsze użycie React Query** - ✅ **Wykonane**
  - **Instrukcja:** Zrefaktoryzuj stronę `AdminProductsPage.tsx`, usuwając mockowane dane i implementując hook `useQuery` do pobrania danych z API.

- **Zadanie 13: Wprowadzenie Zustanda dla stanu globalnego** - ✅ **Wykonane**
  - **Instrukcja:** Zainstaluj `zustand` i stwórz prosty 'store' do zarządzania stanem UI (np. otwarcia paska bocznego).

## Faza V: Finalne Czyszczenie (Code Smells)

**Cel:** Poprawa czytelności i jakości kodu.

- **Zadanie 14: Centralizacja stałych wartości** - ✅ **Wykonane**
  - **Instrukcja:** Stwórz pliki `constants.ts` w `backend` i `frontend`. Przenieś do nich "magiczne" wartości (URL-e, klucze, timeouty).

- **Zadanie 15: Usunięcie `console.log`** - ✅ **Wykonane**
  - **Instrukcja:** Usuń z całego projektu deweloperskie wywołania `console.log` i zastąp je dedykowanym loggerem.
