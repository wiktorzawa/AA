# DZIENNIK PROJEKTU: Aplikacja do Zarządzania Dostawami

_Dokument ten jest naszym centralnym źródłem prawdy i systemem operacyjnym projektu. Jest on zarządzany przez Głównego Architekta (AI) i aktualizowany po każdej kluczowej decyzji._

---

## 1. GŁÓWNE CELE STRATEGICZNE

- Stworzenie w pełni funkcjonalnej, skalowalnej aplikacji webowej do zarządzania dostawami dla wielu dostawców.
- Zapewnienie intuicyjnego i wydajnego interfejsu użytkownika opartego na bibliotece Flowbite Pro.
- Migracja logiki biznesowej z przestarzałego backendu Express.js na nowoczesny, stabilny backend oparty na Strapi.
- Zapewnienie wysokiej jakości kodu, zgodnego z najlepszymi praktykami i standardami.

---

## 2. AKTUALNY PLAN DZIAŁANIA (GŁÓWNA LISTA TODO)

_Ta sekcja jest automatycznie synchronizowana z listą zadań w naszym środowisku deweloperskim._

1.  **(UKOŃCZONE)** `analyze_frontend_api`: Przeanalizuj kod źródłowy frontendu, aby zmapować wszystkie używane endpointy API i oczekiwane struktury danych.
2.  **(UKOŃCZONE)** `analyze_db_schema`: Przeanalizuj stary zrzut bazy danych SQL, aby zrozumieć oryginalne modele danych i relacje między nimi.
3.  **(UKOŃCZONE)** `scaffold_new_strapi`: Stwórz zupełnie nowy, czysty projekt Strapi v5 od podstaw.
4.  **(UKOŃCZONE)** `configure_strapi_env`: Skonfiguruj plik .env w nowym projekcie Strapi, aby połączyć się z czystą bazą danych na AWS RDS.
5.  **(UKOŃCZONE)** `run_new_strapi`: Uruchom nową instancję Strapi, aby zweryfikować połączenie z bazą danych i automatycznie wygenerować schemat.
6.  **(UKOŃCZONE)** `recreate_user_related_types`: Odtwórz typy treści `Supplier` i `Staff` oraz ich dwukierunkową relację z wbudowanym modelem `User`.
7.  **(W TRAKCIE)** `implement_authentication_flow`: Zaimplementuj proces logowania i uwierzytelniania na frontendzie, łącząc go z wtyczką `users-permissions` w Strapi.
8.  **(OCZEKUJĄCE)** `recreate_delivery_types`: Odtwórz typy treści związane z logiką dostaw (np. `Delivery`, `DeliveryProduct`).
9.  **(OCZEKUJĄCE)** `refactor_frontend_for_new_backend`: Zrefaktoryzuj wywołania API na frontendzie, aby były w pełni zgodne z nowym, czystym backendem Strapi.
10. **(OCZEKUJĄCE)** `e2e_testing`: Przeprowadź pełne testy End-to-End kluczowych funkcjonalności aplikacji (logowanie, dodawanie dostaw, etc.).

---

## 3. PARKING DLA POMYSŁÓW (Do wdrożenia w przyszłości)

_Tutaj zapisujemy wszystkie pomysły, które nie są częścią bieżącego planu, aby do nich wrócić później._

- Integracja z systemem fakturowania.
- Moduł analityczny i raportowy.
- Powiadomienia e-mail dla dostawców.
- Wdrożenie WebSocket dla powiadomień w czasie rzeczywistym.

---

## 4. KRYTYCZNE DECYZJE ARCHITEKTONICZNE

_Dziennik najważniejszych decyzji, które podjęliśmy._

- **2025-07-11:** Zmieniono priorytet prac. Zamiast kontynuować tworzenie typów treści, skupiamy się na wdrożeniu pełnego procesu logowania i uwierzytelniania, aby odblokować testowanie kluczowych przepływów użytkownika.
- **2025-07-11:** Pomyślnie odtworzono kluczowe typy treści (`Supplier`, `Staff`) w nowej instancji Strapi v5. Ustanowiono dwukierunkową relację `oneToOne` z wbudowanym modelem `User` poprzez poprawne rozszerzenie jego schematu. Ten krok odblokowuje implementację logiki biznesowej związanej z użytkownikami.
- **2025-07-11:** Pomyślnie uruchomiono nową instancję Strapi v5. Aplikacja poprawnie połączyła się z docelową, czystą bazą danych `strapi_db_clean` na AWS RDS, co stanowiło kluczowy kamień milowy i odblokowało dalsze prace nad backendem.
- **2025-07-11:** Zakończono fazę analityczną. Na podstawie kodu frontendu oraz schematu starej bazy danych (`backup_bazy_danych.sql`) zdefiniowano kompletny, finalny schemat danych dla nowego backendu.
- **2025-07-11:** Odrzucono plan migracji danych za pomocą skryptu na rzecz stworzenia całkowicie nowej, czystej instancji Strapi i ręcznego odtworzenia modeli danych.
- **2025-07-11:** Stworzono nowy, pusty projekt Strapi v5 (TypeScript), gotowy do dalszej konfiguracji i implementacji schematu.
- **2025-07-10:** Podjęto decyzję o całkowitym resecie technicznym projektu.
- **2025-07-10:** Zamiast łatać istniejącą bazę danych i instancję Strapi, tworzymy nową, czystą bazę danych na AWS RDS i podłączamy do niej świeżo skonfigurowane Strapi.
- **2025-07-10:** Ustalono hierarchię i model operacyjny dla AI i narzędzi wspomagających (Gemini, Copilot, AMP).
- **2025-07-10:** Wprowadzono `DZIENNIK_PROJEKTU.md` jako centralne źródło prawdy o projekcie.

---

## 5. ZASADY I STANDARDY PROJEKTU

_Najważniejsze reguły, których przestrzegamy._

- **Backend:** Node.js + Strapi
- **Frontend:** React + TypeScript + Vite
- **UI Kit:** Flowbite Pro (używamy gotowych komponentów, ZAWSZE)
- **Styling:** Tailwind CSS (zgodnie z `tailwind.config.js`)
- **Linting & Formatting:** ESLint + Prettier (zero błędów i ostrzeżeń)
- **Typowanie:** TypeScript w trybie `strict`. Zakaz używania `any`.
- **Struktura API:** RESTful
- **Baza Danych:** MySQL na AWS RDS
- **Zarządzanie Stanem (Frontend):** Zustand
