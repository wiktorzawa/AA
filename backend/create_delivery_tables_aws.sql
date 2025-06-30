-- Utworzenie tabel dostaw w bazie AWS
USE msbox_db;

-- Wyłącz sprawdzanie kluczy obcych podczas tworzenia tabel
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tabela głównych dostaw
CREATE TABLE `dost_nowa_dostawa` (
  `id_dostawy` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Unikalny numer dostawy wygenerowany z nazwy pliku (np. DST/PL10023609, DST/AM38160)',
  `id_dostawcy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identyfikator dostawcy, który przesłał plik',
  `id_pliku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identyfikator wgranego pliku nadawany automatycznie(przedrostekPLK+"/"+liczba plikow w dostawie+id_dostawy) PLK/xxx/xxxxxxxxx',
  `nazwa_pliku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwa pliku wgranego pliku (np. Dostawa magazyn Wiktor 16.05.2025r Amazon Basics PL10023609_23669-656.xlsx)',
  `url_pliku__s3` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'link do miejsca przechowywania pliku w S3',
  `nr_palet_dostawy` text COLLATE utf8mb4_unicode_ci COMMENT 'Numery palet w dostawie - obsługuje różne formaty: pojedyncze (23669-656), alfanumeryczne (AM38160_90029568233) lub kilka numerów oddzielonych przecinkami/średnikami',
  `status_weryfikacji` enum('nowa','trwa weryfikacja','zweryfikowano','raport','zakończono') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'nowa' COMMENT 'Aktualny status weryfikacji pliku',
  `data_utworzenia` datetime NOT NULL COMMENT 'Data i czas utworzenia rekordu',
  `data_aktualizacji` datetime NOT NULL COMMENT 'Data i czas ostatniej aktualizacji rekordu',
  PRIMARY KEY (`id_dostawy`),
  UNIQUE KEY `id_pliku` (`id_pliku`),
  UNIQUE KEY `dost_nowa_dostawa_id_pliku` (`id_pliku`),
  KEY `dost_nowa_dostawa_id_dostawcy` (`id_dostawcy`),
  KEY `dost_nowa_dostawa_status_weryfikacji` (`status_weryfikacji`),
  KEY `dost_nowa_dostawa_data_utworzenia` (`data_utworzenia`),
  KEY `dost_nowa_dostawa_id_dostawcy_status_weryfikacji` (`id_dostawcy`,`status_weryfikacji`),
  KEY `dost_nowa_dostawa_nazwa_pliku` (`nazwa_pliku`),
  CONSTRAINT `dost_nowa_dostawa_ibfk_1` FOREIGN KEY (`id_dostawcy`) REFERENCES `auth_dostawcy` (`id_dostawcy`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela głównych dostaw z podstawowymi informacjami o plikach dostawców';

-- 2. Tabela produktów w dostawach
CREATE TABLE `dost_dostawy_produkty` (
  `id_produktu_dostawy` int NOT NULL AUTO_INCREMENT COMMENT 'Unikalny identyfikator zagregowanego produktu w dostawie',
  `id_dostawy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Identyfikator dostawy, do której należy produkt',
  `nr_palety` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Nr palety produktu - mapowane z różnych nazw kolumn w plikach dostawców (LPN/lpn/LPN_NUMBER) lub generowane automatycznie',
  `l_p_n` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'LPN produktu - mapowane z różnych nazw kolumn w plikach dostawców (LPN/lpn/LPN_NUMBER) lub generowane automatycznie',
  `kod_ean` varchar(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kod EAN produktu - mapowane z kolumn (EAN/ean/EAN_CODE/Kod EAN)',
  `kod_asin` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kod ASIN produktu - mapowane z kolumn (ASIN/asin/ASIN_CODE/Kod ASIN)',
  `nazwa_produktu` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwa produktu - mapowane z kolumn (Item Desc/Product Name/Nazwa)',
  `ilosc` int NOT NULL DEFAULT '1' COMMENT 'Ilość sztuk danego produktu w dostawie - domyślnie 1 jeśli brak kolumny ilość w pliku dostawcy',
  `cena_produktu_spec` decimal(10,2) DEFAULT NULL COMMENT 'Cena produktu podana w specyfikacji dostawcy - mapowane z kolumn (Unit Retail/Price/Cena)',
  `stan_produktu` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Stan produktu - mapowane z kolumn (Stan/Condition/State)',
  `kraj_pochodzenia` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kod kraju pochodzenia produktu (ISO 3166-1 alpha-3) - mapowane z kolumn (Kraj/Country/Origin)',
  `kategoria_produktu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kategoria produktu - mapowane z kolumn (DEPARTMENT/Category/Kategoria)',
  `status_weryfikacji` enum('nowy','w_trakcie','zatwierdzony','odrzucony') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'nowy' COMMENT 'Status weryfikacji produktu w dostawie',
  `uwagi_weryfikacji` text COLLATE utf8mb4_unicode_ci COMMENT 'Uwagi z procesu weryfikacji produktu',
  `data_utworzenia` datetime NOT NULL COMMENT 'Data utworzenia rekordu',
  `data_aktualizacji` datetime NOT NULL COMMENT 'Data ostatniej aktualizacji rekordu',
  PRIMARY KEY (`id_produktu_dostawy`),
  KEY `dost_dostawy_produkty_id_dostawy` (`id_dostawy`),
  KEY `dost_dostawy_produkty_kod_ean` (`kod_ean`),
  KEY `dost_dostawy_produkty_kod_asin` (`kod_asin`),
  KEY `dost_dostawy_produkty_status_weryfikacji` (`status_weryfikacji`),
  KEY `dost_dostawy_produkty_data_utworzenia` (`data_utworzenia`),
  KEY `dost_dostawy_produkty_kraj_pochodzenia` (`kraj_pochodzenia`),
  KEY `dost_dostawy_produkty_kategoria_produktu` (`kategoria_produktu`),
  CONSTRAINT `dost_dostawy_produkty_ibfk_1` FOREIGN KEY (`id_dostawy`) REFERENCES `dost_nowa_dostawa` (`id_dostawy`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela przechowująca produkty w dostawach - elastyczna struktura obsługująca różne formaty plików dostawców';

-- 3. Tabela faktur dostawców
CREATE TABLE `dost_faktury_dostawcow` (
  `id_faktury` int NOT NULL AUTO_INCREMENT COMMENT 'Unikalny identyfikator faktury',
  `id_dostawcy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identyfikator dostawcy, który wystawił fakturę',
  `id_dostawy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Identyfikator dostawy, do której odnosi się faktura (może być NULL)',
  `numer_faktury` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Numer faktury nadany przez dostawcę',
  `data_faktury` date NOT NULL COMMENT 'Data wystawienia faktury',
  `data_platnosci` date NOT NULL COMMENT 'Data wymagalności płatności faktury',
  `kwota_brutto_razem` decimal(12,2) NOT NULL COMMENT 'Całkowita kwota brutto na fakturze',
  `kwota_netto_razem` decimal(12,2) NOT NULL COMMENT 'Całkowita kwota netto na fakturze',
  `waluta` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PLN' COMMENT 'Waluta faktury',
  `status_platnosci` enum('pending','paid','overdue','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'Status płatności faktury',
  `data_platnosci_faktycznej` date DEFAULT NULL COMMENT 'Data faktycznej płatności faktury',
  `data_utworzenia` datetime NOT NULL COMMENT 'Data i czas utworzenia rekordu faktury',
  `data_aktualizacji` datetime NOT NULL COMMENT 'Data i czas ostatniej aktualizacji rekordu faktury',
  PRIMARY KEY (`id_faktury`),
  UNIQUE KEY `numer_faktury` (`numer_faktury`),
  UNIQUE KEY `dost_faktury_dostawcow_numer_faktury` (`numer_faktury`),
  KEY `dost_faktury_dostawcow_id_dostawcy` (`id_dostawcy`),
  KEY `dost_faktury_dostawcow_id_dostawy` (`id_dostawy`),
  KEY `dost_faktury_dostawcow_data_faktury` (`data_faktury`),
  KEY `dost_faktury_dostawcow_data_platnosci` (`data_platnosci`),
  KEY `dost_faktury_dostawcow_status_platnosci` (`status_platnosci`),
  KEY `dost_faktury_dostawcow_waluta` (`waluta`),
  KEY `dost_faktury_dostawcow_data_utworzenia` (`data_utworzenia`),
  CONSTRAINT `dost_faktury_dostawcow_ibfk_1` FOREIGN KEY (`id_dostawcy`) REFERENCES `auth_dostawcy` (`id_dostawcy`) ON UPDATE CASCADE,
  CONSTRAINT `dost_faktury_dostawcow_ibfk_2` FOREIGN KEY (`id_dostawy`) REFERENCES `dost_nowa_dostawa` (`id_dostawy`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela przechowująca faktury od dostawców z informacjami o płatnościach';

-- 4. Tabela danych finansowych dostaw
CREATE TABLE `dost_finanse_dostaw` (
  `id_finanse_dostawy` int NOT NULL AUTO_INCREMENT COMMENT 'Unikalny identyfikator rekordu finansowego dostawy',
  `id_dostawy` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identyfikator dostawy, której dotyczą dane finansowe',
  `suma_produktow` int NOT NULL COMMENT 'Łączna liczba wszystkich produktów w dostawie (suma ilości)',
  `wartosc_produktow_spec` decimal(15,2) NOT NULL COMMENT 'Łączna wartość wszystkich produktów w dostawie',
  `stawka_vat` decimal(5,4) NOT NULL DEFAULT '0.2300' COMMENT 'Stawka VAT użyta do obliczeń (np. 0.23 dla 23%)',
  `procent_wartosci` decimal(5,4) NOT NULL COMMENT 'Procentowa wartość ceny dostawcy, jaką płacimy (np. 0.1800 dla 18%)',
  `wartosc_brutto` decimal(15,2) NOT NULL COMMENT 'Łączna wartość brutto wszystkich produktów w dostawie',
  `koszt_pln_brutto` decimal(10,2) NOT NULL COMMENT 'Koszta zakupu brutto w PLN: (wartosc_produktow_spec * kurs_wymiany_eur_pln * procent_wartosci) * (1 + stawka_vat)',
  `koszt_pln_netto` decimal(10,2) NOT NULL COMMENT 'Koszta zakupu netto w PLN: (wartosc_produktow_spec * kurs_wymiany_eur_pln * procent_wartosci)',
  `waluta` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EUR' COMMENT 'Waluta, w której podana jest cena_produktu_spec',
  `kurs_wymiany` decimal(8,4) DEFAULT NULL COMMENT 'Kurs wymiany waluty dostawy na PLN',
  `data_utworzenia` datetime NOT NULL COMMENT 'Data i czas utworzenia rekordu',
  `data_aktualizacji` datetime NOT NULL COMMENT 'Data i czas ostatniej aktualizacji rekordu',
  PRIMARY KEY (`id_finanse_dostawy`),
  KEY `dost_finanse_dostaw_id_dostawy` (`id_dostawy`),
  KEY `dost_finanse_dostaw_waluta` (`waluta`),
  KEY `dost_finanse_dostaw_data_utworzenia` (`data_utworzenia`),
  KEY `dost_finanse_dostaw_stawka_vat` (`stawka_vat`),
  CONSTRAINT `dost_finanse_dostaw_ibfk_1` FOREIGN KEY (`id_dostawy`) REFERENCES `dost_nowa_dostawa` (`id_dostawy`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela z danymi finansowymi dostaw - kalkulacje kosztów i marż';

-- Włącz z powrotem sprawdzanie kluczy obcych
SET FOREIGN_KEY_CHECKS = 1;

-- Pokaż utworzone tabele
SHOW TABLES LIKE 'dost%';
