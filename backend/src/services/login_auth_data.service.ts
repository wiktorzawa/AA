import { LoginAuthData } from "../models/login_auth_data.model";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import { PoolConnection } from "mysql2/promise";

/**
 * Pobiera dane uwierzytelniania użytkownika na podstawie adresu email
 * @param email Adres email użytkownika
 * @param connection Aktywne połączenie z bazą danych
 * @returns Dane uwierzytelniania lub null, jeśli nie znaleziono
 */
export const getAuthDataByEmail = async (
  email: string,
  connection: PoolConnection,
): Promise<LoginAuthData | null> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM login_auth_data WHERE email = ?",
    [email],
  );
  return rows.length > 0 ? (rows[0] as LoginAuthData) : null;
};

/**
 * Pobiera dane uwierzytelniania użytkownika na podstawie identyfikatora logowania
 * @param id_login Identyfikator logowania
 * @param connection Aktywne połączenie z bazą danych
 * @returns Dane uwierzytelniania lub null, jeśli nie znaleziono
 */
export const getAuthDataById = async (
  id_login: string,
  connection: PoolConnection,
): Promise<LoginAuthData | null> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM login_auth_data WHERE id_login = ?",
    [id_login],
  );
  return rows.length > 0 ? (rows[0] as LoginAuthData) : null;
};

/**
 * Aktualizuje datę ostatniego logowania użytkownika
 * @param id_login Identyfikator logowania
 * @param connection Aktywne połączenie z bazą danych
 */
export const updateLastLogin = async (
  id_login: string,
  connection: PoolConnection,
): Promise<void> => {
  await connection.execute(
    "UPDATE login_auth_data SET last_login = CURRENT_TIMESTAMP WHERE id_login = ?",
    [id_login],
  );
};

/**
 * Zwiększa licznik nieudanych prób logowania
 * @param id_login Identyfikator logowania
 * @param connection Aktywne połączenie z bazą danych
 * @returns Zaktualizowaną liczbę nieudanych prób logowania
 */
export const incrementFailedLoginAttempts = async (
  id_login: string,
  connection: PoolConnection,
): Promise<number> => {
  await connection.execute(
    "UPDATE login_auth_data SET failed_login_attempts = failed_login_attempts + 1 WHERE id_login = ?",
    [id_login],
  );

  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT failed_login_attempts FROM login_auth_data WHERE id_login = ?",
    [id_login],
  );

  return rows.length > 0 ? (rows[0].failed_login_attempts as number) : 0;
};

/**
 * Resetuje licznik nieudanych prób logowania
 * @param id_login Identyfikator logowania
 * @param connection Aktywne połączenie z bazą danych
 */
export const resetFailedLoginAttempts = async (
  id_login: string,
  connection: PoolConnection,
): Promise<void> => {
  await connection.execute(
    "UPDATE login_auth_data SET failed_login_attempts = 0, locked_until = NULL WHERE id_login = ?",
    [id_login],
  );
};

/**
 * Ustawia blokadę konta do określonego czasu
 * @param id_login Identyfikator logowania
 * @param minutes Liczba minut blokady
 * @param connection Aktywne połączenie z bazą danych
 */
export const lockAccount = async (
  id_login: string,
  minutes: number,
  connection: PoolConnection,
): Promise<void> => {
  await connection.execute(
    "UPDATE login_auth_data SET locked_until = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MINUTE) WHERE id_login = ?",
    [minutes, id_login],
  );
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
