/**
 * Model danych dla tabeli auth_dane_autoryzacji
 * Tabela zawierająca podstawowe dane do logowania i autoryzacji użytkowników
 * Wszystkie nazwy kolumn w polskim nazewnictwie
 */

export type UserRole = "admin" | "staff" | "supplier";

// Główny interfejs dla nowej struktury bazy danych
export interface AuthDaneAutoryzacji {
  id_logowania: string; // Identyfikator logowania (np. ADM/00001/LOG)
  id_powiazany: string; // Powiązany identyfikator użytkownika (ADM/00001, STF/00001, SUP/00001)
  adres_email: string; // Adres email
  hash_hasla: string; // Zahaszowane hasło
  rola_uzytkownika: UserRole; // Rola użytkownika (admin, staff, supplier)
  nieudane_proby_logowania: number; // Liczba nieudanych prób logowania
  ostatnie_logowanie: Date | null; // Ostatnie logowanie
  data_utworzenia: Date; // Data utworzenia
  data_aktualizacji: Date; // Data aktualizacji
}

// Zachowujemy stary interfejs dla kompatybilności wstecznej
export interface LoginAuthData {
  // Mapowanie starych nazw na nowe dla kompatybilności
  id_login: string; // -> id_logowania
  related_id: string; // -> id_powiazany
  email: string; // -> adres_email
  password_hash: string; // -> hash_hasla
  role: UserRole; // -> rola_uzytkownika
  failed_login_attempts: number; // -> nieudane_proby_logowania
  locked_until?: Date | null; // Usunięte z bazy danych
  last_login: Date | null; // -> ostatnie_logowanie
  created_at: Date; // -> data_utworzenia
  updated_at: Date; // -> data_aktualizacji
}

// Funkcja mapująca nowe dane na stary format dla kompatybilności
export function mapToLegacyFormat(
  authData: AuthDaneAutoryzacji,
): LoginAuthData {
  return {
    id_login: authData.id_logowania,
    related_id: authData.id_powiazany,
    email: authData.adres_email,
    password_hash: authData.hash_hasla,
    role: authData.rola_uzytkownika,
    failed_login_attempts: authData.nieudane_proby_logowania,
    locked_until: null, // Pole usunięte z bazy
    last_login: authData.ostatnie_logowanie,
    created_at: authData.data_utworzenia,
    updated_at: authData.data_aktualizacji,
  };
}

// Funkcja mapująca stary format na nowe dane
export function mapFromLegacyFormat(
  legacyData: Partial<LoginAuthData>,
): Partial<AuthDaneAutoryzacji> {
  return {
    id_logowania: legacyData.id_login,
    id_powiazany: legacyData.related_id,
    adres_email: legacyData.email,
    hash_hasla: legacyData.password_hash,
    rola_uzytkownika: legacyData.role,
    nieudane_proby_logowania: legacyData.failed_login_attempts,
    ostatnie_logowanie: legacyData.last_login,
    data_utworzenia: legacyData.created_at,
    data_aktualizacji: legacyData.updated_at,
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  userRole?: UserRole;
  userId?: string;
  error?: string;
}
