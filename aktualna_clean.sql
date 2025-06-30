-- MySQL dump 10.13  Distrib 8.0.41, for macos14.7 (x86_64)
--
-- Host: flask-app-msbox.chqqwymic43o.us-east-1.rds.amazonaws.com    Database: msbox_db
-- ------------------------------------------------------
-- Server version	8.0.40

START TRANSACTION;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!50503 SET NAMES utf8mb4 */
;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;
/*!40103 SET TIME_ZONE='+00:00' */
;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;

SET @@SESSION.SQL_LOG_BIN = 0;

--
-- GTID state at the beginning of the backup
--

SET
    @@GLOBAL.GTID_PURGED = /*!80000 '+'*/ '';

--
-- Table structure for table `auth_dane_autoryzacji`
--

DROP TABLE IF EXISTS `auth_dane_autoryzacji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `auth_dane_autoryzacji` (
    `id_logowania` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Unikalny identyfikator wpisu logowania (np. ADM/0001/LOG, SUP/0001/LOG)',
    `id_uzytkownika` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identyfikator użytkownika z tabeli auth_pracownicy lub auth_dostawcy (np. ADM/0001, STF/0001, SUP/0001).',
    `adres_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Główny adres email używany do logowania i komunikacji.',
    `hash_hasla` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Zahaszowane hasło użytkownika dla bezpieczeństwa.',
    `rola_uzytkownika` enum('admin', 'staff', 'supplier') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Rola użytkownika w systemie (admin, staff, supplier).',
    `nieudane_proby_logowania` int NOT NULL DEFAULT '0' COMMENT 'Liczba kolejnych nieudanych prób logowania.',
    `ostatnie_logowanie` datetime DEFAULT NULL COMMENT 'Data i czas ostatniego udanego logowania użytkownika.',
    `data_utworzenia` datetime NOT NULL COMMENT 'Data i czas utworzenia rekordu.',
    `data_aktualizacji` datetime NOT NULL COMMENT 'Data i czas ostatniej aktualizacji rekordu.',
    `zablokowane_do` datetime DEFAULT NULL COMMENT 'Timestamp, do którego konto jest zablokowane po zbyt wielu nieudanych próbach.',
    PRIMARY KEY (`id_logowania`),
    UNIQUE KEY `id_uzytkownika` (`id_uzytkownika`),
    UNIQUE KEY `auth_dane_autoryzacji_adres_email` (`adres_email`),
    KEY `idx_login_auth_data_role` (`rola_uzytkownika`) COMMENT 'Indeks przyśpieszający wyszukiwanie po roli'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Tabela zawierająca podstawowe dane do logowania i autoryzacji użytkowników';
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `auth_dane_autoryzacji`
--

/*!40000 ALTER TABLE `auth_dane_autoryzacji` DISABLE KEYS */
;
INSERT INTO
    `auth_dane_autoryzacji`
VALUES (
        'ADM/00001/LOG',
        'ADM/00001',
        'admin@msbox.com',
        '$2b$10$qi2vnJXBWEBEYFceVxHe1OPhwCwP3k7P3MCRZKY66cVC78O2j/F7a',
        'admin',
        0,
        '2025-06-27 19:00:33',
        '2025-02-22 00:23:20',
        '2025-06-27 19:00:33',
        NULL
    ),
    (
        'ADM/00002/LOG',
        'ADM/00002',
        'wiktor.zawadzki@gmail.com',
        '$2b$10$p/0sZQlsi/MvccLHQq.3suOqWsehpCxUEkPx.dzYwFwYDsPbXMUtO',
        'admin',
        0,
        NULL,
        '2025-04-25 17:21:09',
        '2025-04-25 17:21:09',
        NULL
    ),
    (
        'STF/00001/LOG',
        'STF/00001',
        'pracownik@msbox.com',
        '$2b$10$dXrZVZxgR2WJR4Oy2tVcW.YfqPvzGRMGq.yLA2pfXEgCUnl3KbYaS',
        'staff',
        0,
        '2025-06-27 19:00:40',
        '2025-02-22 00:23:20',
        '2025-06-27 19:00:40',
        NULL
    ),
    (
        'SUP/00001/LOG',
        'SUP/00001',
        'firma@przyklad.pl',
        '$2b$10$zYCEsM82u/HFWKURJ06dPeCW4UzBfT4h84AHcvYObggkUqNQzQ6LC',
        'supplier',
        0,
        '2025-06-27 18:52:53',
        '2025-02-22 00:23:21',
        '2025-06-27 18:52:53',
        NULL
    );
/*!40000 ALTER TABLE `auth_dane_autoryzacji` ENABLE KEYS */
;

--
-- Table structure for table `auth_dostawcy`
--

DROP TABLE IF EXISTS `auth_dostawcy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `auth_dostawcy` (
    `id_dostawcy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `nazwa_firmy` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Pełna nazwa firmy dostawcy.',
    `imie_kontaktu` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Imię osoby kontaktowej u dostawcy.',
    `nazwisko_kontaktu` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwisko osoby kontaktowej u dostawcy.',
    `numer_nip` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Numer NIP firmy dostawcy.',
    `adres_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Adres email firmy dostawcy.',
    `telefon` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Numer telefonu firmy dostawcy.',
    `strona_www` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Adres strony internetowej firmy dostawcy.',
    `adres_ulica` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ulica adresu firmy.',
    `adres_numer_budynku` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Numer budynku adresu firmy.',
    `adres_numer_lokalu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Numer lokalu adresu firmy (opcjonalnie).',
    `adres_miasto` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Miejscowość adresu firmy.',
    `adres_kod_pocztowy` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Kod pocztowy adresu firmy.',
    `adres_kraj` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Polska' COMMENT 'Kraj adresu firmy.',
    `data_utworzenia` datetime NOT NULL COMMENT 'Data i czas utworzenia rekordu dostawcy.',
    `data_aktualizacji` datetime NOT NULL COMMENT 'Data i czas ostatniej aktualizacji rekordu dostawcy.',
    PRIMARY KEY (`id_dostawcy`),
    UNIQUE KEY `auth_dostawcy_numer_nip` (`numer_nip`),
    UNIQUE KEY `auth_dostawcy_adres_email` (`adres_email`),
    KEY `auth_dostawcy_nazwa_firmy` (`nazwa_firmy`),
    KEY `auth_dostawcy_adres_miasto` (`adres_miasto`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Tabela zawierająca dane dostawców';
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `auth_dostawcy`
--

/*!40000 ALTER TABLE `auth_dostawcy` DISABLE KEYS */
;
INSERT INTO
    `auth_dostawcy`
VALUES (
        'SUP/00001',
        'Firma Przykładowa Sp. z o.o.',
        'Jan',
        'Dostawca',
        '5252363635',
        'firma@przyklad.pl',
        '500600700',
        'www.firma-przykladowa.pl',
        'Przykładowa',
        '10',
        '5',
        'Warszawa',
        '00-001',
        'Polska',
        '2025-02-22 00:23:21',
        '2025-02-22 00:23:21'
    ),
    (
        'SUP/00002',
        'F.H.U Restock Wiktor Zawadza',
        'Wiktor',
        'Zawadzki',
        '1562145689',
        'wiktor.test@gmail.com',
        '456789456',
        'www.paletamix.pl',
        'Ul.kordeckiego',
        '1',
        NULL,
        'Nieporęt',
        '05-126',
        'Polska',
        '2025-04-26 01:53:49',
        '2025-04-26 01:53:49'
    );
/*!40000 ALTER TABLE `auth_dostawcy` ENABLE KEYS */
;

--
-- Table structure for table `auth_historia_logowan`
--

DROP TABLE IF EXISTS `auth_historia_logowan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `auth_historia_logowan` (
    `id_wpisu` int NOT NULL AUTO_INCREMENT,
    `id_logowania` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identyfikator logowania użytkownika (powiązanie z auth_dane_autoryzacji)',
    `data_proby_logowania` datetime NOT NULL COMMENT 'Data i czas próby logowania',
    `status_logowania` enum('success', 'failed') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Status próby logowania (success/failed)',
    `poczatek_sesji` datetime DEFAULT NULL COMMENT 'Data i czas rozpoczęcia sesji (tylko dla udanych logowań)',
    `koniec_sesji` datetime DEFAULT NULL COMMENT 'Data i czas zakończenia sesji',
    PRIMARY KEY (`id_wpisu`),
    KEY `user_login` (`id_logowania`),
    KEY `idx_data_proby` (`data_proby_logowania`),
    KEY `idx_status_data` (
        `status_logowania`,
        `data_proby_logowania`
    )
) ENGINE = InnoDB AUTO_INCREMENT = 73 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Historia logowań użytkowników';
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `auth_historia_logowan`
--

/*!40000 ALTER TABLE `auth_historia_logowan` DISABLE KEYS */
;
/*!40000 ALTER TABLE `auth_historia_logowan` ENABLE KEYS */
;

--
-- Table structure for table `auth_pracownicy`
--

DROP TABLE IF EXISTS `auth_pracownicy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */
;
/*!50503 SET character_set_client = utf8mb4 */
;
CREATE TABLE `auth_pracownicy` (
    `id_pracownika` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
    `imie` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Imię pracownika.',
    `nazwisko` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwisko pracownika.',
    `rola` enum('admin', 'staff') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Rola pracownika w systemie (admin lub staff).',
    `adres_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Adres email pracownika.',
    `telefon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Numer telefonu pracownika.',
    `data_utworzenia` datetime NOT NULL COMMENT 'Data i czas utworzenia rekordu pracownika.',
    `data_aktualizacji` datetime NOT NULL COMMENT 'Data i czas ostatniej aktualizacji rekordu pracownika.',
    PRIMARY KEY (`id_pracownika`),
    UNIQUE KEY `auth_pracownicy_adres_email` (`adres_email`),
    KEY `auth_pracownicy_imie_nazwisko` (`imie`, `nazwisko`),
    KEY `auth_pracownicy_rola` (`rola`),
    KEY `auth_pracownicy_telefon` (`telefon`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Tabela zawierająca dane pracowników i administratorów';
/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `auth_pracownicy`
--

/*!40000 ALTER TABLE `auth_pracownicy` DISABLE KEYS */
;
INSERT INTO
    `auth_pracownicy`
VALUES (
        'ADM/00001',
        'Admin',
        'System',
        'admin',
        'admin@msbox.com',
        '500100200',
        '2025-02-22 00:23:20',
        '2025-02-22 00:23:20'
    ),
    (
        'ADM/00002',
        'Wiktor',
        'Zawadzki',
        'admin',
        'wiktor.zawadzki@gmail.com',
        '515227639',
        '2025-04-25 17:21:08',
        '2025-04-25 17:21:08'
    ),
    (
        'STF/00001',
        'Jan',
        'Pracownik',
        'staff',
        'pracownik@msbox.com',
        '500300400',
        '2025-02-22 00:23:20',
        '2025-02-22 00:23:20'
    );
/*!40000 ALTER TABLE `auth_pracownicy` ENABLE KEYS */
;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;

-- Dump completed on 2025-07-04 12:47:33

COMMIT;