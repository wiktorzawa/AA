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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

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

/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20240330000000-create-amazon-products.js'),('20240722100000-create-supplier-deliveries.js'),('20241226000001-extend-supplier-deliveries-schema.js'),('20241226000002-create-verification-schema.js'),('20241226000003-extend-verification-products.js'),('20241226000004-reorganize-tables-with-prefixes.js'),('20241226000005-remove-unused-tables.js'),('20241226000006-remove-delivery-legacy-tables.js'),('20241226000007-rebuild-amazon-products-table.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;

--
-- Table structure for table `ana_kategorie_ofert`
--

DROP TABLE IF EXISTS `ana_kategorie_ofert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ana_kategorie_ofert` (
  `id` int NOT NULL AUTO_INCREMENT,
  `analysis_id` int NOT NULL,
  `category_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_analysis_id` (`analysis_id`),
  KEY `idx_category_id` (`category_id`),
  CONSTRAINT `ana_kategorie_ofert_ibfk_1` FOREIGN KEY (`analysis_id`) REFERENCES `ana_oferty_glowne` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ana_kategorie_ofert`
--

/*!40000 ALTER TABLE `ana_kategorie_ofert` DISABLE KEYS */;
/*!40000 ALTER TABLE `ana_kategorie_ofert` ENABLE KEYS */;

--
-- Table structure for table `ana_oferty_glowne`
--

DROP TABLE IF EXISTS `ana_oferty_glowne`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ana_oferty_glowne` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phrase` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_min` decimal(10,2) NOT NULL,
  `price_max` decimal(10,2) NOT NULL,
  `price_avg` decimal(10,2) NOT NULL,
  `price_median` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_phrase` (`phrase`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ana_oferty_glowne`
--

/*!40000 ALTER TABLE `ana_oferty_glowne` DISABLE KEYS */;
/*!40000 ALTER TABLE `ana_oferty_glowne` ENABLE KEYS */;

--
-- Table structure for table `ana_parametry_ofert`
--

DROP TABLE IF EXISTS `ana_parametry_ofert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ana_parametry_ofert` (
  `id` int NOT NULL AUTO_INCREMENT,
  `analysis_id` int NOT NULL,
  `parameter_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parameter_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parameter_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_analysis_id` (`analysis_id`),
  KEY `idx_parameter_id` (`parameter_id`),
  CONSTRAINT `ana_parametry_ofert_ibfk_1` FOREIGN KEY (`analysis_id`) REFERENCES `ana_oferty_glowne` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ana_parametry_ofert`
--

/*!40000 ALTER TABLE `ana_parametry_ofert` DISABLE KEYS */;
/*!40000 ALTER TABLE `ana_parametry_ofert` ENABLE KEYS */;

--
-- Table structure for table `ana_slowa_kluczowe`
--

DROP TABLE IF EXISTS `ana_slowa_kluczowe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ana_slowa_kluczowe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `analysis_id` int NOT NULL,
  `keyword` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_analysis_id` (`analysis_id`),
  KEY `idx_keyword` (`keyword`),
  KEY `idx_count` (`count`),
  CONSTRAINT `ana_slowa_kluczowe_ibfk_1` FOREIGN KEY (`analysis_id`) REFERENCES `ana_oferty_glowne` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ana_slowa_kluczowe`
--

/*!40000 ALTER TABLE `ana_slowa_kluczowe` DISABLE KEYS */;
/*!40000 ALTER TABLE `ana_slowa_kluczowe` ENABLE KEYS */;

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

/*!40000 ALTER TABLE `auth_dane_autoryzacji` DISABLE KEYS */;
INSERT INTO `auth_dane_autoryzacji` VALUES ('ADM/00001/LOG','ADM/00001','admin@msbox.com','$2b$10$qi2vnJXBWEBEYFceVxHe1OPhwCwP3k7P3MCRZKY66cVC78O2j/F7a','admin',0,'2025-06-25 13:55:43','2025-02-22 00:23:20','2025-06-25 13:55:43'),('ADM/00002/LOG','ADM/00002','wiktor.zawadzki@gmail.com','$2b$10$p/0sZQlsi/MvccLHQq.3suOqWsehpCxUEkPx.dzYwFwYDsPbXMUtO','admin',0,NULL,'2025-04-25 17:21:09','2025-04-25 17:21:09'),('STF/00001/LOG','STF/00001','pracownik@msbox.com','$2b$10$dXrZVZxgR2WJR4Oy2tVcW.YfqPvzGRMGq.yLA2pfXEgCUnl3KbYaS','staff',0,'2025-06-25 13:48:45','2025-02-22 00:23:20','2025-06-25 13:48:45'),('SUP/00001/LOG','SUP/00001','firma@przyklad.pl','$2b$10$zYCEsM82u/HFWKURJ06dPeCW4UzBfT4h84AHcvYObggkUqNQzQ6LC','supplier',0,'2025-06-25 13:50:00','2025-02-22 00:23:21','2025-06-25 13:50:00');
/*!40000 ALTER TABLE `auth_dane_autoryzacji` ENABLE KEYS */;
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

/*!40000 ALTER TABLE `auth_dostawcy` DISABLE KEYS */;
INSERT INTO `auth_dostawcy` VALUES ('SUP/00001','Firma Przykładowa Sp. z o.o.','Jan','Dostawca','5252363635','firma@przyklad.pl','500600700','www.firma-przykladowa.pl',1,'Przykładowa','10','5','Warszawa','00-001','Polska','2025-02-22 00:23:21','2025-02-22 00:23:21'),('SUP/00002','F.H.U Restock Wiktor Zawadza','Wiktor','Zawadzki','1562145689','wiktor.test@gmail.com','456789456','www.paletamix.pl',1,'Ul.kordeckiego','1',NULL,'Nieporęt','05-126','Polska','2025-04-26 01:53:49','2025-04-26 01:53:49');
/*!40000 ALTER TABLE `auth_dostawcy` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Historia logowań użytkowników';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_historia_logowan`
--

/*!40000 ALTER TABLE `auth_historia_logowan` DISABLE KEYS */;
INSERT INTO `auth_historia_logowan` VALUES (1,'ADM/00001/LOG','2025-06-25 03:56:03','success',NULL,NULL),(2,'SUP/00001/LOG','2025-06-25 03:56:13','success',NULL,NULL),(3,'STF/00001/LOG','2025-06-25 03:56:23','success',NULL,NULL),(4,'ADM/00001/LOG','2025-06-25 04:24:57','failed',NULL,NULL),(5,'ADM/00001/LOG','2025-06-25 04:25:53','success',NULL,NULL),(6,'SUP/00001/LOG','2025-06-25 04:26:03','success',NULL,NULL),(7,'STF/00001/LOG','2025-06-25 04:26:11','success',NULL,NULL),(8,'ADM/00001/LOG','2025-06-25 05:16:54','failed',NULL,NULL),(9,'ADM/00001/LOG','2025-06-25 05:18:45','success',NULL,NULL),(10,'ADM/00001/LOG','2025-06-25 12:46:30','success',NULL,NULL),(11,'STF/00001/LOG','2025-06-25 13:48:45','success',NULL,NULL),(12,'SUP/00001/LOG','2025-06-25 13:50:00','success',NULL,NULL),(13,'ADM/00001/LOG','2025-06-25 13:55:43','success',NULL,NULL);
/*!40000 ALTER TABLE `auth_historia_logowan` ENABLE KEYS */;

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

/*!40000 ALTER TABLE `auth_pracownicy` DISABLE KEYS */;
INSERT INTO `auth_pracownicy` VALUES ('ADM/00001','Admin','System','admin','admin@msbox.com','500100200','2025-02-22 00:23:20','2025-02-22 00:23:20'),('ADM/00002','Wiktor','Zawadzki','admin','wiktor.zawadzki@gmail.com','515227639','2025-04-25 17:21:08','2025-04-25 17:21:08'),('STF/00001','Jan','Pracownik','staff','pracownik@msbox.com','500300400','2025-02-22 00:23:20','2025-02-22 00:23:20');
/*!40000 ALTER TABLE `auth_pracownicy` ENABLE KEYS */;

--
-- Table structure for table `dos_dostawy`
--

DROP TABLE IF EXISTS `dos_dostawy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dos_dostawy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lot_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pallet_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_description` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ean` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `asin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unit_retail` decimal(10,2) NOT NULL COMMENT 'Cena rynkowa produktu w walucie zadeklarowanej przez dostawcę',
  `currency_value` decimal(10,4) NOT NULL COMMENT 'Kurs waluty (np. EUR/PLN) wprowadzony przez dostawcę',
  `value_pln_net` decimal(10,2) NOT NULL COMMENT 'Obliczone: unit_retail * currency_value',
  `value_percentage` decimal(5,4) NOT NULL COMMENT 'Procentowa wartość ceny dostawcy dla nas (np. 0.1800 dla 18%)',
  `vat_rate` decimal(4,2) NOT NULL DEFAULT '0.23',
  `selling_price_pln_gross` decimal(10,2) NOT NULL COMMENT 'Stores the calculated VAT amount on the net cost price in PLN, based on the formula: (value_pln_net * value_percentage) * vat_rate',
  `country_of_origin` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `import_timestamp` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `delivery_file_id` int DEFAULT NULL COMMENT 'Powiązanie z plikiem źródłowym',
  `validation_status` enum('pending','validated','missing_data','duplicate') COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'Status walidacji produktu',
  `missing_fields` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Lista brakujących pól (oddzielone przecinkami)',
  PRIMARY KEY (`id`),
  KEY `supplier_deliveries_lot_number` (`lot_number`),
  KEY `supplier_deliveries_pallet_id` (`pallet_id`),
  KEY `supplier_deliveries_ean` (`ean`),
  KEY `supplier_deliveries_asin` (`asin`),
  KEY `supplier_deliveries_import_timestamp` (`import_timestamp`),
  KEY `supplier_deliveries_delivery_file_id` (`delivery_file_id`),
  KEY `supplier_deliveries_validation_status` (`validation_status`),
  CONSTRAINT `supplier_deliveries_delivery_file_id_foreign_idx` FOREIGN KEY (`delivery_file_id`) REFERENCES `dos_dostawy_surowe` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dos_dostawy`
--

/*!40000 ALTER TABLE `dos_dostawy` DISABLE KEYS */;
/*!40000 ALTER TABLE `dos_dostawy` ENABLE KEYS */;

--
-- Table structure for table `dos_dostawy_surowe`
--

DROP TABLE IF EXISTS `dos_dostawy_surowe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dos_dostawy_surowe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID dostawcy z login_table_suppliers',
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwa pliku źródłowego (np. dostawa.xlsx)',
  `file_hash` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hash pliku dla wykrywania duplikatów',
  `file_content` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Oryginalny plik w formie CSV (po konwersji z XLSX)',
  `upload_timestamp` datetime DEFAULT NULL COMMENT 'Kiedy plik został wgrany',
  `processing_status` enum('pending','processing','completed','error') COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'Status przetwarzania',
  `error_message` text COLLATE utf8mb4_unicode_ci COMMENT 'Komunikat błędu jeśli wystąpił',
  `total_rows` int DEFAULT NULL COMMENT 'Liczba wierszy w pliku',
  `processed_rows` int DEFAULT '0' COMMENT 'Liczba przetworzonych wierszy',
  `aggregated_products` int DEFAULT '0' COMMENT 'Liczba produktów po agregacji (w supplier_deliveries)',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_deliveries_raw_supplier_id` (`supplier_id`),
  KEY `supplier_deliveries_raw_file_hash` (`file_hash`),
  KEY `supplier_deliveries_raw_processing_status` (`processing_status`),
  KEY `supplier_deliveries_raw_upload_timestamp` (`upload_timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dos_dostawy_surowe`
--

/*!40000 ALTER TABLE `dos_dostawy_surowe` DISABLE KEYS */;
/*!40000 ALTER TABLE `dos_dostawy_surowe` ENABLE KEYS */;

--
-- Table structure for table `dos_finanse`
--

DROP TABLE IF EXISTS `dos_finanse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dos_finanse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `delivery_file_id` int NOT NULL,
  `supplier_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID dostawcy',
  `total_items` int NOT NULL COMMENT 'Łączna liczba produktów (suma quantity)',
  `total_unique_products` int NOT NULL COMMENT 'Liczba unikalnych produktów (liczba rekordów)',
  `value_netto` decimal(15,2) NOT NULL COMMENT 'Wartość netto (suma quantity * unit_retail)',
  `vat_rate` decimal(5,4) NOT NULL DEFAULT '0.2300' COMMENT 'Stawka VAT (np. 0.23 dla 23%)',
  `margin_percentage` decimal(5,4) NOT NULL DEFAULT '0.1800' COMMENT 'Marża (np. 0.18 dla 18%)',
  `value_brutto` decimal(15,2) NOT NULL COMMENT 'Wartość brutto = value_netto * (1 + vat_rate)',
  `our_cost_netto` decimal(15,2) NOT NULL COMMENT 'Nasz koszt netto = value_netto * margin_percentage',
  `our_cost_brutto` decimal(15,2) NOT NULL COMMENT 'Nasz koszt brutto = our_cost_netto * (1 + vat_rate)',
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'EUR' COMMENT 'Waluta',
  `exchange_rate` decimal(8,4) DEFAULT NULL COMMENT 'Kurs wymiany jeśli potrzebny',
  `payment_terms` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Warunki płatności',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_delivery_finance_delivery_file_id` (`delivery_file_id`),
  KEY `supplier_delivery_finance_supplier_id` (`supplier_id`),
  CONSTRAINT `dos_finanse_ibfk_1` FOREIGN KEY (`delivery_file_id`) REFERENCES `dos_dostawy_surowe` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dos_finanse`
--

/*!40000 ALTER TABLE `dos_finanse` DISABLE KEYS */;
/*!40000 ALTER TABLE `dos_finanse` ENABLE KEYS */;

--
-- Table structure for table `prod_amazon_produkty`
--

DROP TABLE IF EXISTS `prod_amazon_produkty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_amazon_produkty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `asin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `upc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `initial_price` decimal(10,2) DEFAULT NULL,
  `final_price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'EUR',
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categories` json DEFAULT NULL,
  `domain` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_the_brand` text COLLATE utf8mb4_unicode_ci,
  `features` json DEFAULT NULL,
  `images` json DEFAULT NULL,
  `product_details` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_asin` (`asin`),
  KEY `idx_brand` (`brand`),
  KEY `idx_domain` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_amazon_produkty`
--

/*!40000 ALTER TABLE `prod_amazon_produkty` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_amazon_produkty` ENABLE KEYS */;

--
-- Table structure for table `prod_analiza_opisow`
--

DROP TABLE IF EXISTS `prod_analiza_opisow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_analiza_opisow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phrase` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keyword` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_phrase` (`phrase`),
  KEY `idx_keyword` (`keyword`),
  KEY `idx_count` (`count`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_analiza_opisow`
--

/*!40000 ALTER TABLE `prod_analiza_opisow` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_analiza_opisow` ENABLE KEYS */;

--
-- Table structure for table `prod_katalog_master`
--

DROP TABLE IF EXISTS `prod_katalog_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_katalog_master` (
  `id_product_catalog` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `asin_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kod ASIN produktu',
  `ean_code` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kod EAN produktu',
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwa produktu',
  `price_market` decimal(12,2) DEFAULT NULL COMMENT 'Cena rynkowa produktu',
  `description` json DEFAULT NULL COMMENT 'JSON zawierający informacje o produkcie: Kategoria, Podkategoria, Opisy',
  `images` json DEFAULT NULL COMMENT 'JSON z referencjami do zdjęć w S3',
  `last_price_check_date` timestamp NULL DEFAULT NULL COMMENT 'Data ostatniego sprawdzenia ceny',
  `source_url` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL źródłowy, z którego pobrano dane',
  `created_by` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ID pracownika, który utworzył rekord',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_product_catalog`),
  UNIQUE KEY `idx_katalog_produktow_asin` (`asin_code`),
  KEY `idx_katalog_produktow_ean` (`ean_code`),
  KEY `idx_katalog_produktow_created_by` (`created_by`),
  CONSTRAINT `fk_katalog_produktow_created_by` FOREIGN KEY (`created_by`) REFERENCES `auth_pracownicy` (`id_pracownika`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_katalog_master`
--

/*!40000 ALTER TABLE `prod_katalog_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_katalog_master` ENABLE KEYS */;

--
-- Table structure for table `prod_produkty_allegro`
--

DROP TABLE IF EXISTS `prod_produkty_allegro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_produkty_allegro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `allegro_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `category_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parameters` text COLLATE utf8mb4_unicode_ci COMMENT 'JSON z parametrami produktu',
  `status` enum('active','inactive','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_allegro_id` (`allegro_id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_produkty_allegro`
--

/*!40000 ALTER TABLE `prod_produkty_allegro` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_produkty_allegro` ENABLE KEYS */;

--
-- Table structure for table `prod_szablony_produktow`
--

DROP TABLE IF EXISTS `prod_szablony_produktow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_szablony_produktow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parameters` text COLLATE utf8mb4_unicode_ci COMMENT 'JSON z parametrami szablonu',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_szablony_produktow`
--

/*!40000 ALTER TABLE `prod_szablony_produktow` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_szablony_produktow` ENABLE KEYS */;

--
-- Table structure for table `prod_zdjecia_produktow`
--

DROP TABLE IF EXISTS `prod_zdjecia_produktow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prod_zdjecia_produktow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `s3_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_is_main` (`is_main`),
  CONSTRAINT `prod_zdjecia_produktow_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `prod_produkty_allegro` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_zdjecia_produktow`
--

/*!40000 ALTER TABLE `prod_zdjecia_produktow` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_zdjecia_produktow` ENABLE KEYS */;

--
-- Table structure for table `ver_podsumowanie_sesji`
--

DROP TABLE IF EXISTS `ver_podsumowanie_sesji`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ver_podsumowanie_sesji` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `total_products_class_a` int DEFAULT '0' COMMENT 'Produkty klasy A (nowe)',
  `total_products_class_b` int DEFAULT '0' COMMENT 'Produkty klasy B (używane)',
  `total_products_class_c` int DEFAULT '0' COMMENT 'Produkty klasy C (uszkodzone)',
  `total_missing` int DEFAULT '0' COMMENT 'Produkty brakujące',
  `total_surplus` int DEFAULT '0' COMMENT 'Produkty nadwyżkowe',
  `total_financial_impact` decimal(15,2) DEFAULT '0.00' COMMENT 'Łączny wpływ finansowy sesji',
  `total_losses` decimal(15,2) DEFAULT '0.00' COMMENT 'Łączne straty',
  `total_gains` decimal(15,2) DEFAULT '0.00' COMMENT 'Łączne zyski',
  `verification_accuracy` decimal(5,2) DEFAULT NULL COMMENT 'Dokładność dostawy w % (produkty zgodne/wszystkie)',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_id` (`session_id`),
  KEY `verification_session_summary_session_id` (`session_id`),
  CONSTRAINT `ver_podsumowanie_sesji_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `ver_sesje` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ver_podsumowanie_sesji`
--

/*!40000 ALTER TABLE `ver_podsumowanie_sesji` DISABLE KEYS */;
/*!40000 ALTER TABLE `ver_podsumowanie_sesji` ENABLE KEYS */;

--
-- Table structure for table `ver_produkty`
--

DROP TABLE IF EXISTS `ver_produkty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ver_produkty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `source_product_id` int NOT NULL COMMENT 'Produkt źródłowy z dostawy (zagregowany)',
  `asin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ASIN produktu',
  `ean` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'EAN produktu',
  `item_description` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Opis produktu',
  `quantity_declared` int NOT NULL COMMENT 'Ilość zadeklarowana przez dostawcę (z agregacji)',
  `quantity_verified` int NOT NULL COMMENT 'Ilość rzeczywiście zweryfikowana w tej partii',
  `classification` enum('A','B','C','E','MISSING','SURPLUS') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'A=nowy, B=używany, C=uszkodzony, E=do sprawdzenia, MISSING=brak, SURPLUS=nadwyżka',
  `destination` enum('retail','box_mix','mystery_box','damaged','return_to_supplier','disposal','warehouse_keep','requires_decision') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Przeznaczenie produktu po weryfikacji',
  `condition_notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Szczegółowe notatki o stanie produktu',
  `verified_by` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID pracownika weryfikującego',
  `verified_at` datetime NOT NULL COMMENT 'Kiedy zweryfikowano',
  `unified_price` decimal(12,2) DEFAULT NULL COMMENT 'Ujednolicona cena po decyzji pracownika (może różnić się od oryginalnej)',
  `lpn_group` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Grupa LPN dla produktów o tej samej cenie i przeznaczeniu',
  `price_adjustment_reason` text COLLATE utf8mb4_unicode_ci COMMENT 'Powód korekty ceny przez pracownika',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `product_size` enum('S','M','L','XL','LONG','ONE_SIZE','VARIOUS') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Rozmiar produktu',
  `location` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Identyfikator lokalizacji magazynowej (np. R001-P001)',
  `lpn_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Unikalny numer LPN dla tego konkretnego produktu',
  `images` json DEFAULT NULL COMMENT 'JSON z referencjami do zdjęć produktu w S3',
  `source_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL źródłowy, z którego pobrano dane o produkcie',
  `price_verified` decimal(12,2) DEFAULT NULL COMMENT 'Cena rynkowa produktu po weryfikacji przez pracownika',
  `original_price` decimal(12,2) DEFAULT NULL COMMENT 'Oryginalna cena produktu podana przez dostawcę',
  `verification_status` enum('pending','in_progress','completed','rejected','requires_review') COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'Status weryfikacji tego konkretnego produktu',
  `verification_date` datetime DEFAULT NULL COMMENT 'Data kiedy produkt został zweryfikowany',
  `product_weight` decimal(8,3) DEFAULT NULL COMMENT 'Waga produktu w kg',
  `product_dimensions` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Wymiary produktu (np. 20x15x10 cm)',
  `packaging_condition` enum('perfect','good','damaged','missing','opened') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Stan opakowania produktu',
  `completeness` enum('complete','incomplete','missing_accessories','missing_manual','unknown') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kompletność produktu (akcesoria, instrukcje, etc.)',
  PRIMARY KEY (`id`),
  KEY `verification_products_session_id` (`session_id`),
  KEY `verification_products_source_product_id` (`source_product_id`),
  KEY `verification_products_asin` (`asin`),
  KEY `verification_products_classification` (`classification`),
  KEY `verification_products_destination` (`destination`),
  KEY `verification_products_lpn_group` (`lpn_group`),
  KEY `verification_products_location` (`location`),
  KEY `verification_products_lpn_number` (`lpn_number`),
  KEY `verification_products_product_size` (`product_size`),
  KEY `verification_products_verification_status` (`verification_status`),
  KEY `verification_products_verification_date` (`verification_date`),
  KEY `verification_products_packaging_condition` (`packaging_condition`),
  KEY `verification_products_completeness` (`completeness`),
  CONSTRAINT `ver_produkty_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `ver_sesje` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ver_produkty_ibfk_2` FOREIGN KEY (`source_product_id`) REFERENCES `dos_dostawy` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ver_produkty`
--

/*!40000 ALTER TABLE `ver_produkty` DISABLE KEYS */;
/*!40000 ALTER TABLE `ver_produkty` ENABLE KEYS */;

--
-- Table structure for table `ver_raporty_dostawcow`
--

DROP TABLE IF EXISTS `ver_raporty_dostawcow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ver_raporty_dostawcow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `supplier_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID dostawcy',
  `report_type` enum('discrepancies','damages','financial_summary','full_report') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Typ raportu',
  `report_data` json NOT NULL COMMENT 'Dane raportu w formacie JSON',
  `sent_to_supplier` tinyint(1) DEFAULT '0' COMMENT 'Czy raport został wysłany do dostawcy',
  `sent_at` datetime DEFAULT NULL COMMENT 'Kiedy wysłano raport',
  `supplier_response` text COLLATE utf8mb4_unicode_ci COMMENT 'Odpowiedź dostawcy na raport',
  `response_received_at` datetime DEFAULT NULL COMMENT 'Kiedy otrzymano odpowiedź',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `verification_supplier_reports_session_id` (`session_id`),
  KEY `verification_supplier_reports_supplier_id` (`supplier_id`),
  KEY `verification_supplier_reports_report_type` (`report_type`),
  CONSTRAINT `ver_raporty_dostawcow_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `ver_sesje` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ver_raporty_dostawcow`
--

/*!40000 ALTER TABLE `ver_raporty_dostawcow` DISABLE KEYS */;
/*!40000 ALTER TABLE `ver_raporty_dostawcow` ENABLE KEYS */;

--
-- Table structure for table `ver_rozbieznosci_finansowe`
--

DROP TABLE IF EXISTS `ver_rozbieznosci_finansowe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ver_rozbieznosci_finansowe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `verification_product_id` int NOT NULL,
  `asin` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `declared_market_value` decimal(12,2) NOT NULL COMMENT 'Wartość rynkowa zadeklarowana przez dostawcę',
  `actual_market_value` decimal(12,2) NOT NULL COMMENT 'Rzeczywista wartość rynkowa (po weryfikacji)',
  `purchase_cost_gross` decimal(12,2) NOT NULL COMMENT 'Koszt zakupu brutto = declared_value * 1.23 * 0.18',
  `expected_revenue_retail` decimal(12,2) DEFAULT NULL COMMENT 'Oczekiwany przychód ze sprzedaży detalicznej',
  `expected_revenue_box_mix` decimal(12,2) DEFAULT NULL COMMENT 'Oczekiwany przychód z box mix = actual_value * 0.5 * 0.81',
  `financial_impact` decimal(12,2) NOT NULL COMMENT 'Wpływ finansowy (dodatni=zysk, ujemny=strata)',
  `impact_type` enum('profit','loss','neutral') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Typ wpływu finansowego',
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT 'PLN' COMMENT 'Waluta obliczeń',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Dodatkowe notatki o rozbieżności',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `verification_financial_discrepancies_session_id` (`session_id`),
  KEY `verification_financial_discrepancies_verification_product_id` (`verification_product_id`),
  KEY `verification_financial_discrepancies_impact_type` (`impact_type`),
  CONSTRAINT `ver_rozbieznosci_finansowe_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `ver_sesje` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ver_rozbieznosci_finansowe_ibfk_2` FOREIGN KEY (`verification_product_id`) REFERENCES `ver_produkty` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ver_rozbieznosci_finansowe`
--

/*!40000 ALTER TABLE `ver_rozbieznosci_finansowe` DISABLE KEYS */;
/*!40000 ALTER TABLE `ver_rozbieznosci_finansowe` ENABLE KEYS */;

--
-- Table structure for table `ver_sesje`
--

DROP TABLE IF EXISTS `ver_sesje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ver_sesje` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Kod sesji weryfikacji np. VER_2024_001',
  `delivery_file_id` int NOT NULL COMMENT 'Powiązanie z dostawą',
  `supplier_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID dostawcy',
  `verification_status` enum('pending','in_progress','completed','reported_to_supplier') COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'Status procesu weryfikacji',
  `started_by` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID pracownika rozpoczynającego weryfikację',
  `started_at` datetime NOT NULL COMMENT 'Kiedy rozpoczęto weryfikację',
  `completed_at` datetime DEFAULT NULL COMMENT 'Kiedy zakończono weryfikację',
  `total_products_declared` int NOT NULL COMMENT 'Łączna ilość produktów zadeklarowana przez dostawcę',
  `total_products_verified` int DEFAULT '0' COMMENT 'Łączna ilość produktów zweryfikowana',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Notatki z weryfikacji',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_code` (`session_code`),
  KEY `verification_sessions_delivery_file_id` (`delivery_file_id`),
  KEY `verification_sessions_supplier_id` (`supplier_id`),
  KEY `verification_sessions_verification_status` (`verification_status`),
  KEY `verification_sessions_started_at` (`started_at`),
  CONSTRAINT `ver_sesje_ibfk_1` FOREIGN KEY (`delivery_file_id`) REFERENCES `dos_dostawy_surowe` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ver_sesje`
--

/*!40000 ALTER TABLE `ver_sesje` DISABLE KEYS */;
/*!40000 ALTER TABLE `ver_sesje` ENABLE KEYS */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-25 18:55:59
