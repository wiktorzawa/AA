# GEMINI PROMPTS & OPERATIONS

Ten plik zawiera zbiór zweryfikowanych promptów i procedur do wykorzystania z modelami AI (Gemini) w celu zarządzania infrastrukturą i analizy kodu projektu.

---

## 1. Tworzenie nowej bazy danych dla Strapi v4 w AWS RDS

**Cel:** Utworzenie nowej, produkcyjnej bazy danych MySQL w usłudze AWS RDS, skonfigurowanej na potrzeby czystej instalacji aplikacji Strapi v4.

**Kontekst:** Procedura jest częścią planu naprawczego aplikacji. Nowa baza danych jest wymagana do zapewnienia kompatybilności schematu i uniknięcia problemów z migracją danych. Konfiguracja musi uwzględniać publiczny dostęp dla celów deweloperskich.

### 1.1. Specyfikacja konfiguracji bazy danych

Poniższe kroki należy wykonać w konsoli AWS w usłudze RDS.

#### **1. Podstawowa konfiguracja**
* **Metoda tworzenia:** `Standard create`
* **Platforma:** `AWS RDS`
* **Silnik bazy danych:** `MySQL`
* **Wersja silnika:** `MySQL 8.0.x` (lub najnowsza stabilna wersja zgodna ze Strapi v4)
* **Szablon (Template):** `Free tier` (Warstwa bezpłatna) ⚠️ **Uwaga:** Upewnij się, że konto kwalifikuje się do warstwy bezpłatnej, aby uniknąć kosztów.

#### **2. Ustawienia instancji (Settings)**
* **Identyfikator instancji DB (DB instance identifier):** `strapi-prod-db-instance`
* **Typ instancji (Instance class):** `db.t3.micro` (lub inna z `Free tier`)
* **Główna nazwa użytkownika (Master username):** `strapi_admin`
* **Główne hasło (Master password):** Wygeneruj silne, bezpieczne hasło i zapisz je w menedżerze haseł.

#### **3. Konfiguracja połączenia (Connectivity)**
* **Dostęp publiczny (Public access):** `Yes`
    *  **Kluczowa uwaga bezpieczeństwa:** To ustawienie jest wymagane **tylko na etapie deweloperskim**. W środowisku produkcyjnym dostęp musi być ograniczony wyłącznie do zasobów wewnątrz VPC.
* **Grupa zabezpieczeń VPC (VPC security group):**
    * Wybierz `Create new`.
    * **Nazwa nowej grupy:** `strapi-db-dev-access`
    * **Reguły przychodzące (Inbound Rules):** Po utworzeniu zezwól na ruch na porcie `3306` (MySQL) z `0.0.0.0/0` (na czas developmentu) lub z Twojego konkretnego adresu IP.

#### **4. Konfiguracja bazy danych (Database options)**
* **Początkowa nazwa bazy danych (Initial database name):** `strapi_db_clean`

---

### 1.2. Zadanie do wykonania

1.  Zaloguj się do konsoli zarządzania AWS.
2.  Przejdź do usługi **RDS**.
3.  Kliknij przycisk **"Create database"**.
4.  Skonfiguruj wszystkie opcje **dokładnie według powyższej specyfikacji**.
5.  Zainicjuj proces tworzenia bazy danych i poczekaj na status **"Available"**.
6.  Pobierz **Endpoint** z widoku szczegółów instancji bazy danych.

---

### 1.3. ✅ Oczekiwany rezultat: Dane do pliku `.env`

Po pomyślnym utworzeniu bazy danych, uzupełnij poniższy szablon.

```env
# Strapi v4 Database Configuration - AWS RDS MySQL

DATABASE_HOST=[Wklej tutaj Endpoint bazy danych z konsoli AWS]
DATABASE_PORT=3306
DATABASE_NAME=strapi_db_clean
DATABASE_USERNAME=strapi_admin
DATABASE_PASSWORD=[Wklej tutaj wygenerowane główne hasło]
DATABASE_SSL=false
```