import { LoginTableSuppliers } from "../models/login_table_suppliers.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
import { PoolConnection } from "mysql2/promise";

/**
 * Pobiera wszystkich dostawców
 * @param connection Aktywne połączenie z bazą danych
 * @returns Lista dostawców
 */
export const getAllSuppliers = async (
  connection: PoolConnection,
): Promise<LoginTableSuppliers[]> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM auth_dostawcy",
  );
  return rows.map((row) => ({
    id_supplier: row.id_dostawcy,
    company_name: row.nazwa_firmy,
    first_name: row.imie_kontaktu,
    last_name: row.nazwisko_kontaktu,
    nip: row.numer_nip,
    email: row.adres_email,
    phone: row.telefon,
    website: row.strona_www,
    address_street: row.adres_ulica,
    address_building: row.adres_numer_budynku,
    address_apartment: row.adres_numer_lokalu,
    address_city: row.adres_miasto,
    address_postal_code: row.adres_kod_pocztowy,
    address_country: row.adres_kraj,
    created_at: row.data_utworzenia,
    updated_at: row.data_aktualizacji,
  })) as LoginTableSuppliers[];
};

/**
 * Pobiera dostawcę po ID
 * @param supplierId Identyfikator dostawcy
 * @param connection Aktywne połączenie z bazą danych
 * @returns Dane dostawcy lub null
 */
export const getSupplierById = async (
  supplierId: string,
  connection: PoolConnection,
): Promise<LoginTableSuppliers | null> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM auth_dostawcy WHERE id_dostawcy = ?",
    [supplierId],
  );
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id_supplier: row.id_dostawcy,
    company_name: row.nazwa_firmy,
    first_name: row.imie_kontaktu,
    last_name: row.nazwisko_kontaktu,
    nip: row.numer_nip,
    email: row.adres_email,
    phone: row.telefon,
    website: row.strona_www,
    address_street: row.adres_ulica,
    address_building: row.adres_numer_budynku,
    address_apartment: row.adres_numer_lokalu,
    address_city: row.adres_miasto,
    address_postal_code: row.adres_kod_pocztowy,
    address_country: row.adres_kraj,
    created_at: row.data_utworzenia,
    updated_at: row.data_aktualizacji,
  } as LoginTableSuppliers;
};

/**
 * Pobiera dostawcę po adresie email
 * @param email Adres email
 * @param connection Aktywne połączenie z bazą danych
 * @returns Dane dostawcy lub null
 */
export const getSupplierByEmail = async (
  email: string,
  connection: PoolConnection,
): Promise<LoginTableSuppliers | null> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM auth_dostawcy WHERE adres_email = ?",
    [email],
  );
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id_supplier: row.id_dostawcy,
    company_name: row.nazwa_firmy,
    first_name: row.imie_kontaktu,
    last_name: row.nazwisko_kontaktu,
    nip: row.numer_nip,
    email: row.adres_email,
    phone: row.telefon,
    website: row.strona_www,
    address_street: row.adres_ulica,
    address_building: row.adres_numer_budynku,
    address_apartment: row.adres_numer_lokalu,
    address_city: row.adres_miasto,
    address_postal_code: row.adres_kod_pocztowy,
    address_country: row.adres_kraj,
    created_at: row.data_utworzenia,
    updated_at: row.data_aktualizacji,
  } as LoginTableSuppliers;
};

/**
 * Pobiera dostawcę po numerze NIP
 * @param nip Numer NIP
 * @param connection Aktywne połączenie z bazą danych
 * @returns Dane dostawcy lub null
 */
export const getSupplierByNip = async (
  nip: string,
  connection: PoolConnection,
): Promise<LoginTableSuppliers | null> => {
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT * FROM auth_dostawcy WHERE numer_nip = ?",
    [nip],
  );
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id_supplier: row.id_dostawcy,
    company_name: row.nazwa_firmy,
    first_name: row.imie_kontaktu,
    last_name: row.nazwisko_kontaktu,
    nip: row.numer_nip,
    email: row.adres_email,
    phone: row.telefon,
    website: row.strona_www,
    address_street: row.adres_ulica,
    address_building: row.adres_numer_budynku,
    address_apartment: row.adres_numer_lokalu,
    address_city: row.adres_miasto,
    address_postal_code: row.adres_kod_pocztowy,
    address_country: row.adres_kraj,
    created_at: row.data_utworzenia,
    updated_at: row.data_aktualizacji,
  } as LoginTableSuppliers;
};

/**
 * Generuje nowy identyfikator dostawcy
 * @param connection Aktywne połączenie z bazą danych
 * @returns Nowy identyfikator dostawcy
 */
export const generateSupplierId = async (
  connection: PoolConnection,
): Promise<string> => {
  const prefix = "SUP";
  const [rows] = await connection.query<RowDataPacket[]>(
    "SELECT id_dostawcy FROM auth_dostawcy WHERE id_dostawcy LIKE ?",
    [`${prefix}/%`],
  );

  const existingIds = rows.map((row) => row.id_dostawcy as string);
  let counter = 1;
  let newId = `${prefix}/${counter.toString().padStart(5, "0")}`;

  while (existingIds.includes(newId)) {
    counter++;
    newId = `${prefix}/${counter.toString().padStart(5, "0")}`;
  }

  return newId;
};

/**
 * Generuje nowy identyfikator logowania dla dostawcy
 * @param supplierId Identyfikator dostawcy
 * @returns Identyfikator logowania
 */
export const generateLoginId = (supplierId: string): string => {
  return `${supplierId}/LOG`;
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
 * Dodaje nowego dostawcę (bez tworzenia konta logowania)
 * @param supplierData Dane dostawcy
 * @param connection Aktywne połączenie z bazą danych
 * @returns Nowy dostawca
 */
export const addSupplier = async (
  supplierData: Omit<
    LoginTableSuppliers,
    "id_supplier" | "created_at" | "updated_at"
  >,
  connection: PoolConnection,
): Promise<LoginTableSuppliers> => {
  const supplierId = await generateSupplierId(connection);

  await connection.execute(
    `INSERT INTO auth_dostawcy (
      id_dostawcy, nazwa_firmy, imie_kontaktu, nazwisko_kontaktu, numer_nip, 
      adres_email, telefon, strona_www, adres_ulica, adres_numer_budynku, 
      adres_numer_lokalu, adres_miasto, adres_kod_pocztowy, adres_kraj
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      supplierId,
      supplierData.company_name,
      supplierData.first_name,
      supplierData.last_name,
      supplierData.nip,
      supplierData.email,
      supplierData.phone,
      supplierData.website,
      supplierData.address_street,
      supplierData.address_building,
      supplierData.address_apartment,
      supplierData.address_city,
      supplierData.address_postal_code,
      supplierData.address_country,
    ],
  );

  return {
    id_supplier: supplierId,
    company_name: supplierData.company_name,
    first_name: supplierData.first_name,
    last_name: supplierData.last_name,
    nip: supplierData.nip,
    email: supplierData.email,
    phone: supplierData.phone,
    website: supplierData.website,
    address_street: supplierData.address_street,
    address_building: supplierData.address_building,
    address_apartment: supplierData.address_apartment,
    address_city: supplierData.address_city,
    address_postal_code: supplierData.address_postal_code,
    address_country: supplierData.address_country,
    created_at: new Date(),
    updated_at: new Date(),
  };
};

/**
 * Tworzy nowego dostawcę w systemie
 * @param supplierData Dane dostawcy
 * @param connection Aktywne połączenie z bazą danych
 * @returns Obiekt z danymi dostawcy i hasłem
 */
export const createSupplier = async (
  supplierData: Omit<
    LoginTableSuppliers,
    "id_supplier" | "created_at" | "updated_at"
  >,
  connection: PoolConnection,
): Promise<{ supplier: LoginTableSuppliers; password: string }> => {
  const supplierId = await generateSupplierId(connection);
  const loginId = generateLoginId(supplierId);
  const password = generatePassword();
  const hashedPassword = await hashPassword(password);

  // Wstawienie do tabeli auth_dostawcy (polskie nazwy kolumn)
  await connection.execute(
    `INSERT INTO auth_dostawcy (
      id_dostawcy, nazwa_firmy, imie_kontaktu, nazwisko_kontaktu, numer_nip, 
      adres_email, telefon, strona_www, adres_ulica, adres_numer_budynku, 
      adres_numer_lokalu, adres_miasto, adres_kod_pocztowy, adres_kraj
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      supplierId,
      supplierData.company_name,
      supplierData.first_name,
      supplierData.last_name,
      supplierData.nip,
      supplierData.email,
      supplierData.phone,
      supplierData.website,
      supplierData.address_street,
      supplierData.address_building,
      supplierData.address_apartment,
      supplierData.address_city,
      supplierData.address_postal_code,
      supplierData.address_country,
    ],
  );

  // Wstawienie do tabeli auth_dane_autoryzacji (polskie nazwy kolumn)
  await connection.execute(
    "INSERT INTO auth_dane_autoryzacji (id_logowania, id_powiazany, adres_email, hash_hasla, rola_uzytkownika, nieudane_proby_logowania) VALUES (?, ?, ?, ?, ?, ?)",
    [loginId, supplierId, supplierData.email, hashedPassword, "supplier", 0],
  );

  const supplier: LoginTableSuppliers = {
    id_supplier: supplierId,
    company_name: supplierData.company_name,
    first_name: supplierData.first_name,
    last_name: supplierData.last_name,
    nip: supplierData.nip,
    email: supplierData.email,
    phone: supplierData.phone,
    website: supplierData.website,
    address_street: supplierData.address_street,
    address_building: supplierData.address_building,
    address_apartment: supplierData.address_apartment,
    address_city: supplierData.address_city,
    address_postal_code: supplierData.address_postal_code,
    address_country: supplierData.address_country,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return { supplier, password };
};

/**
 * Aktualizuje dane dostawcy
 * @param supplierId Identyfikator dostawcy
 * @param updates Dane do aktualizacji
 * @param connection Aktywne połączenie z bazą danych
 * @returns True, jeśli aktualizacja się powiodła
 */
export const updateSupplier = async (
  supplierId: string,
  updates: Partial<
    Omit<LoginTableSuppliers, "id_supplier" | "created_at" | "updated_at">
  >,
  connection: PoolConnection,
): Promise<boolean> => {
  const updateFields: string[] = [];
  const updateValues: any[] = [];

  // Mapowanie starych nazw na nowe nazwy kolumn
  if (updates.company_name !== undefined) {
    updateFields.push("nazwa_firmy = ?");
    updateValues.push(updates.company_name);
  }
  if (updates.first_name !== undefined) {
    updateFields.push("imie_kontaktu = ?");
    updateValues.push(updates.first_name);
  }
  if (updates.last_name !== undefined) {
    updateFields.push("nazwisko_kontaktu = ?");
    updateValues.push(updates.last_name);
  }
  if (updates.nip !== undefined) {
    updateFields.push("numer_nip = ?");
    updateValues.push(updates.nip);
  }
  if (updates.email !== undefined) {
    updateFields.push("adres_email = ?");
    updateValues.push(updates.email);
  }
  if (updates.phone !== undefined) {
    updateFields.push("telefon = ?");
    updateValues.push(updates.phone);
  }
  if (updates.website !== undefined) {
    updateFields.push("strona_www = ?");
    updateValues.push(updates.website);
  }
  if (updates.address_street !== undefined) {
    updateFields.push("adres_ulica = ?");
    updateValues.push(updates.address_street);
  }
  if (updates.address_building !== undefined) {
    updateFields.push("adres_numer_budynku = ?");
    updateValues.push(updates.address_building);
  }
  if (updates.address_apartment !== undefined) {
    updateFields.push("adres_numer_lokalu = ?");
    updateValues.push(updates.address_apartment);
  }
  if (updates.address_city !== undefined) {
    updateFields.push("adres_miasto = ?");
    updateValues.push(updates.address_city);
  }
  if (updates.address_postal_code !== undefined) {
    updateFields.push("adres_kod_pocztowy = ?");
    updateValues.push(updates.address_postal_code);
  }
  if (updates.address_country !== undefined) {
    updateFields.push("adres_kraj = ?");
    updateValues.push(updates.address_country);
  }

  if (updateFields.length === 0) return false;

  // Dodanie data_aktualizacji
  updateFields.push("data_aktualizacji = CURRENT_TIMESTAMP");
  updateValues.push(supplierId);

  const [result] = await connection.execute<ResultSetHeader>(
    `UPDATE auth_dostawcy SET ${updateFields.join(", ")} WHERE id_dostawcy = ?`,
    updateValues,
  );

  return result.affectedRows > 0;
};

/**
 * Usuwa dostawcę
 * @param supplierId Identyfikator dostawcy
 * @param connection Aktywne połączenie z bazą danych
 * @returns True, jeśli usunięcie się powiodło
 */
export const deleteSupplier = async (
  supplierId: string,
  connection: PoolConnection,
): Promise<boolean> => {
  const loginId = generateLoginId(supplierId);

  // Usuń z tabeli auth_dane_autoryzacji
  await connection.execute(
    "DELETE FROM auth_dane_autoryzacji WHERE id_logowania = ? OR id_powiazany = ?",
    [loginId, supplierId],
  );

  // Usuń z tabeli auth_dostawcy
  const [result] = await connection.execute<ResultSetHeader>(
    "DELETE FROM auth_dostawcy WHERE id_dostawcy = ?",
    [supplierId],
  );

  return result.affectedRows > 0;
};
