import {
  AuthDaneAutoryzacji,
  LoginAuthData,
} from "../models/login_auth_data.model";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import { PoolConnection } from "mysql2/promise";

/**
 * Pobiera dane uwierzytelniania użytkownika na podstawie adresu email
 * Tabela: auth_dane_autoryzacji (polskie nazwy kolumn)
 * @param email Adres email użytkownika
 * @param connection Aktywne połączenie z bazą danych
 * @returns Dane uwierzytelniania lub null, jeśli nie znaleziono
 */
export const getAuthDataByEmail = async (
  email: string,
  connection: PoolConnection,
): Promise<AuthDaneAutoryzacji | null> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM auth_dane_autoryzacji WHERE adres_email = ?",
    [email],
  );
  return rows.length > 0 ? (rows[0] as AuthDaneAutoryzacji) : null;
};

/**
 * Pobiera dane uwierzytelniania użytkownika na podstawie identyfikatora logowania
 * Tabela: auth_dane_autoryzacji (polskie nazwy kolumn)
 * @param id_logowania Identyfikator logowania
 * @param connection Aktywne połączenie z bazą danych
 * @returns Dane uwierzytelniania lub null, jeśli nie znaleziono
 */
export const getAuthDataById = async (
  id_logowania: string,
  connection: PoolConnection,
): Promise<AuthDaneAutoryzacji | null> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM auth_dane_autoryzacji WHERE id_logowania = ?",
    [id_logowania],
  );
  return rows.length > 0 ? (rows[0] as AuthDaneAutoryzacji) : null;
};

/**
 * Aktualizuje datę ostatniego logowania użytkownika
 * Tabela: auth_dane_autoryzacji (polskie nazwy kolumn)
 * @param id_logowania Identyfikator logowania
 * @param connection Aktywne połączenie z bazą danych
 */
export const updateLastLogin = async (
  id_logowania: string,
  connection: PoolConnection,
): Promise<void> => {
  await connection.execute(
    "UPDATE auth_dane_autoryzacji SET ostatnie_logowanie = CURRENT_TIMESTAMP WHERE id_logowania = ?",
    [id_logowania],
  );
};

/**
 * Zwiększa licznik nieudanych prób logowania
 * Tabela: auth_dane_autoryzacji (polskie nazwy kolumn)
 * @param id_logowania Identyfikator logowania
 * @param connection Aktywne połączenie z bazą danych
 * @returns Zaktualizowaną liczbę nieudanych prób logowania
 */
export const incrementFailedLoginAttempts = async (
  id_logowania: string,
  connection: PoolConnection,
): Promise<number> => {
  await connection.execute(
    "UPDATE auth_dane_autoryzacji SET nieudane_proby_logowania = nieudane_proby_logowania + 1 WHERE id_logowania = ?",
    [id_logowania],
  );

  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT nieudane_proby_logowania FROM auth_dane_autoryzacji WHERE id_logowania = ?",
    [id_logowania],
  );

  return rows.length > 0 ? (rows[0].nieudane_proby_logowania as number) : 0;
};

/**
 * Resetuje licznik nieudanych prób logowania
 * Tabela: auth_dane_autoryzacji (polskie nazwy kolumn)
 * @param id_logowania Identyfikator logowania
 * @param connection Aktywne połączenie z bazą danych
 */
export const resetFailedLoginAttempts = async (
  id_logowania: string,
  connection: PoolConnection,
): Promise<void> => {
  await connection.execute(
    "UPDATE auth_dane_autoryzacji SET nieudane_proby_logowania = 0 WHERE id_logowania = ?",
    [id_logowania],
  );
};

/**
 * Zapisuje wpis w historii logowań
 * Tabela: auth_historia_logowan (TERAZ polskie nazwy kolumn!)
 * @param id_logowania Identyfikator logowania
 * @param status Status logowania ('success' lub 'failed')
 * @param connection Aktywne połączenie z bazą danych
 */
export const logLoginAttempt = async (
  id_logowania: string,
  status: "success" | "failed",
  connection: PoolConnection,
): Promise<void> => {
  await connection.execute(
    "INSERT INTO auth_historia_logowan (id_logowania, data_proby_logowania, status_logowania) VALUES (?, CURRENT_TIMESTAMP, ?)",
    [id_logowania, status],
  );
};

/**
 * Ustawia blokadę konta - UWAGA: Kolumna locked_until została usunięta z bazy
 * Ta funkcja jest zachowana dla kompatybilności, ale nie wykonuje żadnych operacji
 * @deprecated Funkcjonalność blokady konta została przeniesiona do logiki aplikacji
 */
export const lockAccount = async (
  id_logowania: string,
  minutes: number,
  connection: PoolConnection,
): Promise<void> => {
  console.warn(
    "lockAccount: Funkcja przestarzała - kolumna locked_until została usunięta z bazy",
  );
  // Nie wykonujemy żadnych operacji, ponieważ kolumna nie istnieje
};

/**
 * Weryfikuje hasło użytkownika
 * @param plainPassword Hasło w postaci jawnej
 * @param hashedPassword Zahaszowane hasło z bazy danych
 * @returns True, jeśli hasło jest poprawne, w przeciwnym razie false
 */
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Funkcja pomocnicza do mapowania starych nazw kolumn na nowe dla kompatybilności wstecznej
 * @param authData Dane z nowej struktury
 * @returns Dane w starym formacie dla kompatybilności
 */
export const mapToLegacyFormat = (
  authData: AuthDaneAutoryzacji,
): LoginAuthData => {
  return {
    ...authData,
    id_login: authData.id_logowania,
    related_id: authData.id_powiazany,
    email: authData.adres_email,
    password_hash: authData.hash_hasla,
    role: authData.rola_uzytkownika,
    failed_login_attempts: authData.nieudane_proby_logowania,
    locked_until: null, // Zawsze null, ponieważ kolumna została usunięta
    last_login: authData.ostatnie_logowanie,
    created_at: authData.data_utworzenia,
    updated_at: authData.data_aktualizacji,
  };
};
