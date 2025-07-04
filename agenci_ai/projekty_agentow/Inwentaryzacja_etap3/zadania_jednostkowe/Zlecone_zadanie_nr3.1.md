# ZLECENIE ZADANIA NR: 3.1

## 1. Kontekst Zadania

- **Stan Aktualny:** Metoda `uploadDeliveryFile` w `deliveryController.ts` zawiera logikę biznesową, która niepotrzebnie ją "pogrubia".
- **Powiązane Poprzednie Zadanie:** Audyt (Pytanie 5) wykazał naruszenie wzorca "chudego kontrolera".
- **Cel Główny Tego Zadania:** Przeniesienie logiki biznesowej z kontrolera do serwisu, aby kontroler był odpowiedzialny tylko za obsługę żądania i odpowiedzi.

## 2. Szczegółowy Opis Zlecenia i Etapy Realizacji

1.  Przejdź do pliku `backend/src/controllers/deliveryController.ts`.
2.  Przeanalizuj metodę `uploadDeliveryFile`.
3.  Przenieś całą logikę odpowiedzialną za:
    - Wyłuskiwanie pliku z `req.files` (obsługa `deliveryFile` i `file`).
    - Określanie `supplierId` (z `req.body` lub `req.user`).
    - Pobieranie `confirmDeliveryNumber` z `req.body`.
      do nowej metody w serwisie `deliveryService.ts`.
4.  Sugerowana sygnatura nowej metody w serwisie to `uploadAndProcessFile(req: AuthenticatedRequest)`. Powinna ona przyjmować cały obiekt `req`, aby mieć dostęp do `files`, `body` i `user`.
5.  W kontrolerze `uploadDeliveryFile` pozostaw tylko wywołanie nowej metody serwisowej: `const result = await this.deliveryService.uploadAndProcessFile(req);`.
6.  Upewnij się, że po refaktoryzacji endpoint `POST /deliveries/upload` działa tak samo jak wcześniej. Przeprowadź test (może być manualny, np. przez Postmana, lub jeśli istnieją, automatyczny) przesyłania pliku, aby zweryfikować poprawność działania.

## 3. Oczekiwany Rezultat

- Metoda `uploadDeliveryFile` w `deliveryController.ts` jest "chuda" i zawiera tylko wywołanie metody serwisowej.
- Cała logika biznesowa związana z przetwarzaniem danych wejściowych została przeniesiona do `deliveryService.ts`.
- Endpoint działa w pełni poprawnie po zmianach.
- Kod jest czystszy i lepiej zorganizowany.

## 4. Wymagania Dotyczące Raportu od Wykonawcy

- Raport musi zawierać szczegółowy opis wykonanych kroków.
- W raporcie muszą znaleźć się fragmenty kodu "przed" i "po" dla obu modyfikowanych plików (`deliveryController.ts` i `deliveryService.ts`).
- Raport musi zawierać opis przeprowadzonej weryfikacji (np. "Przetestowano endpoint POST /deliveries/upload za pomocą Postmana, przesyłając plik jako zalogowany dostawca - operacja zakończona sukcesem").
- W raporcie musi znaleźć się sekcja opisująca ewentualne napotkane problemy i sposób ich rozwiązania.
