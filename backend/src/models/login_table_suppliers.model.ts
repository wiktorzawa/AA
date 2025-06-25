/**
 * Model danych dla tabeli auth_dostawcy
 * Tabela zawierająca dane dostawców
 * Wszystkie nazwy kolumn w polskim nazewnictwie
 */

// Główny interfejs dla nowej struktury bazy danych
export interface AuthDostawcy {
  id_dostawcy: string; // Identyfikator dostawcy (np. SUP/00001)
  nazwa_firmy: string; // Nazwa firmy
  imie_kontaktu: string; // Imię osoby kontaktowej
  nazwisko_kontaktu: string; // Nazwisko osoby kontaktowej
  numer_nip: string; // Numer NIP
  adres_email: string; // Adres email
  telefon: string; // Numer telefonu
  strona_www: string | null; // Strona internetowa
  aktywny: boolean; // Czy dostawca jest aktywny
  adres_ulica: string; // Ulica
  adres_numer_budynku: string; // Numer budynku
  adres_numer_lokalu: string | null; // Numer lokalu
  adres_miasto: string; // Miejscowość
  adres_kod_pocztowy: string; // Kod pocztowy
  adres_kraj: string; // Kraj
  data_utworzenia: Date; // Data utworzenia rekordu
  data_aktualizacji: Date; // Data aktualizacji rekordu
}

// Zachowujemy stary interfejs dla kompatybilności wstecznej
export interface LoginTableSuppliers {
  // Mapowanie starych nazw na nowe dla kompatybilności
  id_supplier: string; // -> id_dostawcy
  company_name: string; // -> nazwa_firmy
  first_name: string; // -> imie_kontaktu
  last_name: string; // -> nazwisko_kontaktu
  nip: string; // -> numer_nip
  email: string; // -> adres_email
  phone: string; // -> telefon
  website: string | null; // -> strona_www
  address_street: string; // -> adres_ulica
  address_building: string; // -> adres_numer_budynku
  address_apartment: string | null; // -> adres_numer_lokalu
  address_city: string; // -> adres_miasto
  address_postal_code: string; // -> adres_kod_pocztowy
  address_country: string; // -> adres_kraj
  created_at: Date; // -> data_utworzenia
  updated_at: Date; // -> data_aktualizacji
}

// Funkcja mapująca nowe dane na stary format dla kompatybilności
export function mapToLegacyFormat(
  supplierData: AuthDostawcy,
): LoginTableSuppliers {
  return {
    id_supplier: supplierData.id_dostawcy,
    company_name: supplierData.nazwa_firmy,
    first_name: supplierData.imie_kontaktu,
    last_name: supplierData.nazwisko_kontaktu,
    nip: supplierData.numer_nip,
    email: supplierData.adres_email,
    phone: supplierData.telefon,
    website: supplierData.strona_www,
    address_street: supplierData.adres_ulica,
    address_building: supplierData.adres_numer_budynku,
    address_apartment: supplierData.adres_numer_lokalu,
    address_city: supplierData.adres_miasto,
    address_postal_code: supplierData.adres_kod_pocztowy,
    address_country: supplierData.adres_kraj,
    created_at: supplierData.data_utworzenia,
    updated_at: supplierData.data_aktualizacji,
  };
}

// Funkcja mapująca stary format na nowe dane
export function mapFromLegacyFormat(
  legacyData: Partial<LoginTableSuppliers>,
): Partial<AuthDostawcy> {
  return {
    id_dostawcy: legacyData.id_supplier,
    nazwa_firmy: legacyData.company_name,
    imie_kontaktu: legacyData.first_name,
    nazwisko_kontaktu: legacyData.last_name,
    numer_nip: legacyData.nip,
    adres_email: legacyData.email,
    telefon: legacyData.phone,
    strona_www: legacyData.website,
    adres_ulica: legacyData.address_street,
    adres_numer_budynku: legacyData.address_building,
    adres_numer_lokalu: legacyData.address_apartment,
    adres_miasto: legacyData.address_city,
    adres_kod_pocztowy: legacyData.address_postal_code,
    adres_kraj: legacyData.address_country,
    data_utworzenia: legacyData.created_at,
    data_aktualizacji: legacyData.updated_at,
  };
}
