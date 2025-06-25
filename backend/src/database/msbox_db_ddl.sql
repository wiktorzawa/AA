-- DDL Export for database: msbox_db
-- Generated on: 2025-06-24T19:05:56.641Z
-- Host: flask-app-msbox.chqqwymic43o.us-east-1.rds.amazonaws.com

-- =============================================
-- DATABASE SCHEMA DDL
-- =============================================

-- =============================================
-- Table: SequelizeMeta
-- =============================================

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- =============================================
-- Table: katalog_produktow_amazon_products
-- =============================================

CREATE TABLE `katalog_produktow_amazon_products` (
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

-- =============================================
-- Table: katalog_produktow_description_analysis
-- =============================================

CREATE TABLE `katalog_produktow_description_analysis` (
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

-- =============================================
-- Table: katalog_produktow_master
-- =============================================

CREATE TABLE `katalog_produktow_master` (
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
  CONSTRAINT `fk_katalog_produktow_created_by` FOREIGN KEY (`created_by`) REFERENCES `login_table_staff` (`id_staff`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: katalog_produktow_product_images
-- =============================================

CREATE TABLE `katalog_produktow_product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `s3_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_main` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_is_main` (`is_main`),
  CONSTRAINT `katalog_produktow_product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `katalog_produktow_products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: katalog_produktow_product_templates
-- =============================================

CREATE TABLE `katalog_produktow_product_templates` (
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

-- =============================================
-- Table: katalog_produktow_products
-- =============================================

CREATE TABLE `katalog_produktow_products` (
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

-- =============================================
-- Table: login_auth_data
-- =============================================

CREATE TABLE `login_auth_data` (
  `id_login` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identyfikator logowania',
  `related_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Powiązany identyfikator użytkownika',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Adres email',
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Zahaszowane hasło',
  `role` enum('admin','staff','supplier') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Rola użytkownika',
  `failed_login_attempts` int DEFAULT '0' COMMENT 'Liczba nieudanych prób logowania',
  `locked_until` timestamp NULL DEFAULT NULL COMMENT 'Zablokowane do',
  `last_login` timestamp NULL DEFAULT NULL COMMENT 'Ostatnie logowanie',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data utworzenia',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data aktualizacji',
  PRIMARY KEY (`id_login`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `related_id` (`related_id`),
  KEY `idx_login_auth_data_role` (`role`) COMMENT 'Indeks przyśpieszający wyszukiwanie po roli'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela zawierająca podstawowe dane do logowania i autoryzacji użytkowników';

-- =============================================
-- Table: login_history_data
-- =============================================

CREATE TABLE `login_history_data` (
  `id_history` int NOT NULL AUTO_INCREMENT COMMENT 'Identyfikator wpisu',
  `user_login` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Identyfikator użytkownika',
  `login_timestamp` timestamp NOT NULL COMMENT 'Czas próby logowania',
  `status` enum('success','failed') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Status logowania',
  `session_start` timestamp NULL DEFAULT NULL COMMENT 'Początek sesji',
  `session_end` timestamp NULL DEFAULT NULL COMMENT 'Koniec sesji',
  PRIMARY KEY (`id_history`),
  KEY `user_login` (`user_login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Historia logowań użytkowników';

-- =============================================
-- Table: login_table_staff
-- =============================================

CREATE TABLE `login_table_staff` (
  `id_staff` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Imię pracownika',
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwisko pracownika',
  `role` enum('admin','staff') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Rola pracownika w systemie',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Adres email służbowy',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Numer telefonu',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data utworzenia rekordu',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data aktualizacji rekordu',
  PRIMARY KEY (`id_staff`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela zawierająca dane pracowników i administratorów';

-- =============================================
-- Table: login_table_suppliers
-- =============================================

CREATE TABLE `login_table_suppliers` (
  `id_supplier` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwa firmy',
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Imię osoby kontaktowej',
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nazwisko osoby kontaktowej',
  `nip` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Numer NIP',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Adres email',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Numer telefonu',
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Strona internetowa',
  `address_street` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ulica',
  `address_building` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Numer budynku',
  `address_apartment` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Numer lokalu',
  `address_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Miejscowość',
  `address_postal_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Kod pocztowy',
  `address_country` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Kraj',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data utworzenia rekordu',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data aktualizacji rekordu',
  PRIMARY KEY (`id_supplier`),
  UNIQUE KEY `nip` (`nip`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela zawierająca dane dostawców';

-- =============================================
-- Table: offer_analysis_categories
-- =============================================

CREATE TABLE `offer_analysis_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `analysis_id` int NOT NULL,
  `category_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_analysis_id` (`analysis_id`),
  KEY `idx_category_id` (`category_id`),
  CONSTRAINT `offer_analysis_categories_ibfk_1` FOREIGN KEY (`analysis_id`) REFERENCES `offer_analysis_main` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: offer_analysis_keywords
-- =============================================

CREATE TABLE `offer_analysis_keywords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `analysis_id` int NOT NULL,
  `keyword` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_analysis_id` (`analysis_id`),
  KEY `idx_keyword` (`keyword`),
  KEY `idx_count` (`count`),
  CONSTRAINT `offer_analysis_keywords_ibfk_1` FOREIGN KEY (`analysis_id`) REFERENCES `offer_analysis_main` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: offer_analysis_main
-- =============================================

CREATE TABLE `offer_analysis_main` (
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

-- =============================================
-- Table: offer_analysis_parameters
-- =============================================

CREATE TABLE `offer_analysis_parameters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `analysis_id` int NOT NULL,
  `parameter_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parameter_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parameter_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_analysis_id` (`analysis_id`),
  KEY `idx_parameter_id` (`parameter_id`),
  CONSTRAINT `offer_analysis_parameters_ibfk_1` FOREIGN KEY (`analysis_id`) REFERENCES `offer_analysis_main` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: supplier_deliveries
-- =============================================

CREATE TABLE `supplier_deliveries` (
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
  CONSTRAINT `supplier_deliveries_delivery_file_id_foreign_idx` FOREIGN KEY (`delivery_file_id`) REFERENCES `supplier_deliveries_raw` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: supplier_deliveries_raw
-- =============================================

CREATE TABLE `supplier_deliveries_raw` (
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

-- =============================================
-- Table: supplier_delivery_finance
-- =============================================

CREATE TABLE `supplier_delivery_finance` (
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
  CONSTRAINT `supplier_delivery_finance_ibfk_1` FOREIGN KEY (`delivery_file_id`) REFERENCES `supplier_deliveries_raw` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: verification_financial_discrepancies
-- =============================================

CREATE TABLE `verification_financial_discrepancies` (
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
  CONSTRAINT `verification_financial_discrepancies_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `verification_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `verification_financial_discrepancies_ibfk_2` FOREIGN KEY (`verification_product_id`) REFERENCES `verification_products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: verification_products
-- =============================================

CREATE TABLE `verification_products` (
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
  CONSTRAINT `verification_products_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `verification_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `verification_products_ibfk_2` FOREIGN KEY (`source_product_id`) REFERENCES `supplier_deliveries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: verification_session_summary
-- =============================================

CREATE TABLE `verification_session_summary` (
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
  CONSTRAINT `verification_session_summary_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `verification_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: verification_sessions
-- =============================================

CREATE TABLE `verification_sessions` (
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
  CONSTRAINT `verification_sessions_ibfk_1` FOREIGN KEY (`delivery_file_id`) REFERENCES `supplier_deliveries_raw` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: verification_supplier_reports
-- =============================================

CREATE TABLE `verification_supplier_reports` (
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
  CONSTRAINT `verification_supplier_reports_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `verification_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

