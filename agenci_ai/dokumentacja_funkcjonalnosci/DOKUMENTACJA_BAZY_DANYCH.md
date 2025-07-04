# Dokumentacja Architektury Bazy Danych

## 1. Wprowadzenie i Stos Technologiczny

System bazodanowy aplikacji opiera się na następujących technologiach:

- **System Bazy Danych:** **MySQL** - popularny, relacyjny system zarządzania bazą danych (RDBMS).
- **ORM (Object-Relational Mapper):** **Sequelize** - nowoczesny ORM dla Node.js, który umożliwia pracę z bazą danych przy użyciu obiektów i metod JavaScript/TypeScript, eliminując potrzebę pisania surowych zapytań SQL.
- **Sterownik:** **mysql2** - wydajny sterownik Node.js dla bazy danych MySQL, używany przez Sequelize do nawiązywania i zarządzania połączeniami.

Architektura ta pozwala na szybki rozwój, utrzymanie czystości kodu oraz zapewnia wysoki poziom bezpieczeństwa (np. poprzez automatyczną ochronę przed atakami SQL Injection).

## 2. Analiza Tabel i Relacji

Poniżej znajduje się szczegółowa analiza każdej tabeli zdefiniowanej w modelach aplikacji.

---

### Moduł: Autoryzacja (`auth_*`)

Moduł ten odpowiada za zarządzanie użytkownikami, ich danymi personalnymi, uwierzytelnianiem i autoryzacj��.

#### Tabela: `auth_pracownicy`

Przechowuje dane osobowe pracowników i administratorów systemu.

| Nazwa Kolumny       | Typ Danych     | Klucz/Indeks | Opis                                                              |
| ------------------- | -------------- | ------------ | ----------------------------------------------------------------- |
| `id_pracownika`     | `VARCHAR(20)`  | **PK**       | Unikalny identyfikator pracownika (np. `STF/00001`, `ADM/00001`). |
| `imie`              | `VARCHAR(50)`  | Indeks       | Imię pracownika.                                                  |
| `nazwisko`          | `VARCHAR(50)`  | Indeks       | Nazwisko pracownika.                                              |
| `rola`              | `ENUM`         | Indeks       | Rola w systemie (`admin` lub `staff`).                            |
| `adres_email`       | `VARCHAR(255)` | **Unikalny** | Adres email pracownika, używany również do logowania.             |
| `telefon`           | `VARCHAR(20)`  | Indeks       | Numer telefonu (opcjonalnie).                                     |
| `data_utworzenia`   | `DATETIME`     | -            | Data utworzenia rekordu.                                          |
| `data_aktualizacji` | `DATETIME`     | -            | Data ostatniej modyfikacji rekordu.                               |

- **Ilość Indeksów:** 5 (PK, imie+nazwisko, rola, email, telefon).
- **Relacje:**
  - **`hasOne: auth_dane_autoryzacji`**: Każdy pracownik ma dokładnie jeden powiązany rekord z danymi logowania.

#### Tabela: `auth_dostawcy`

Przechowuje dane firmowe dostawców, którzy są użytkownikami systemu.

| Nazwa Kolumny          | Typ Danych     | Klucz/Indeks | Opis                                               |
| ---------------------- | -------------- | ------------ | -------------------------------------------------- |
| `id_dostawcy`          | `VARCHAR(20)`  | **PK**       | Unikalny identyfikator dostawcy (np. `SUP/00001`). |
| `nazwa_firmy`          | `VARCHAR(255)` | Indeks       | Pełna nazwa firmy dostawcy.                        |
| `numer_nip`            | `VARCHAR(20)`  | **Unikalny** | Numer NIP firmy.                                   |
| `adres_email`          | `VARCHAR(255)` | **Unikalny** | Główny adres email firmy, używany do logowania.    |
| `adres_miasto`         | `VARCHAR(100)` | Indeks       | Miejscowość siedziby firmy.                        |
| `...` (pozostałe dane) | `VARCHAR`      | -            | Dane kontaktowe i adresowe.                        |
| `data_utworzenia`      | `DATETIME`     | -            | Data utworzenia rekordu.                           |
| `data_aktualizacji`    | `DATETIME`     | -            | Data ostatniej modyfikacji rekordu.                |

- **Ilość Indeksów:** 5 (PK, nazwa_firmy, nip, email, miasto).
- **Relacje:**
  - **`hasOne: auth_dane_autoryzacji`**: Każdy dostawca ma dokładnie jeden powiązany rekord z danymi logowania.

#### Tabela: `auth_dane_autoryzacji`

Centralna tabela przechowująca dane logowania dla **wszystkich** użytkowników (pracowników i dostawców).

| Nazwa Kolumny          | Typ Danych     | Klucz/Indeks    | Opis                                                        |
| ---------------------- | -------------- | --------------- | ----------------------------------------------------------- |
| `id_logowania`         | `VARCHAR(25)`  | **PK**          | Unikalny identyfikator logowania (np. `ADM/0001/LOG`).      |
| `id_uzytkownika`       | `VARCHAR(20)`  | **FK/Unikalny** | Klucz obcy wskazujący na `id_pracownika` lub `id_dostawcy`. |
| `adres_email`          | `VARCHAR(255)` | **Unikalny**    | Adres email używany do logowania.                           |
| `hash_hasla`           | `VARCHAR(255)` | -               | Zahaszowane hasło użytkownika.                              |
| `rola_uzytkownika`     | `ENUM`         | Indeks          | Rola użytkownika (`admin`, `staff`, `supplier`).            |
| `...` (pozostałe dane) | `INT`, `DATE`  | -               | Pola do obsługi blokady konta i śledzenia logowań.          |
| `data_utworzenia`      | `DATETIME`     | -               | Data utworzenia rekordu.                                    |
| `data_aktualizacji`    | `DATETIME`     | -               | Data ostatniej modyfikacji rekordu.                         |

- **Ilość Indeksów:** 4 (PK, id_uzytkownika, email, rola).
- **Relacje:**
  - **`belongsTo: auth_pracownicy` (jako `admin` lub `staff`)**: Rekord logowania należy do jednego pracownika.
  - **`belongsTo: auth_dostawcy` (jako `supplier`)**: Rekord logowania należy do jednego dostawcy.
  - **`hasMany: auth_historia_logowan`**: Jeden rekord logowania może mieć wiele wpisów w historii logowań.

#### Tabela: `auth_historia_logowan`

Tabela śledząca wszystkie próby logowania do systemu.

| Nazwa Kolumny          | Typ Danych    | Klucz/Indeks  | Opis                                                               |
| ---------------------- | ------------- | ------------- | ------------------------------------------------------------------ |
| `id_wpisu`             | `INTEGER`     | **PK (AI)**   | Unikalny, auto-inkrementowany identyfikator wpisu.                 |
| `id_logowania`         | `VARCHAR(25)` | **FK/Indeks** | Klucz obcy wskazujący na `id_logowania` w `auth_dane_autoryzacji`. |
| `data_proby_logowania` | `DATETIME`    | Indeks        | Dokładny czas próby logowania.                                     |
| `status_logowania`     | `ENUM`        | Indeks        | Status próby (`success` lub `failed`).                             |
| `...` (pozostałe dane) | `DATETIME`    | -             | Pola do śledzenia czasu trwania sesji.                             |

- **Ilość Indeksów:** 4 (PK, id_logowania, data_proby, status+data).
- **Relacje:**
  - **`belongsTo: auth_dane_autoryzacji`**: Każdy wpis w historii należy do jednego rekordu logowania.

---

### Moduł: Dostawy (`dost_*`)

Moduł ten odpowiada za zarządzanie procesem dostaw od dostawców, weryfikację produktów i obsługę finansową.

#### Tabela: `dost_nowa_dostawa`

Główna tabela przechowująca informacje o każdej zarejestrowanej dostawie.

| Nazwa Kolumny        | Typ Danych     | Klucz/Indeks  | Opis                                                      |
| -------------------- | -------------- | ------------- | --------------------------------------------------------- |
| `id_dostawy`         | `VARCHAR(50)`  | **PK**        | Unikalny identyfikator dostawy (np. `DST/PL10023609`).    |
| `id_dostawcy`        | `VARCHAR(20)`  | **FK/Indeks** | Klucz obcy wskazujący na `id_dostawcy` w `auth_dostawcy`. |
| `id_pliku`           | `VARCHAR(255)` | **Unikalny**  | Unikalny identyfikator przesłanego pliku.                 |
| `nazwa_pliku`        | `VARCHAR(255)` | Indeks        | Oryginalna nazwa pliku od dostawcy.                       |
| `url_pliku_S3`       | `TEXT`         | -             | Link do pliku przechowywanego w usłudze Amazon S3.        |
| `status_weryfikacji` | `ENUM`         | Indeks        | Aktualny status przetwarzania dostawy.                    |
| `data_utworzenia`    | `DATETIME`     | Indeks        | Data utworzenia rekordu.                                  |
| `data_aktualizacji`  | `DATETIME`     | -             | Data ostatniej modyfikacji rekordu.                       |

- **Ilość Indeksów:** 6 (PK, id_pliku, id_dostawcy, status, data, id_dostawcy+status, nazwa_pliku).
- **Relacje:**
  - **`belongsTo: auth_dostawcy`**: Każda dostawa należy do jednego dostawcy.
  - **`hasMany: dost_dostawy_produkty`**: Jedna dostawa zawiera wiele produktów.
  - **`hasOne: dost_finanse_dostaw`**: Do każdej dostawy przypisany jest jeden rekord finansowy.
  - **`hasMany: dost_faktury_dostawcow`**: Do jednej dostawy można przypisać wiele faktur.

#### Tabela: `dost_dostawy_produkty`

Szczegółowa tabela przechowująca informacje o każdym produkcie w ramach danej dostawy.

| Nazwa Kolumny          | Typ Danych       | Klucz/Indeks  | Opis                                                               |
| ---------------------- | ---------------- | ------------- | ------------------------------------------------------------------ |
| `id_produktu_dostawy`  | `INTEGER`        | **PK (AI)**   | Unikalny, auto-inkrementowany identyfikator produktu w dostawie.   |
| `id_dostawy`           | `VARCHAR(50)`    | **FK/Indeks** | Klucz obcy wskazujący na `id_dostawy` w `dost_nowa_dostawa`.       |
| `kod_ean`              | `VARCHAR(13)`    | Indeks        | Kod EAN produktu.                                                  |
| `kod_asin`             | `VARCHAR(20)`    | Indeks        | Kod ASIN produktu.                                                 |
| `status_weryfikacji`   | `ENUM`           | Indeks        | Status weryfikacji pojedynczego produktu.                          |
| `...` (pozostałe dane) | `VARCHAR`, `INT` | Indeksy       | Elastyczne pola mapowane z plików dostawców (LPN, kategoria itp.). |
| `data_utworzenia`      | `DATETIME`       | Indeks        | Data utworzenia rekordu.                                           |
| `data_aktualizacji`    | `DATETIME`       | -             | Data ostatniej modyfikacji rekordu.                                |

- **Ilość Indeksów:** 8 (PK, id_dostawy, ean, asin, status, data, kraj, kategoria).
- **Relacje:**
  - **`belongsTo: dost_nowa_dostawa`**: Każdy produkt należy do jednej, konkretnej dostawy.

#### Tabela: `dost_finanse_dostaw`

Tabela z danymi finansowymi dostaw, zawierająca kalkulacje kosztów i marż.

| Nazwa Kolumny          | Typ Danych       | Klucz/Indeks  | Opis                                                         |
| ---------------------- | ---------------- | ------------- | ------------------------------------------------------------ |
| `id_finanse_dostawy`   | `INTEGER`        | **PK (AI)**   | Unikalny, auto-inkrementowany identyfikator.                 |
| `id_dostawy`           | `VARCHAR(50)`    | **FK/Indeks** | Klucz obcy wskazujący na `id_dostawy` w `dost_nowa_dostawa`. |
| `...` (pozostałe dane) | `DECIMAL`, `INT` | Indeksy       | Pola z obliczonymi wartościami (koszt, marża, VAT itp.).     |
| `data_utworzenia`      | `DATETIME`       | Indeks        | Data utworzenia rekordu.                                     |
| `data_aktualizacji`    | `DATETIME`       | -             | Data ostatniej modyfikacji rekordu.                          |

- **Ilość Indeksów:** 5 (PK, id_dostawy, waluta, data, stawka_vat).
- **Relacje:**
  - **`belongsTo: dost_nowa_dostawa`**: Każdy rekord finansowy jest przypisany do jednej dostawy.

#### Tabela: `dost_faktury_dostawcow`

Tabela przechowująca informacje o fakturach powiązanych z dostawcami i dostawami.

| Nazwa Kolumny          | Typ Danych        | Klucz/Indeks  | Opis                                                      |
| ---------------------- | ----------------- | ------------- | --------------------------------------------------------- |
| `id_faktury`           | `INTEGER`         | **PK (AI)**   | Unikalny, auto-inkrementowany identyfikator faktury.      |
| `id_dostawcy`          | `VARCHAR(20)`     | **FK/Indeks** | Klucz obcy wskazujący na `id_dostawcy` w `auth_dostawcy`. |
| `id_dostawy`           | `VARCHAR(50)`     | **FK/Indeks** | Klucz obcy do `dost_nowa_dostawa` (może być `NULL`).      |
| `numer_faktury`        | `VARCHAR(100)`    | **Unikalny**  | Numer faktury nadany przez dostawcę.                      |
| `status_platnosci`     | `ENUM`            | Indeks        | Status płatności faktury (`pending`, `paid` itp.).        |
| `...` (pozostałe dane) | `DECIMAL`, `DATE` | Indeksy       | Kwoty, daty i waluta faktury.                             |
| `data_utworzenia`      | `DATETIME`        | Indeks        | Data utworzenia rekordu.                                  |
| `data_aktualizacji`    | `DATETIME`        | -             | Data ostatniej modyfikacji rekordu.                       |

- **Ilość Indeksów:** 9 (PK, numer_faktury, id_dostawcy, id_dostawy, data_faktury, data_platnosci, status, waluta, data_utworzenia).
- **Relacje:**
  - **`belongsTo: auth_dostawcy`**: Każda faktura jest wystawiona przez jednego dostawcę.
  - **`belongsTo: dost_nowa_dostawa`**: Faktura może być powiązana z jedną dostawą.

---

### Moduł: Produkty (`prod_*`)

Moduł ten (obecnie jedna tabela) służy do przechowywania danych o produktach pobranych z zewnętrznych źródeł, np. z Amazon.

#### Tabela: `prod_amazon_produkty`

Agreguje szczegółowe dane o produktach z platformy Amazon.

| Nazwa Kolumny          | Typ Danych      | Klucz/Indeks | Opis                                               |
| ---------------------- | --------------- | ------------ | -------------------------------------------------- |
| `id`                   | `INTEGER`       | **PK (AI)**  | Unikalny, auto-inkrementowany identyfikator.       |
| `asin`                 | `VARCHAR`       | **Unikalny** | Unikalny identyfikator produktu Amazon (ASIN).     |
| `title`                | `VARCHAR(1000)` | -            | Tytuł produktu.                                    |
| `brand`                | `VARCHAR`       | Indeks       | Marka produktu.                                    |
| `seller_id`            | `VARCHAR`       | Indeks       | Identyfikator sprzedawcy.                          |
| `root_bs_category`     | `VARCHAR`       | Indeks       | Główna kategoria Bestsellera.                      |
| `lastScraped`          | `DATETIME`      | Indeks       | Data ostatniego pobrania danych o produkcie.       |
| `...` (pozostałe dane) | `JSON`, `TEXT`  | -            | Bardzo dużo szczegółowych pól opisujących produkt. |

- **Ilość Indeksów:** 6 (PK, asin, lastScraped, brand, seller_id, root_bs_category).
- **Relacje:** Obecnie ta tabela nie ma zdefiniowanych bezpośrednich relacji z innymi tabelami w systemie. Służy jako zewnętrzne źródło danych.

## 3. Podsumowanie Architektury

Architektura bazy danych jest dobrze przemyślana i zmodularyzowana.

- **Separacja Kontekstów:** Wyraźnie oddzielono logikę **autoryzacji** (`auth_*`) od logiki biznesowej **dostaw** (`dost_*`) oraz danych produktowych (`prod_*`).
- **Polimorfizm w Uwierzytelnianiu:** Tabela `auth_dane_autoryzacji` w sprytny sposób obsługuje logowanie dla różnych typów użytkowników (pracowników i dostawców) poprzez jedną, spójną strukturę.
- **Normalizacja:** Dane są dobrze znormalizowane, co zapobiega redundancji (np. dane adresowe dostawcy są w jednym miejscu).
- **Indeksowanie:** Kluczowe kolumny używane w zapytaniach (klucze obce, statusy, daty, unikalne identyfikatory) są odpowiednio zindeksowane, co zapewnia wysoką wydajność zapytań.
- **Elastyczność:** Tabela `dost_dostawy_produkty` została zaprojektowana w sposób elastyczny, aby mogła przyjmować dane z różnych formatów plików dostawców, co jest dużym plusem w realnym scenariuszu biznesowym.
