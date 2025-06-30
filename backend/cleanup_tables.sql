-- Skrypt do usunięcia wszystkich niepotrzebnych tabel
USE msbox_db;

-- Wyłącz sprawdzanie kluczy obcych
SET FOREIGN_KEY_CHECKS = 0;

-- Usuń tabele dostaw
DROP TABLE IF EXISTS dost_dostawy_produkty;

DROP TABLE IF EXISTS dost_dostawy_surowe;

DROP TABLE IF EXISTS dost_faktury_dostawcow;

DROP TABLE IF EXISTS dost_finanse_dostaw;

DROP TABLE IF EXISTS dost_kolejka_scrapingu;

-- Usuń tabele produktów
DROP TABLE IF EXISTS prod_amazon_produkty;

DROP TABLE IF EXISTS prod_katalog_master;

DROP TABLE IF EXISTS prod_master_produktow;

DROP TABLE IF EXISTS prod_produkty_amazon;

DROP TABLE IF EXISTS prod_zdjecia_produktow;

-- Usuń tabele weryfikacji
DROP TABLE IF EXISTS ver_podsumowanie_sesji;

DROP TABLE IF EXISTS ver_produkty;

DROP TABLE IF EXISTS ver_raporty_dostawcow;

DROP TABLE IF EXISTS ver_rozbieznosci_finansowe;

DROP TABLE IF EXISTS ver_sesje;

DROP TABLE IF EXISTS weryf_sesje_weryfikacji;

-- Usuń tabelę SequelizeMeta (reset migracji)
DROP TABLE IF EXISTS SequelizeMeta;

-- Włącz z powrotem sprawdzanie kluczy obcych
SET FOREIGN_KEY_CHECKS = 1;

-- Pokaż pozostałe tabele
SHOW TABLES;