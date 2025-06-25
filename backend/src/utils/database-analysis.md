# Analiza struktury bazy danych msbox_db

## 📊 OGÓLNA ANALIZA STRUKTURY

### Liczba tabel: 23

### Główne domeny biznesowe:

1. **Autoryzacja i użytkownicy** (4 tabele)
2. **Katalog produktów** (6 tabel)
3. **Analizy ofert** (4 tabele)
4. **Dostawy dostawców** (3 tabele)
5. **System weryfikacji** (5 tabel)
6. **Metadata** (1 tabela)

## 🔗 ZALEŻNOŚCI I POŁĄCZENIA MIĘDZY TABELAMI

### 1. Moduł Autoryzacji

```
login_table_staff ←→ login_auth_data (related_id)
login_table_suppliers ←→ login_auth_data (related_id)
login_auth_data ←→ login_history_data (user_login)
```

### 2. Moduł Katalog Produktów

```
katalog_produktow_products ←→ katalog_produktow_product_images (product_id)
katalog_produktow_master ←→ login_table_staff (created_by)
```

### 3. Moduł Analizy Ofert

```
offer_analysis_main ←→ offer_analysis_categories (analysis_id)
offer_analysis_main ←→ offer_analysis_keywords (analysis_id)
offer_analysis_main ←→ offer_analysis_parameters (analysis_id)
```

### 4. Moduł Dostaw

```
supplier_deliveries_raw ←→ supplier_deliveries (delivery_file_id)
supplier_deliveries_raw ←→ supplier_delivery_finance (delivery_file_id)
```

### 5. Moduł Weryfikacji

```
verification_sessions ←→ verification_products (session_id)
verification_sessions ←→ verification_session_summary (session_id)
verification_sessions ←→ verification_financial_discrepancies (session_id)
verification_sessions ←→ verification_supplier_reports (session_id)
verification_products ←→ verification_financial_discrepancies (verification_product_id)
supplier_deliveries ←→ verification_products (source_product_id)
supplier_deliveries_raw ←→ verification_sessions (delivery_file_id)
```

## ❌ ZIDENTYFIKOWANE PROBLEMY

### 1. **Problemy z kluczami obcymi**

- Brak FK między `login_history_data.user_login` a `login_auth_data.id_login`
- Brak FK między `supplier_deliveries_raw.supplier_id` a `login_table_suppliers.id_supplier`
- Brak FK między `verification_sessions.supplier_id` a `login_table_suppliers.id_supplier`
- Brak FK między `verification_products.verified_by` a `login_table_staff.id_staff`

### 2. **Niespójność nazewnictwa**

- Mieszanie języków: polskie i angielskie nazwy
- Różne konwencje nazewnictwa (snake_case vs camelCase)
- Niespójne prefiksy tabel

### 3. **Problemy strukturalne**

- Tabela `katalog_produktow_amazon_products` jest odizolowana (brak FK)
- Duplikacja danych produktów w różnych tabelach
- Brak normalizacji w niektórych miejscach

### 4. **Problemy z typami danych**

- Różne długości dla podobnych pól (np. ASIN, EAN)
- Niespójne typy dla dat (datetime vs timestamp)
- Brak walidacji dla enum wartości

## 🔧 PROPOZYCJE POPRAWEK

### 1. **Ujednolicenie nazewnictwa (język polski)**

#### Tabele autoryzacji:

- `login_auth_data` → `dane_autoryzacji`
- `login_history_data` → `historia_logowan`
- `login_table_staff` → `pracownicy`
- `login_table_suppliers` → `dostawcy`

#### Tabele produktów:

- `katalog_produktow_master` → `katalog_produktow`
- `katalog_produktow_amazon_products` → `produkty_amazon`
- `katalog_produktow_products` → `produkty_allegro`
- `katalog_produktow_product_images` → `zdjecia_produktow`
- `katalog_produktow_product_templates` → `szablony_produktow`
- `katalog_produktow_description_analysis` → `analiza_opisow`

#### Tabele analiz:

- `offer_analysis_main` → `analizy_ofert`
- `offer_analysis_categories` → `kategorie_analiz`
- `offer_analysis_keywords` → `slowa_kluczowe_analiz`
- `offer_analysis_parameters` → `parametry_analiz`

#### Tabele dostaw:

- `supplier_deliveries` → `dostawy`
- `supplier_deliveries_raw` → `surowe_dostawy`
- `supplier_delivery_finance` → `finanse_dostaw`

#### Tabele weryfikacji:

- `verification_sessions` → `sesje_weryfikacji`
- `verification_products` → `produkty_weryfikacji`
- `verification_session_summary` → `podsumowanie_sesji`
- `verification_financial_discrepancies` → `rozbieznosci_finansowe`
- `verification_supplier_reports` → `raporty_dostawcow`

### 2. **Ujednolicenie nazw kolumn**

#### Standardowe kolumny:

- `created_at` → `data_utworzenia`
- `updated_at` → `data_aktualizacji`
- `id` → zawsze z prefiksem tabeli (np. `id_produktu`)

#### Klucze obce:

- Zawsze z prefiksem `id_` + nazwa tabeli
- Np. `supplier_id` → `id_dostawcy`

### 3. **Dodanie brakujących kluczy obcych**

### 4. **Normalizacja struktur**

- Wydzielenie tabeli `kategorie_produktow`
- Wydzielenie tabeli `waluty`
- Ujednolicenie tabeli produktów

## 📋 SZCZEGÓŁOWE PROPOZYCJE KOLUMN

### Przykład: Tabela `produkty` (zunifikowana)

```sql
CREATE TABLE `produkty` (
  `id_produktu` int NOT NULL AUTO_INCREMENT,
  `kod_asin` varchar(20) NOT NULL,
  `kod_ean` varchar(13) DEFAULT NULL,
  `kod_upc` varchar(12) DEFAULT NULL,
  `nazwa_produktu` varchar(500) NOT NULL,
  `opis_produktu` text,
  `id_kategorii` int NOT NULL,
  `id_marki` int DEFAULT NULL,
  `cena_rynkowa` decimal(12,2) DEFAULT NULL,
  `id_waluty` char(3) DEFAULT 'PLN',
  `waga_kg` decimal(8,3) DEFAULT NULL,
  `wymiary_cm` varchar(50) DEFAULT NULL,
  `url_zrodlowy` varchar(1000) DEFAULT NULL,
  `zdjecia_json` json DEFAULT NULL,
  `parametry_json` json DEFAULT NULL,
  `status_produktu` enum('aktywny','nieaktywny','szkic') DEFAULT 'szkic',
  `data_ostatniej_aktualizacji_ceny` timestamp NULL DEFAULT NULL,
  `id_utworzyl` varchar(20) DEFAULT NULL,
  `data_utworzenia` timestamp DEFAULT CURRENT_TIMESTAMP,
  `data_aktualizacji` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_produktu`),
  UNIQUE KEY `uk_produkty_asin` (`kod_asin`),
  KEY `idx_produkty_ean` (`kod_ean`),
  KEY `idx_produkty_kategoria` (`id_kategorii`),
  KEY `idx_produkty_marka` (`id_marki`),
  KEY `idx_produkty_status` (`status_produktu`)
);
```

## 🎯 PRIORYTETOWE DZIAŁANIA

### Wysokie priorytety:

1. Dodanie brakujących kluczy obcych
2. Ujednolicenie nazewnictwa
3. Naprawienie typów danych
4. Dodanie indeksów wydajnościowych

### Średnie priorytety:

1. Normalizacja struktur
2. Optymalizacja przechowywania JSON
3. Dodanie walidacji na poziomie bazy

### Niskie priorytety:

1. Refaktoryzacja nazw tabel
2. Optymalizacja wydajności zapytań
3. Dodanie partycjonowania dla dużych tabel

## 📈 METRYKI I STATYSTYKI

### Obecna struktura:

- **23 tabele** w bazie
- **12 kluczy obcych** zdefiniowanych
- **~50 indeksów** w sumie
- **Mieszane nazewnictwo** (PL/EN)

### Docelowa struktura:

- **25-27 tabel** (po normalizacji)
- **20+ kluczy obcych** (kompletne relacje)
- **60+ indeksów** (zoptymalizowane)
- **Spójne nazewnictwo polskie**
