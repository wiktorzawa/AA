# ZLECENIE ZADANIA NR: 4.2

## 1. Kontekst Zadania

- **Stan Aktualny:** W kodzie źródłowym (głównie w serwisach backendu i plikach API frontendu) znajdują się zahardkodowane adresy URL.
- **Powiązane Poprzednie Zadanie:** Audyt (Pytanie 7) wykazał ten problem w kilku kluczowych plikach.
- **Cel Główny Tego Zadania:** Usunięcie zahardkodowanych adresów URL i przeniesienie ich do zmiennych środowiskowych i plików konfiguracyjnych, aby zwiększyć bezpieczeństwo i elastyczność aplikacji.

## 2. Szczegółowy Opis Zlecenia i Etapy Realizacji

### Backend:

1.  Przejdź do pliku `backend/src/services/adsPowerService.ts`.
2.  Usuń stałą `ADS_POWER_API_URL`. Zamiast tego, wczytaj tę wartość z pliku konfiguracyjnego (`config.ts`), który z kolei powinien ją pobierać ze zmiennej środowiskowej `ADS_POWER_API_URL`.
3.  Przejdź do pliku `backend/src/services/brightDataService.ts`.
4.  Usuń stałą `BRIGHTDATA_API_URL` i, analogicznie do punktu 2, wczytaj ją z konfiguracji opartej o zmienną środowiskową `BRIGHTDATA_API_URL`.
5.  Dodaj nowe zmienne do pliku `.env.example` w katalogu `backend/`, aby udokumentować ich istnienie.

### Frontend:

6.  Przejdź do pliku `src/api/axios.ts`.
7.  Usuń fallback `|| "http://localhost:3001/api"`. Aplikacja powinna polegać wyłącznie na zmiennej `VITE_API_BASE_URL` zdefiniowanej w plikach `.env*`. Rzuć błąd, jeśli zmienna nie jest zdefiniowana, aby zapobiec nieoczekiwanemu zachowaniu.
8.  Przejdź do pliku `src/api/productsApi.ts`.
9.  Przenieś zahardkodowany URL do obrazka (`https://flowbite.s3.amazonaws.com/...`) do pliku `src/constants.ts` jako stałą, np. `DEFAULT_PRODUCT_IMAGE_URL`.
10. Zaimportuj i użyj tej stałej w `productsApi.ts`.

## 3. Oczekiwany Rezultat

- Usunięto wszystkie zahardkodowane adresy URL z serwisów backendu.
- Adresy API usług zewnętrznych (AdsPower, BrightData) są konfigurowalne poprzez zmienne środowiskowe.
- Konfiguracja API frontendu jest bardziej rygorystyczna i polega wyłącznie na zmiennej `VITE_API_BASE_URL`.
- Domyślny URL obrazka produktu jest zarządzany centralnie w pliku stałych.
- Aplikacja jest bardziej elastyczna i bezpieczniejsza.

## 4. Wymagania Dotyczące Raportu od Wykonawcy

- Raport musi zawierać szczegółowy opis wykonanych kroków.
- W raporcie muszą znaleźć się fragmenty kodu "przed" i "po" dla każdego modyfikowanego pliku.
- Raport musi zawierać potwierdzenie, że po zmianach i odpowiedniej konfiguracji zmiennych środowiskowych, wszystkie funkcjonalności (logowanie, pobieranie produktów, komunikacja z AdsPower/BrightData) działają poprawnie.
