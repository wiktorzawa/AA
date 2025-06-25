/**
 * Model danych dla tabeli auth_pracownicy
 * Tabela zawierająca dane pracowników i administratorów
 * Wszystkie nazwy kolumn w polskim nazewnictwie
 */

export type StaffRole = "admin" | "staff";

// Główny interfejs dla nowej struktury bazy danych
export interface AuthPracownicy {
  id_pracownika: string; // Identyfikator pracownika (np. ADM/00001, STF/00001)
  imie: string; // Imię pracownika
  nazwisko: string; // Nazwisko pracownika
  rola: StaffRole; // Rola pracownika w systemie (admin, staff)
  adres_email: string; // Adres email służbowy
  telefon: string | null; // Numer telefonu
  data_utworzenia: Date; // Data utworzenia rekordu
  data_aktualizacji: Date; // Data aktualizacji rekordu
}

// Zachowujemy stary interfejs dla kompatybilności wstecznej
export interface LoginTableStaff {
  // Mapowanie starych nazw na nowe dla kompatybilności
  id_staff: string; // -> id_pracownika
  first_name: string; // -> imie
  last_name: string; // -> nazwisko
  role: StaffRole; // -> rola
  email: string; // -> adres_email
  phone: string | null; // -> telefon
  created_at: Date; // -> data_utworzenia
  updated_at: Date; // -> data_aktualizacji
}

// Funkcja mapująca nowe dane na stary format dla kompatybilności
export function mapToLegacyFormat(staffData: AuthPracownicy): LoginTableStaff {
  return {
    id_staff: staffData.id_pracownika,
    first_name: staffData.imie,
    last_name: staffData.nazwisko,
    role: staffData.rola,
    email: staffData.adres_email,
    phone: staffData.telefon,
    created_at: staffData.data_utworzenia,
    updated_at: staffData.data_aktualizacji,
  };
}

// Funkcja mapująca stary format na nowe dane
export function mapFromLegacyFormat(
  legacyData: Partial<LoginTableStaff>,
): Partial<AuthPracownicy> {
  return {
    id_pracownika: legacyData.id_staff,
    imie: legacyData.first_name,
    nazwisko: legacyData.last_name,
    rola: legacyData.role,
    adres_email: legacyData.email,
    telefon: legacyData.phone,
    data_utworzenia: legacyData.created_at,
    data_aktualizacji: legacyData.updated_at,
  };
}
