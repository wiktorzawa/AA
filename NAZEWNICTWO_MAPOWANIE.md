# Mapa Nazewnictwa: Baza Danych v4 -> Strapi v5

Ten dokument śledzi zmiany w nazewnictwie pól podczas migracji ze starej architektury bazy danych do nowego schematu w Strapi v5. Celem jest zachowanie spójności i ułatwienie przyszłego rozwoju.

**Źródło prawdy:** Zrzut SQL tabeli `suppliers` (dostarczony 11.07.2025).

## Konwencja

- **Stara Baza (v4):** `snake_case` (np. `id_dostawcy`)
- **Nowe API (v5):** `camelCase` (np. `supplierId`)

---

## Tabela: `suppliers` (teraz: `Supplier`)

### Pola już zdefiniowane:

| Stara nazwa pola (v4) | Nowa nazwa pola (v5) | Walidacja (v5)     |
| --------------------- | -------------------- | ------------------ |
| `id_dostawcy`         | `supplierId`         | Wymagane, Unikalne |
| `nazwa_firmy`         | `companyName`        | Wymagane           |
| `numer_nip`           | `nip`                | Wymagane, Unikalne |
| `adres_email`         | `email`              | Wymagane, Unikalne |

### Pola do zdefiniowania:

| Stara nazwa pola (v4) | Proponowana nowa nazwa (v5) | Proponowany typ | Ustalono |
| --------------------- | --------------------------- | --------------- | -------- |
| `imie_kontaktu`       | `contactFirstName`          | `string`        | Tak      |
| `nazwisko_kontaktu`   | `contactLastName`           | `string`        | Tak      |
| `telefon`             | `phone`                     | `string`        | Tak      |
| `strona_www`          | `website`                   | `string`        | Tak      |
| `adres_ulica`         | `street`                    | `string`        | Tak      |
| `adres_numer_budynku` | `buildingNumber`            | `string`        | Tak      |
| `adres_numer_lokalu`  | `apartmentNumber`           | `string`        | Tak      |
| `adres_miasto`        | `city`                      | `string`        | Tak      |
| `adres_kod_pocztowy`  | `postalCode`                | `string`        | Tak      |
| `adres_kraj`          | `country`                   | `string`        | Tak      |

_Uwaga: Pola systemowe takie jak `id`, `created_at`, `updated_at` są zarządzane automatycznie przez Strapi i nie wymagają mapowania._

---

## Tabela: `staff_members` (teraz: `Staff`)

| Stara nazwa pola (v4) | Proponowana nowa nazwa (v5) | Proponowany typ | Ustalono |
| --------------------- | --------------------------- | --------------- | -------- |
| `id_pracownika`       | `staffId`                   | `string`        | Tak      |
| `imie`                | `firstName`                 | `string`        | Tak      |
| `nazwisko`            | `lastName`                  | `string`        | Tak      |
| `adres_email`         | `email`                     | `email`         | Tak      |
| `telefon`             | `phone`                     | `string`        | Tak      |
| `data_zatrudnienia`   | `hireDate`                  | `date`          | Tak      |
| `data_zwolnienia`     | `terminationDate`           | `date`          | Tak      |
| `rola`                | `position`                  | `string`        | Tak      |
