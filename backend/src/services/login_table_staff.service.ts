import { LoginTableStaff } from "../models/login_table_staff.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
import { PoolConnection } from "mysql2/promise";

/**
 * Generuje nowy identyfikator pracownika
 * @param role Rola pracownika ('admin' lub 'staff')
 * @param connection Aktywne połączenie z bazą danych
 * @returns Nowy identyfikator pracownika
 */
export const generateStaffId = async (
  role: "admin" | "staff",
  connection: PoolConnection,
): Promise<string> => {
  const prefix = role === "admin" ? "ADM" : "STF";
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT id_pracownika FROM auth_pracownicy WHERE id_pracownika LIKE ?",
    [`${prefix}/%`],
  );

  const existingIds = rows.map((row) => row.id_pracownika as string);
  let counter = 1;
  let newId = `${prefix}/${counter.toString().padStart(5, "0")}`;

  while (existingIds.includes(newId)) {
    counter++;
    newId = `${prefix}/${counter.toString().padStart(5, "0")}`;
  }

  return newId;
};

/**
 * Generuje nowy identyfikator logowania dla pracownika
 * @param staffId Identyfikator pracownika
 * @returns Identyfikator logowania
 */
export const generateLoginId = (staffId: string): string => {
  return `${staffId}/LOG`;
};

/**
 * Generuje losowe hasło
 * @param length Długość hasła (domyślnie 12)
 * @returns Losowe hasło
 */
export const generatePassword = (length: number = 12): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

/**
 * Hashuje hasło
 * @param password Hasło w postaci jawnej
 * @returns Zahashowane hasło
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Tworzy nowego pracownika w systemie
 * @param staffData Dane pracownika
 * @param connection Aktywne połączenie z bazą danych
 * @returns Obiekt z danymi pracownika i hasłem
 */
export const createStaff = async (
  staffData: Omit<LoginTableStaff, "id_staff" | "created_at" | "updated_at">,
  connection: PoolConnection,
): Promise<{ staff: LoginTableStaff; password: string }> => {
  const staffId = await generateStaffId(staffData.role, connection);
  const loginId = generateLoginId(staffId);
  const password = generatePassword();
  const hashedPassword = await hashPassword(password);

  // Wstawienie do tabeli auth_pracownicy (polskie nazwy kolumn)
  await connection.execute(
    "INSERT INTO auth_pracownicy (id_pracownika, imie, nazwisko, rola, adres_email, telefon) VALUES (?, ?, ?, ?, ?, ?)",
    [
      staffId,
      staffData.first_name,
      staffData.last_name,
      staffData.role,
      staffData.email,
      staffData.phone,
    ],
  );

  // Wstawienie do tabeli auth_dane_autoryzacji (polskie nazwy kolumn)
  await connection.execute(
    "INSERT INTO auth_dane_autoryzacji (id_logowania, id_powiazany, adres_email, hash_hasla, rola_uzytkownika, nieudane_proby_logowania) VALUES (?, ?, ?, ?, ?, ?)",
    [loginId, staffId, staffData.email, hashedPassword, staffData.role, 0],
  );

  const staff: LoginTableStaff = {
    id_staff: staffId,
    first_name: staffData.first_name,
    last_name: staffData.last_name,
    role: staffData.role,
    email: staffData.email,
    phone: staffData.phone,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return { staff, password };
};

/**
 * Pobiera wszystkich pracowników
 * @param connection Aktywne połączenie z bazą danych
 * @returns Lista pracowników
 */
export const getAllStaff = async (
  connection: PoolConnection,
): Promise<LoginTableStaff[]> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM auth_pracownicy",
  );
  return rows.map((row) => ({
    id_staff: row.id_pracownika,
    first_name: row.imie,
    last_name: row.nazwisko,
    role: row.rola,
    email: row.adres_email,
    phone: row.telefon,
    created_at: row.data_utworzenia,
    updated_at: row.data_aktualizacji,
  })) as LoginTableStaff[];
};

/**
 * Pobiera pracownika po ID
 * @param staffId Identyfikator pracownika
 * @param connection Aktywne połączenie z bazą danych
 * @returns Dane pracownika lub null
 */
export const getStaffById = async (
  staffId: string,
  connection: PoolConnection,
): Promise<LoginTableStaff | null> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM auth_pracownicy WHERE id_pracownika = ?",
    [staffId],
  );
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id_staff: row.id_pracownika,
    first_name: row.imie,
    last_name: row.nazwisko,
    role: row.rola,
    email: row.adres_email,
    phone: row.telefon,
    created_at: row.data_utworzenia,
    updated_at: row.data_aktualizacji,
  } as LoginTableStaff;
};

/**
 * Pobiera pracownika po adresie email
 * @param email Adres email
 * @param connection Aktywne połączenie z bazą danych
 * @returns Dane pracownika lub null
 */
export const getStaffByEmail = async (
  email: string,
  connection: PoolConnection,
): Promise<LoginTableStaff | null> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM auth_pracownicy WHERE adres_email = ?",
    [email],
  );
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id_staff: row.id_pracownika,
    first_name: row.imie,
    last_name: row.nazwisko,
    role: row.rola,
    email: row.adres_email,
    phone: row.telefon,
    created_at: row.data_utworzenia,
    updated_at: row.data_aktualizacji,
  } as LoginTableStaff;
};

/**
 * Dodaje nowego pracownika (bez tworzenia konta logowania)
 * @param staffData Dane pracownika
 * @param connection Aktywne połączenie z bazą danych
 * @returns Nowy pracownik
 */
export const addStaff = async (
  staffData: Omit<LoginTableStaff, "id_staff" | "created_at" | "updated_at">,
  connection: PoolConnection,
): Promise<LoginTableStaff> => {
  const staffId = await generateStaffId(staffData.role, connection);

  await connection.execute(
    "INSERT INTO auth_pracownicy (id_pracownika, imie, nazwisko, rola, adres_email, telefon) VALUES (?, ?, ?, ?, ?, ?)",
    [
      staffId,
      staffData.first_name,
      staffData.last_name,
      staffData.role,
      staffData.email,
      staffData.phone,
    ],
  );

  return {
    id_staff: staffId,
    first_name: staffData.first_name,
    last_name: staffData.last_name,
    role: staffData.role,
    email: staffData.email,
    phone: staffData.phone,
    created_at: new Date(),
    updated_at: new Date(),
  };
};

/**
 * Aktualizuje dane pracownika
 * @param staffId Identyfikator pracownika
 * @param updates Dane do aktualizacji
 * @param connection Aktywne połączenie z bazą danych
 * @returns True, jeśli aktualizacja się powiodła
 */
export const updateStaff = async (
  staffId: string,
  updates: Partial<
    Omit<LoginTableStaff, "id_staff" | "created_at" | "updated_at">
  >,
  connection: PoolConnection,
): Promise<boolean> => {
  const updateFields: string[] = [];
  const updateValues: any[] = [];

  // Mapowanie starych nazw na nowe nazwy kolumn
  if (updates.first_name !== undefined) {
    updateFields.push("imie = ?");
    updateValues.push(updates.first_name);
  }
  if (updates.last_name !== undefined) {
    updateFields.push("nazwisko = ?");
    updateValues.push(updates.last_name);
  }
  if (updates.role !== undefined) {
    updateFields.push("rola = ?");
    updateValues.push(updates.role);
  }
  if (updates.email !== undefined) {
    updateFields.push("adres_email = ?");
    updateValues.push(updates.email);
  }
  if (updates.phone !== undefined) {
    updateFields.push("telefon = ?");
    updateValues.push(updates.phone);
  }

  if (updateFields.length === 0) return false;

  // Dodanie data_aktualizacji
  updateFields.push("data_aktualizacji = CURRENT_TIMESTAMP");
  updateValues.push(staffId);

  const [result] = await connection.execute<ResultSetHeader>(
    `UPDATE auth_pracownicy SET ${updateFields.join(", ")} WHERE id_pracownika = ?`,
    updateValues,
  );

  return result.affectedRows > 0;
};

/**
 * Usuwa pracownika
 * @param staffId Identyfikator pracownika
 * @param connection Aktywne połączenie z bazą danych
 * @returns True, jeśli usunięcie się powiodło
 */
export const deleteStaff = async (
  staffId: string,
  connection: PoolConnection,
): Promise<boolean> => {
  const loginId = generateLoginId(staffId);

  // Usuń z tabeli auth_dane_autoryzacji
  await connection.execute(
    "DELETE FROM auth_dane_autoryzacji WHERE id_logowania = ? OR id_powiazany = ?",
    [loginId, staffId],
  );

  // Usuń z tabeli auth_pracownicy
  const [result] = await connection.execute<ResultSetHeader>(
    "DELETE FROM auth_pracownicy WHERE id_pracownika = ?",
    [staffId],
  );

  return result.affectedRows > 0;
};
