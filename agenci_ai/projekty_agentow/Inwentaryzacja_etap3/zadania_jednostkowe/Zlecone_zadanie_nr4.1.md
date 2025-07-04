# ZLECENIE ZADANIA NR: 4.1

## 1. Kontekst Zadania

- **Stan Aktualny:** W wielu miejscach w kodzie (backend i frontend) nazwy ról użytkowników (`admin`, `staff`, `supplier`) są zahardkodowane jako stringi ("magiczne wartości").
- **Powiązane Poprzednie Zadanie:** Audyt (Pytanie 7) wykazał ten problem w wielu plikach.
- **Cel Główny Tego Zadania:** Zastąpienie wszystkich zahardkodowanych nazw ról stałymi z pliku `constants.ts`, aby zwiększyć czytelność, ułatwić utrzymanie kodu i uniknąć błędów literowych.

## 2. Szczegółowy Opis Zlecenia i Etapy Realizacji

1.  Upewnij się, że w pliku `backend/src/constants.ts` istnieje i jest wyeksportowany obiekt lub enum przechowujący role, np.:
    ```typescript
    export const ROLES = {
      ADMIN: "admin",
      STAFF: "staff",
      SUPPLIER: "supplier",
    } as const;
    ```
2.  Przeszukaj cały katalog `backend/src/` w poszukiwaniu stringów `'admin'`, `'staff'`, `'supplier'`.
3.  W każdym znalezionym pliku (np. `requireAdmin.middleware.ts`, `deliveryRoutes.ts`, etc.) zaimportuj obiekt `ROLES` i zastąp stringi odpowiednimi stałymi (np. `'admin'` na `ROLES.ADMIN`).
4.  Upewnij się, ��e w pliku `src/constants.ts` (frontend) również istnieje podobny, wyeksportowany obiekt `ROLES`.
5.  Przeszukaj cały katalog `src/` (frontend) w poszukiwaniu tych samych stringów.
6.  W każdym znalezionym pliku (np. `AdminAddDeliveryPage.tsx`) zaimportuj obiekt `ROLES` i zastąp stringi odpowiednimi stałymi.
7.  Dokładnie zweryfikuj, czy po zmianach aplikacja działa poprawnie, a system ról i uprawnień funkcjonuje bez zmian. Sprawdź logowanie i dostęp do chronionych zasobów dla każdej z ról.

## 3. Oczekiwany Rezultat

- Wszystkie zahardkodowane stringi z nazwami ról w całym projekcie (frontend i backend) zostały zastąpione stałymi z odpowiednich plików `constants.ts`.
- Kod jest czystszy, bardziej czytelny i łatwiejszy w utrzymaniu.
- System uprawnień działa identycznie jak przed refaktoryzacją.

## 4. Wymagania Dotyczące Raportu od Wykonawcy

- Raport musi zawierać szczegółowy opis wykonanych kroków.
- W raporcie muszą znaleźć się fragmenty kodu "przed" i "po" dla **każdego** modyfikowanego pliku.
- Raport musi zawierać opis przeprowadzonej weryfikacji, potwierdzający poprawne działanie systemu ról po zmianach.
- W raporcie musi znaleźć się sekcja opisująca ewentualne napotkane problemy i sposób ich rozwiązania.
