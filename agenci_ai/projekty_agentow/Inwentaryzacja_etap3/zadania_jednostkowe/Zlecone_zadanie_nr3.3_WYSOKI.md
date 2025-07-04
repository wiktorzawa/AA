# ZLECENIE ZADANIA NR: 3.3 (PRIORYTET WYSOKI)

## 1. Kontekst Zadania

- **Stan Aktualny:** Endpoint `GET /proxies` w pliku `brightDataRoutes.ts` jest publicznie dostępny, co może prowadzić do wycieku wrażliwych informacji o konfiguracji proxy.
- **Powiązane Poprzednie Zadanie:** Audyt (Pytanie 6) zidentyfikował tę lukę.
- **Cel Główny Tego Zadania:** Zabezpieczenie endpointu w celu uniemożliwienia nieautoryzowanego dostępu.

## 2. Szczegółowy Opis Zlecenia i Etapy Realizacji

1.  Przejdź do pliku `backend/src/routes/brightDataRoutes.ts`.
2.  Odkomentuj lub dodaj import middleware `authenticateToken` oraz `requireRole` z `../middleware`.
3.  Zabezpiecz trasę `GET /proxies` tak, aby była dostępna tylko dla administratorów. Zmodyfikuj linię:
    ```typescript
    router.route("/proxies").get(brightDataController.listBrightDataProxies);
    ```
    na:
    ```typescript
    router
      .route("/proxies")
      .get(
        authenticateToken,
        requireRole("admin"),
        brightDataController.listBrightDataProxies,
      );
    ```
4.  Dokładnie zweryfikuj, czy po dodaniu middleware dostęp do endpointu jest prawidłowo blokowany dla niezalogowanych użytkowników oraz użytkowników z rolą inną niż `admin`. Użyj Postmana lub podobnego narzędzia do testów.

## 3. Oczekiwany Rezultat

- Endpoint `GET /proxies` jest chroniony i wymaga uwierzytelnienia oraz roli `admin`.
- Nieautoryzowany dostęp do endpointu jest niemożliwy.
- Potencjalna luka bezpieczeństwa została zamknięta.

## 4. Wymagania Dotyczące Raportu od Wykonawcy

- Raport musi zawierać szczegółowy opis wykonanych kroków.
- W raporcie muszą znaleźć się fragmenty kodu "przed" i "po" dla pliku `brightDataRoutes.ts`.
- Raport musi zawierać opis przeprowadzonej weryfikacji bezpieczeństwa, w tym wyniki prób dostępu jako użytkownik niezalogowany, zalogowany bez uprawnień i zalogowany jako admin.
- Raport musi potwierdzić zamknięcie luki.
