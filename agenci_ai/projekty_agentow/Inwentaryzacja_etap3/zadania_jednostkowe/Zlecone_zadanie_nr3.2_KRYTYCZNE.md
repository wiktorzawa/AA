# ZLECENIE ZADANIA NR: 3.2 (PRIORYTET KRYTYCZNY)

## 1. Kontekst Zadania

- **Stan Aktualny:** Wszystkie endpointy w pliku `adsPowerRoutes.ts` są publicznie dostępne, co stanowi krytyczną lukę w bezpieczeństwie, pozwalając na nieautoryzowane operacje na profilach i grupach AdsPower.
- **Powiązane Poprzednie Zadanie:** Audyt (Pytanie 6) zidentyfikował tę lukę.
- **Cel Główny Tego Zadania:** Natychmiastowe zabezpieczenie wszystkich endpointów w `adsPowerRoutes.ts` w celu uniemożliwienia nieautoryzowanego dostępu.

## 2. Szczegółowy Opis Zlecenia i Etapy Realizacji

1.  Przejdź do pliku `backend/src/routes/adsPowerRoutes.ts`.
2.  Zaimportuj middleware `authenticateToken` oraz `requireRole` z `../middleware`.
3.  Dodaj globalne zabezpieczenie dla wszystkich tras w tym pliku poprzez dodanie na górze pliku (pod definicją `router`):
    ```typescript
    router.use(authenticateToken);
    router.use(requireRole("admin")); // Założenie: tylko admin może zarządzać AdsPower
    ```
4.  Jeśli istnieją endpointy, które powinny być dostępne dla innych ról (np. `staff`), zastosuj `requireRole` na poziomie konkretnej trasy, a nie globalnie. Na podstawie nazw endpointów wydaje się, że wszystkie operacje powinien wykonywać tylko admin.
5.  Dokładnie zweryfikuj, czy po dodaniu middleware dostęp do endpointów jest prawidłowo blokowany dla niezalogowanych użytkowników oraz użytkowników z niewystarczającymi uprawnieniami. Użyj Postmana lub podobnego narzędzia do przetestowania kilku endpointów (np. `GET /profiles`, `POST /create-profile`).

## 3. Oczekiwany Rezultat

- Wszystkie endpointy w `adsPowerRoutes.ts` są chronione i wymagają uwierzytelnienia oraz odpowiedniej roli (domyślnie `admin`).
- Nieautoryzowany dostęp do endpointów jest niemożliwy.
- Krytyczna luka bezpieczeństwa została zamknięta.

## 4. Wymagania Dotyczące Raportu od Wykonawcy

- Raport musi zawierać szczegółowy opis wykonanych kroków.
- W raporcie muszą znaleźć się fragmenty kodu "przed" i "po" dla pliku `adsPowerRoutes.ts`.
- Raport musi zawierać **szczegółowy opis przeprowadzonej weryfikacji bezpieczeństwa**, w tym wyniki prób dostępu jako:
  - Użytkownik niezalogowany (oczekiwany błąd 401).
  - Użytkownik z rolą `staff` lub `supplier` (oczekiwany bł��d 403).
  - Użytkownik z rolą `admin` (oczekiwany sukces 2xx).
- Raport musi potwierdzić zamknięcie luki bezpieczeństwa.
