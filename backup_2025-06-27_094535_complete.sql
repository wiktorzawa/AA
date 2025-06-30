-- MySQL dump 10.13  Distrib 8.0.41, for macos14.7 (x86_64)
--
-- Host: flask-app-msbox.chqqwymic43o.us-east-1.rds.amazonaws.com    Database: msbox_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_dane_autoryzacji`
--

DROP TABLE IF EXISTS `auth_dane_autoryzacji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_dane_autoryzacji` (
  `id_logowania` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_powiazany` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adres_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash_hasla` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rola_uzytkownika` enum('admin','staff','supplier') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nieudane_proby_logowania` int DEFAULT '0',
  `ostatnie_logowanie` timestamp NULL DEFAULT NULL,
  `data_utworzenia` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_aktualizacji` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_logowania`),
  UNIQUE KEY `email` (`adres_email`),
  UNIQUE KEY `related_id` (`id_powiazany`),
  KEY `idx_login_auth_data_role` (`rola_uzytkownika`) COMMENT 'Indeks przyśpieszający wyszukiwanie po roli'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela zawierająca podstawowe dane do logowania i autoryzacji użytkowników';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_dane_autoryzacji`
--

LOCK TABLES `auth_dane_autoryzacji` WRITE;
/*!40000 ALTER TABLE `auth_dane_autoryzacji` DISABLE KEYS */;
INSERT INTO `auth_dane_autoryzacji` VALUES ('ADM/00001/LOG','ADM/00001','admin@msbox.com','$2b$10$qi2vnJXBWEBEYFceVxHe1OPhwCwP3k7P3MCRZKY66cVC78O2j/F7a','admin',0,'2025-06-26 09:59:22','2025-02-22 00:23:20','2025-06-26 09:59:22'),('ADM/00002/LOG','ADM/00002','wiktor.zawadzki@gmail.com','$2b$10$p/0sZQlsi/MvccLHQq.3suOqWsehpCxUEkPx.dzYwFwYDsPbXMUtO','admin',0,NULL,'2025-04-25 17:21:09','2025-04-25 17:21:09'),('STF/00001/LOG','STF/00001','pracownik@msbox.com','$2b$10$dXrZVZxgR2WJR4Oy2tVcW.YfqPvzGRMGq.yLA2pfXEgCUnl3KbYaS','staff',0,'2025-06-25 13:48:45','2025-02-22 00:23:20','2025-06-25 13:48:45'),('SUP/00001/LOG','SUP/00001','firma@przyklad.pl','$2b$10$zYCEsM82u/HFWKURJ06dPeCW4UzBfT4h84AHcvYObggkUqNQzQ6LC','supplier',0,'2025-06-25 22:47:05','2025-02-22 00:23:21','2025-06-25 22:47:05');
/*!40000 ALTER TABLE `auth_dane_autoryzacji` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `before_login_insert` BEFORE INSERT ON `auth_dane_autoryzacji` FOR EACH ROW BEGIN
    IF NEW.id_login IS NULL OR NEW.id_login = '' THEN
        SET NEW.id_login = generate_login_id(NEW.related_id);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `auth_dostawcy`
--

DROP TABLE IF EXISTS `auth_dostawcy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_dostawcy` (
  `id_dostawcy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nazwa_firmy` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imie_kontaktu` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nazwisko_kontaktu` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numer_nip` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adres_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefon` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `strona_www` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktywny` tinyint(1) DEFAULT '1',
  `adres_ulica` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adres_numer_budynku` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adres_numer_lokalu` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adres_miasto` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adres_kod_pocztowy` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adres_kraj` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_utworzenia` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_aktualizacji` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_dostawcy`),
  UNIQUE KEY `nip` (`numer_nip`),
  UNIQUE KEY `email` (`adres_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela zawierająca dane dostawców';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_dostawcy`
--

LOCK TABLES `auth_dostawcy` WRITE;
/*!40000 ALTER TABLE `auth_dostawcy` DISABLE KEYS */;
INSERT INTO `auth_dostawcy` VALUES ('SUP/00001','Firma Przykładowa Sp. z o.o.','Jan','Dostawca','5252363635','firma@przyklad.pl','500600700','www.firma-przykladowa.pl',1,'Przykładowa','10','5','Warszawa','00-001','Polska','2025-02-22 00:23:21','2025-02-22 00:23:21'),('SUP/00002','F.H.U Restock Wiktor Zawadza','Wiktor','Zawadzki','1562145689','wiktor.test@gmail.com','456789456','www.paletamix.pl',1,'Ul.kordeckiego','1',NULL,'Nieporęt','05-126','Polska','2025-04-26 01:53:49','2025-04-26 01:53:49');
/*!40000 ALTER TABLE `auth_dostawcy` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `before_supplier_insert` BEFORE INSERT ON `auth_dostawcy` FOR EACH ROW BEGIN
    IF NEW.id_supplier IS NULL OR NEW.id_supplier = '' THEN
        SET NEW.id_supplier = generate_supplier_id();
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `auth_historia_logowan`
--

DROP TABLE IF EXISTS `auth_historia_logowan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_historia_logowan` (
  `id_wpisu` int NOT NULL AUTO_INCREMENT,
  `id_logowania` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_proby_logowania` timestamp NOT NULL,
  `status_logowania` enum('success','failed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `poczatek_sesji` timestamp NULL DEFAULT NULL,
  `koniec_sesji` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_wpisu`),
  KEY `user_login` (`id_logowania`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Historia logowań użytkowników';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_historia_logowan`
--

LOCK TABLES `auth_historia_logowan` WRITE;
/*!40000 ALTER TABLE `auth_historia_logowan` DISABLE KEYS */;
INSERT INTO `auth_historia_logowan` VALUES (1,'ADM/00001/LOG','2025-06-25 03:56:03','success',NULL,NULL),(2,'SUP/00001/LOG','2025-06-25 03:56:13','success',NULL,NULL),(3,'STF/00001/LOG','2025-06-25 03:56:23','success',NULL,NULL),(4,'ADM/00001/LOG','2025-06-25 04:24:57','failed',NULL,NULL),(5,'ADM/00001/LOG','2025-06-25 04:25:53','success',NULL,NULL),(6,'SUP/00001/LOG','2025-06-25 04:26:03','success',NULL,NULL),(7,'STF/00001/LOG','2025-06-25 04:26:11','success',NULL,NULL),(8,'ADM/00001/LOG','2025-06-25 05:16:54','failed',NULL,NULL),(9,'ADM/00001/LOG','2025-06-25 05:18:45','success',NULL,NULL),(10,'ADM/00001/LOG','2025-06-25 12:46:30','success',NULL,NULL),(11,'STF/00001/LOG','2025-06-25 13:48:45','success',NULL,NULL),(12,'SUP/00001/LOG','2025-06-25 13:50:00','success',NULL,NULL),(13,'ADM/00001/LOG','2025-06-25 13:55:43','success',NULL,NULL),(14,'ADM/00001/LOG','2025-06-25 22:46:00','success',NULL,NULL),(15,'SUP/00001/LOG','2025-06-25 22:47:05','success',NULL,NULL),(16,'ADM/00001/LOG','2025-06-25 22:47:31','success',NULL,NULL),(17,'ADM/00001/LOG','2025-06-26 09:59:22','success',NULL,NULL);
/*!40000 ALTER TABLE `auth_historia_logowan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_pracownicy`
--

DROP TABLE IF EXISTS `auth_pracownicy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_pracownicy` (
  `id_pracownika` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imie` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nazwisko` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rola` enum('admin','staff') COLLATE utf8mb4_unicode_ci NOT NULL,
  `adres_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_utworzenia` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_aktualizacji` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pracownika`),
  UNIQUE KEY `email` (`adres_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela zawierająca dane pracowników i administratorów';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_pracownicy`
--

LOCK TABLES `auth_pracownicy` WRITE;
/*!40000 ALTER TABLE `auth_pracownicy` DISABLE KEYS */;
INSERT INTO `auth_pracownicy` VALUES ('ADM/00001','Admin','System','admin','admin@msbox.com','500100200','2025-02-22 00:23:20','2025-02-22 00:23:20'),('ADM/00002','Wiktor','Zawadzki','admin','wiktor.zawadzki@gmail.com','515227639','2025-04-25 17:21:08','2025-04-25 17:21:08'),('STF/00001','Jan','Pracownik','staff','pracownik@msbox.com','500300400','2025-02-22 00:23:20','2025-02-22 00:23:20');
/*!40000 ALTER TABLE `auth_pracownicy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dos_finanse`
--

DROP TABLE IF EXISTS `dos_finanse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dos_finanse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pliku_dostawy` int NOT NULL,
  `id_dostawcy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `liczba_pozycji` int NOT NULL,
  `liczba_unikalnych_produktow` int NOT NULL,
  `wartosc_netto` decimal(15,2) NOT NULL,
  `stawka_vat` decimal(5,4) NOT NULL DEFAULT '0.2300',
  `procent_marzy` decimal(5,4) NOT NULL DEFAULT '0.1800',
  `wartosc_brutto` decimal(15,2) NOT NULL,
  `nasz_koszt_netto` decimal(15,2) NOT NULL,
  `nasz_koszt_brutto` decimal(15,2) NOT NULL,
  `waluta` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'EUR',
  `kurs_wymiany` decimal(8,4) DEFAULT NULL,
  `warunki_platnosci` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_utworzenia` datetime DEFAULT NULL,
  `data_aktualizacji` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_delivery_finance_delivery_file_id` (`id_pliku_dostawy`),
  KEY `supplier_delivery_finance_supplier_id` (`id_dostawcy`),
  CONSTRAINT `dos_finanse_ibfk_1` FOREIGN KEY (`id_pliku_dostawy`) REFERENCES `dos_plik_oryginalny` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dos_finanse`
--

LOCK TABLES `dos_finanse` WRITE;
/*!40000 ALTER TABLE `dos_finanse` DISABLE KEYS */;
/*!40000 ALTER TABLE `dos_finanse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dos_plik_oryginalny`
--

DROP TABLE IF EXISTS `dos_plik_oryginalny`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dos_plik_oryginalny` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_dostawcy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID dostawcy',
  `nazwa_pliku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwa pliku źródłowego',
  `hash_pliku` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hash pliku dla wykrywania duplikatów',
  `zawartosc_pliku` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Oryginalny plik w formie CSV',
  `data_uploadu` datetime DEFAULT NULL COMMENT 'Kiedy plik został wgrany',
  `status_przetwarzania` enum('pending','processing','completed','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'Status przetwarzania',
  `komunikat_bledu` text COLLATE utf8mb4_unicode_ci COMMENT 'Komunikat błędu jeśli wystąpił',
  `liczba_wierszy` int DEFAULT NULL COMMENT 'Liczba wierszy w pliku',
  `przetworzone_wiersze` int DEFAULT '0' COMMENT 'Liczba przetworzonych wierszy',
  `zagregowane_produkty` int DEFAULT '0' COMMENT 'Liczba produktów po agregacji',
  `data_utworzenia` datetime DEFAULT NULL,
  `data_aktualizacji` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_deliveries_raw_supplier_id` (`id_dostawcy`),
  KEY `supplier_deliveries_raw_file_hash` (`hash_pliku`),
  KEY `supplier_deliveries_raw_processing_status` (`status_przetwarzania`),
  KEY `supplier_deliveries_raw_upload_timestamp` (`data_uploadu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dos_plik_oryginalny`
--

LOCK TABLES `dos_plik_oryginalny` WRITE;
/*!40000 ALTER TABLE `dos_plik_oryginalny` DISABLE KEYS */;
/*!40000 ALTER TABLE `dos_plik_oryginalny` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dos_pozycje`
--

DROP TABLE IF EXISTS `dos_pozycje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dos_pozycje` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numer_lotu` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_palety` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `opis_produktu` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ean` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `asin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ilosc` int NOT NULL,
  `cena_jednostkowa_eur` decimal(10,2) NOT NULL,
  `wartosc_waluty` decimal(10,4) NOT NULL,
  `wartosc_pln_netto` decimal(10,2) NOT NULL,
  `procent_wartosci` decimal(5,4) NOT NULL,
  `stawka_vat` decimal(4,2) NOT NULL DEFAULT '0.23',
  `moj_koszt_pln_brutto` decimal(10,2) NOT NULL,
  `moj_koszt_pln_netto` decimal(10,2) DEFAULT NULL,
  `kraj_pochodzenia` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lokalizacja` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uwagi` text COLLATE utf8mb4_unicode_ci,
  `data_importu` datetime NOT NULL,
  `data_utworzenia` datetime NOT NULL,
  `data_aktualizacji` datetime NOT NULL,
  `id_pliku_dostawy` int DEFAULT NULL,
  `status_walidacji` enum('pending','validated','missing_data','duplicate') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `brakujace_pola` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_deliveries_lot_number` (`numer_lotu`),
  KEY `supplier_deliveries_pallet_id` (`id_palety`),
  KEY `supplier_deliveries_ean` (`ean`),
  KEY `supplier_deliveries_asin` (`asin`),
  KEY `supplier_deliveries_import_timestamp` (`data_importu`),
  KEY `supplier_deliveries_delivery_file_id` (`id_pliku_dostawy`),
  KEY `supplier_deliveries_validation_status` (`status_walidacji`),
  CONSTRAINT `fk_dos_pozycje_finanse` FOREIGN KEY (`id_pliku_dostawy`) REFERENCES `dos_finanse` (`id`) ON DELETE CASCADE,
  CONSTRAINT `supplier_deliveries_delivery_file_id_foreign_idx` FOREIGN KEY (`id_pliku_dostawy`) REFERENCES `dos_plik_oryginalny` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dos_pozycje`
--

LOCK TABLES `dos_pozycje` WRITE;
/*!40000 ALTER TABLE `dos_pozycje` DISABLE KEYS */;
/*!40000 ALTER TABLE `dos_pozycje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prod_amazon_produkty`
--

DROP TABLE IF EXISTS `prod_amazon_produkty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_amazon_produkty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tytul` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `asin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `upc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cena_poczatkowa` decimal(10,2) DEFAULT NULL,
  `cena_koncowa` decimal(10,2) DEFAULT NULL,
  `waluta` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'EUR',
  `marka` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kategorie` json DEFAULT NULL,
  `domena` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url_obrazu` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numer_modelu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `od_marki` text COLLATE utf8mb4_unicode_ci,
  `funkcje` json DEFAULT NULL,
  `obrazy` json DEFAULT NULL,
  `szczegoly_produktu` json DEFAULT NULL,
  `data_utworzenia` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_aktualizacji` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_asin` (`asin`),
  KEY `idx_brand` (`marka`),
  KEY `idx_domain` (`domena`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_amazon_produkty`
--

LOCK TABLES `prod_amazon_produkty` WRITE;
/*!40000 ALTER TABLE `prod_amazon_produkty` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_amazon_produkty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prod_katalog_master`
--

DROP TABLE IF EXISTS `prod_katalog_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_katalog_master` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID produktu',
  `uuid_produktu` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'UUID z poprzedniej wersji',
  `asin` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Amazon ASIN',
  `ean` varchar(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kod EAN',
  `nazwa_produktu` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwa produktu',
  `cena_rynkowa` decimal(12,2) DEFAULT NULL COMMENT 'Cena rynkowa',
  `opis` json DEFAULT NULL COMMENT 'Opis produktu',
  `obrazy` json DEFAULT NULL COMMENT 'Zdjęcia produktu',
  `data_ostatniego_sprawdzenia_ceny` timestamp NULL DEFAULT NULL COMMENT 'Data sprawdzenia ceny',
  `url_zrodlowy` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL źródłowy',
  `utworzony_przez` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kto utworzył',
  `data_utworzenia` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_aktualizacji` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_produktu` (`uuid_produktu`),
  UNIQUE KEY `asin` (`asin`),
  KEY `idx_asin` (`asin`),
  KEY `idx_ean` (`ean`),
  KEY `idx_nazwa` (`nazwa_produktu`(50)),
  KEY `idx_marka` (`utworzony_przez`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_katalog_master`
--

LOCK TABLES `prod_katalog_master` WRITE;
/*!40000 ALTER TABLE `prod_katalog_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_katalog_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prod_zdjecia_produktow`
--

DROP TABLE IF EXISTS `prod_zdjecia_produktow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_zdjecia_produktow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_produktu` int NOT NULL,
  `klucz_s3` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `czy_glowne` tinyint(1) NOT NULL DEFAULT '0',
  `data_utworzenia` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`id_produktu`),
  KEY `idx_is_main` (`czy_glowne`),
  CONSTRAINT `prod_zdjecia_produktow_ibfk_1` FOREIGN KEY (`id_produktu`) REFERENCES `prod_produkty_allegro` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_zdjecia_produktow`
--

LOCK TABLES `prod_zdjecia_produktow` WRITE;
/*!40000 ALTER TABLE `prod_zdjecia_produktow` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_zdjecia_produktow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ver_podsumowanie_sesji`
--

DROP TABLE IF EXISTS `ver_podsumowanie_sesji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ver_podsumowanie_sesji` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_sesji` int NOT NULL,
  `liczba_produktow_klasa_a` int DEFAULT '0',
  `liczba_produktow_klasa_b` int DEFAULT '0',
  `liczba_produktow_klasa_c` int DEFAULT '0',
  `liczba_brakujacych` int DEFAULT '0',
  `liczba_nadwyzkowych` int DEFAULT '0',
  `calkowity_wplyw_finansowy` decimal(15,2) DEFAULT '0.00',
  `calkowite_straty` decimal(15,2) DEFAULT '0.00',
  `calkowite_zyski` decimal(15,2) DEFAULT '0.00',
  `dokladnosc_weryfikacji` decimal(5,2) DEFAULT NULL,
  `data_utworzenia` datetime DEFAULT NULL,
  `data_aktualizacji` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_id` (`id_sesji`),
  KEY `verification_session_summary_session_id` (`id_sesji`),
  CONSTRAINT `ver_podsumowanie_sesji_ibfk_1` FOREIGN KEY (`id_sesji`) REFERENCES `ver_sesje` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ver_podsumowanie_sesji`
--

LOCK TABLES `ver_podsumowanie_sesji` WRITE;
/*!40000 ALTER TABLE `ver_podsumowanie_sesji` DISABLE KEYS */;
/*!40000 ALTER TABLE `ver_podsumowanie_sesji` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ver_produkty`
--

DROP TABLE IF EXISTS `ver_produkty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ver_produkty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_sesji` int NOT NULL,
  `id_produktu_zrodlowego` int NOT NULL,
  `asin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ean` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opis_produktu` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ilosc_zadeklarowana` int NOT NULL,
  `ilosc_zweryfikowana` int NOT NULL,
  `klasyfikacja` enum('A','B','C','E','MISSING','SURPLUS') COLLATE utf8mb4_unicode_ci NOT NULL,
  `przeznaczenie` enum('retail','box_mix','mystery_box','damaged','return_to_supplier','disposal','warehouse_keep','requires_decision') COLLATE utf8mb4_unicode_ci NOT NULL,
  `uwagi_o_stanie` text COLLATE utf8mb4_unicode_ci,
  `zweryfikowany_przez` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_weryfikacji` datetime NOT NULL,
  `cena_ujednolicona` decimal(12,2) DEFAULT NULL,
  `grupa_lpn` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `powod_korekty_ceny` text COLLATE utf8mb4_unicode_ci,
  `data_utworzenia` datetime DEFAULT NULL,
  `data_aktualizacji` datetime DEFAULT NULL,
  `rozmiar_produktu` enum('S','M','L','XL','LONG','ONE_SIZE','VARIOUS') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lokalizacja` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numer_lpn` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `obrazy` json DEFAULT NULL,
  `url_zrodlowy` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cena_zweryfikowana` decimal(12,2) DEFAULT NULL,
  `cena_oryginalna` decimal(12,2) DEFAULT NULL,
  `status_weryfikacji` enum('pending','in_progress','completed','rejected','requires_review') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `data_weryfikacji_produktu` datetime DEFAULT NULL,
  `waga_produktu` decimal(8,3) DEFAULT NULL,
  `wymiary_produktu` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stan_opakowania` enum('perfect','good','damaged','missing','opened') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kompletnosc` enum('complete','incomplete','missing_accessories','missing_manual','unknown') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `verification_products_session_id` (`id_sesji`),
  KEY `verification_products_source_product_id` (`id_produktu_zrodlowego`),
  KEY `verification_products_asin` (`asin`),
  KEY `verification_products_classification` (`klasyfikacja`),
  KEY `verification_products_destination` (`przeznaczenie`),
  KEY `verification_products_lpn_group` (`grupa_lpn`),
  KEY `verification_products_location` (`lokalizacja`),
  KEY `verification_products_lpn_number` (`numer_lpn`),
  KEY `verification_products_product_size` (`rozmiar_produktu`),
  KEY `verification_products_verification_status` (`status_weryfikacji`),
  KEY `verification_products_verification_date` (`data_weryfikacji_produktu`),
  KEY `verification_products_packaging_condition` (`stan_opakowania`),
  KEY `verification_products_completeness` (`kompletnosc`),
  CONSTRAINT `ver_produkty_ibfk_1` FOREIGN KEY (`id_sesji`) REFERENCES `ver_sesje` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ver_produkty_ibfk_2` FOREIGN KEY (`id_produktu_zrodlowego`) REFERENCES `dos_pozycje` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ver_produkty`
--

LOCK TABLES `ver_produkty` WRITE;
/*!40000 ALTER TABLE `ver_produkty` DISABLE KEYS */;
/*!40000 ALTER TABLE `ver_produkty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ver_raporty_dostawcow`
--

DROP TABLE IF EXISTS `ver_raporty_dostawcow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ver_raporty_dostawcow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_sesji` int NOT NULL,
  `id_dostawcy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `typ_raportu` enum('discrepancies','damages','financial_summary','full_report') COLLATE utf8mb4_unicode_ci NOT NULL,
  `dane_raportu` json NOT NULL,
  `wyslany_do_dostawcy` tinyint(1) DEFAULT '0',
  `data_wyslania` datetime DEFAULT NULL,
  `odpowiedz_dostawcy` text COLLATE utf8mb4_unicode_ci,
  `data_otrzymania_odpowiedzi` datetime DEFAULT NULL,
  `data_utworzenia` datetime DEFAULT NULL,
  `data_aktualizacji` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `verification_supplier_reports_session_id` (`id_sesji`),
  KEY `verification_supplier_reports_supplier_id` (`id_dostawcy`),
  KEY `verification_supplier_reports_report_type` (`typ_raportu`),
  CONSTRAINT `ver_raporty_dostawcow_ibfk_1` FOREIGN KEY (`id_sesji`) REFERENCES `ver_sesje` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ver_raporty_dostawcow`
--

LOCK TABLES `ver_raporty_dostawcow` WRITE;
/*!40000 ALTER TABLE `ver_raporty_dostawcow` DISABLE KEYS */;
/*!40000 ALTER TABLE `ver_raporty_dostawcow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ver_rozbieznosci_finansowe`
--

DROP TABLE IF EXISTS `ver_rozbieznosci_finansowe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ver_rozbieznosci_finansowe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_sesji` int NOT NULL,
  `id_produktu_weryfikacji` int NOT NULL,
  `asin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zadeklarowana_wartosc_rynkowa` decimal(12,2) NOT NULL,
  `rzeczywista_wartosc_rynkowa` decimal(12,2) NOT NULL,
  `koszt_zakupu_brutto` decimal(12,2) NOT NULL,
  `oczekiwany_przychod_retail` decimal(12,2) DEFAULT NULL,
  `oczekiwany_przychod_box_mix` decimal(12,2) DEFAULT NULL,
  `wplyw_finansowy` decimal(12,2) NOT NULL,
  `typ_wplywu` enum('profit','loss','neutral') COLLATE utf8mb4_unicode_ci NOT NULL,
  `waluta` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'PLN',
  `uwagi` text COLLATE utf8mb4_unicode_ci,
  `data_utworzenia` datetime DEFAULT NULL,
  `data_aktualizacji` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `verification_financial_discrepancies_session_id` (`id_sesji`),
  KEY `verification_financial_discrepancies_verification_product_id` (`id_produktu_weryfikacji`),
  KEY `verification_financial_discrepancies_impact_type` (`typ_wplywu`),
  CONSTRAINT `ver_rozbieznosci_finansowe_ibfk_1` FOREIGN KEY (`id_sesji`) REFERENCES `ver_sesje` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ver_rozbieznosci_finansowe_ibfk_2` FOREIGN KEY (`id_produktu_weryfikacji`) REFERENCES `ver_produkty` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ver_rozbieznosci_finansowe`
--

LOCK TABLES `ver_rozbieznosci_finansowe` WRITE;
/*!40000 ALTER TABLE `ver_rozbieznosci_finansowe` DISABLE KEYS */;
/*!40000 ALTER TABLE `ver_rozbieznosci_finansowe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ver_sesje`
--

DROP TABLE IF EXISTS `ver_sesje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ver_sesje` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kod_sesji` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_pliku_dostawy` int NOT NULL,
  `id_dostawcy` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_weryfikacji` enum('pending','in_progress','completed','reported_to_supplier') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `rozpoczety_przez` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_rozpoczecia` datetime NOT NULL,
  `data_zakonczenia` datetime DEFAULT NULL,
  `liczba_produktow_zadeklarowana` int NOT NULL,
  `liczba_produktow_zweryfikowana` int DEFAULT '0',
  `uwagi` text COLLATE utf8mb4_unicode_ci,
  `data_utworzenia` datetime DEFAULT NULL,
  `data_aktualizacji` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_code` (`kod_sesji`),
  KEY `verification_sessions_delivery_file_id` (`id_pliku_dostawy`),
  KEY `verification_sessions_supplier_id` (`id_dostawcy`),
  KEY `verification_sessions_verification_status` (`status_weryfikacji`),
  KEY `verification_sessions_started_at` (`data_rozpoczecia`),
  CONSTRAINT `ver_sesje_ibfk_1` FOREIGN KEY (`id_pliku_dostawy`) REFERENCES `dos_plik_oryginalny` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ver_sesje`
--

LOCK TABLES `ver_sesje` WRITE;
/*!40000 ALTER TABLE `ver_sesje` DISABLE KEYS */;
/*!40000 ALTER TABLE `ver_sesje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'msbox_db'
--
/*!50003 DROP FUNCTION IF EXISTS `generate_login_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` FUNCTION `generate_login_id`(base_id VARCHAR(20)) RETURNS varchar(20) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci
    NO SQL
    DETERMINISTIC
BEGIN
    RETURN CONCAT(base_id, '/LOG');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `generate_supplier_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` FUNCTION `generate_supplier_id`() RETURNS varchar(20) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE next_num INT;
    DECLARE prefix VARCHAR(5);
    
    SET prefix = 'SUP';
    
    SELECT IFNULL(MAX(CAST(SUBSTRING_INDEX(id_supplier, '/', -1) AS UNSIGNED)), 0) + 1
    INTO next_num
    FROM login_table_suppliers
    WHERE id_supplier LIKE CONCAT(prefix, '/%');
    
    RETURN CONCAT(prefix, '/', LPAD(next_num, 5, '0'));
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `register_supplier` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `register_supplier`(
    
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255),
    
    
    IN p_company_name VARCHAR(255),
    IN p_nip VARCHAR(10),
    IN p_regon VARCHAR(14),
    IN p_company_address TEXT,
    IN p_company_city VARCHAR(100),
    IN p_company_postal_code VARCHAR(6),
    IN p_company_phone VARCHAR(20),
    
    
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_contact_person_position VARCHAR(100),
    
    
    IN p_additional_email VARCHAR(255),
    IN p_additional_phone VARCHAR(20),
    IN p_preferred_contact_method ENUM('email', 'phone')
)
BEGIN
    
    DECLARE v_user_id INT;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    
    START TRANSACTION;
    
    
    INSERT INTO login_data (email, password_hash, role, active)
    VALUES (p_email, p_password_hash, 'supplier', TRUE);
    
    
    SET v_user_id = LAST_INSERT_ID();
    
    
    INSERT INTO suppliers (
        user_id,
        company_name,
        nip,
        regon,
        company_address,
        company_city,
        company_postal_code,
        company_phone,
        first_name,
        last_name,
        contact_person_position,
        additional_email,
        additional_phone,
        preferred_contact_method
    ) VALUES (
        v_user_id,
        p_company_name,
        p_nip,
        p_regon,
        p_company_address,
        p_company_city,
        p_company_postal_code,
        p_company_phone,
        p_first_name,
        p_last_name,
        p_contact_person_position,
        p_additional_email,
        p_additional_phone,
        p_preferred_contact_method
    );
    
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `verify_password` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `verify_password`(
  IN p_email VARCHAR(255),
  IN p_password VARCHAR(255)
)
BEGIN
  DECLARE v_stored_hash VARCHAR(255);
  DECLARE v_password_valid BOOLEAN DEFAULT FALSE;
  
  -- Pobierz hash hasła dla podanego adresu email
  SELECT password_hash INTO v_stored_hash 
  FROM login_auth_data 
  WHERE email = p_email LIMIT 1;
  
  -- Jeśli użytkownik istnieje, zwróć informacje o weryfikacji
  -- Właściwe sprawdzenie hasła odbywa się w aplikacji
  -- Ta procedura tylko zwraca hash do weryfikacji
  IF v_stored_hash IS NOT NULL THEN
    -- W rzeczywistej weryfikacji hasła, tu byłoby porównanie hasza
    -- Ale ponieważ to odbywa się w aplikacji, zwracamy tylko czy użytkownik istnieje
    SELECT TRUE AS verified;
  ELSE
    SELECT FALSE AS verified;
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-27  9:46:23
