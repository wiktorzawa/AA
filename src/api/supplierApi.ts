import axiosInstance from "./axios";

// Interfejs dla modelu danych dostawcy bazujący na nowych modelach Sequelize
export interface Dostawca {
  id_dostawcy: string;
  nazwa_firmy: string;
  imie_kontaktu: string;
  nazwisko_kontaktu: string;
  numer_nip: string;
  adres_email: string;
  telefon: string;
  strona_www?: string | null;
  adres_ulica: string;
  adres_numer_budynku: string;
  adres_numer_lokalu?: string | null;
  adres_miasto: string;
  adres_kod_pocztowy: string;
  adres_kraj: string;
  data_utworzenia: string;
  data_aktualizacji: string;
}

// Typ dla nowego dostawcy (bez dat)
export type NowyDostawca = Omit<
  Dostawca,
  "data_utworzenia" | "data_aktualizacji"
>;

// Typ dla aktualizacji dostawcy (częściowe dane, bez ID i dat)
export type AktualizacjaDostawcy = Partial<
  Omit<Dostawca, "id_dostawcy" | "data_utworzenia" | "data_aktualizacji">
>;

// Typ dla nowego dostawcy bez ID (generowane automatycznie)
export type NowyDostawcaBezId = Omit<NowyDostawca, "id_dostawcy">;

// Interfejs dla odpowiedzi z hasłem
export interface DostawcaZHaslem {
  supplier: Dostawca;
  password: string;
}

/**
 * Pobiera wszystkich dostawców
 * @returns Lista dostawców
 */
export const pobierzDostawcow = async (): Promise<Dostawca[]> => {
  try {
    const response = await axiosInstance.get("/suppliers");
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Błąd podczas pobierania dostawców:", error);
    return [];
  }
};

/**
 * Pobiera dostawcę po ID
 * @param id Identyfikator dostawcy
 * @returns Dane dostawcy lub null w przypadku błędu
 */
export const pobierzDostawce = async (id: string): Promise<Dostawca | null> => {
  try {
    const response = await axiosInstance.get(
      `/suppliers/${encodeURIComponent(id)}`,
    );
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Błąd podczas pobierania dostawcy o ID ${id}:`, error);
    return null;
  }
};

/**
 * Pobiera dostawcę po NIP
 * @param nip Numer NIP
 * @returns Dane dostawcy lub null w przypadku błędu
 */
export const pobierzDostawcePoNip = async (
  nip: string,
): Promise<Dostawca | null> => {
  try {
    const response = await axiosInstance.get(`/suppliers/nip/${nip}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Błąd podczas pobierania dostawcy o NIP ${nip}:`, error);
    return null;
  }
};

/**
 * Sprawdza dostępność NIP
 * @param nip Numer NIP do sprawdzenia
 * @returns Informacja o dostępności NIP
 */
export const sprawdzDostepnoscNip = async (
  nip: string,
): Promise<{ available: boolean; message: string }> => {
  try {
    const response = await axiosInstance.get(`/suppliers/check-nip/${nip}`);
    return response.data;
  } catch (error) {
    console.error("Błąd podczas sprawdzania dostępności NIP:", error);
    return { available: false, message: "Błąd podczas sprawdzania NIP" };
  }
};

/**
 * Sprawdza dostępność email
 * @param email Adres email do sprawdzenia
 * @returns Informacja o dostępności email
 */
export const sprawdzDostepnoscEmail = async (
  email: string,
): Promise<{ available: boolean; message: string }> => {
  try {
    const response = await axiosInstance.get(
      `/suppliers/check-email/${encodeURIComponent(email)}`,
    );
    return response.data;
  } catch (error) {
    console.error("Błąd podczas sprawdzania dostępności email:", error);
    return { available: false, message: "Błąd podczas sprawdzania email" };
  }
};

/**
 * Dodaje nowego dostawcę z automatycznie wygenerowanym hasłem
 * @param dostawca Dane nowego dostawcy (bez ID)
 * @returns Dane utworzonego dostawcy wraz z wygenerowanym hasłem lub null w przypadku błędu
 */
export const dodajDostawceZHaslem = async (
  dostawca: NowyDostawcaBezId,
): Promise<DostawcaZHaslem | null> => {
  try {
    const response = await axiosInstance.post(
      "/suppliers/with-password",
      dostawca,
    );
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error("Błąd podczas dodawania dostawcy z hasłem:", error);
    return null;
  }
};

/**
 * Dodaje nowego dostawcę (bez konta logowania)
 * @param dostawca Dane nowego dostawcy
 * @returns Dane utworzonego dostawcy lub null w przypadku błędu
 */
export const dodajDostawce = async (
  dostawca: NowyDostawca,
): Promise<Dostawca | null> => {
  try {
    const response = await axiosInstance.post("/suppliers", dostawca);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error("Błąd podczas dodawania dostawcy:", error);
    return null;
  }
};

/**
 * Aktualizuje dane dostawcy
 * @param id Identyfikator dostawcy
 * @param dane Dane do aktualizacji
 * @returns Zaktualizowane dane dostawcy lub null w przypadku błędu
 */
export const aktualizujDostawce = async (
  id: string,
  dane: AktualizacjaDostawcy,
): Promise<Dostawca | null> => {
  try {
    const response = await axiosInstance.put(
      `/suppliers/${encodeURIComponent(id)}`,
      dane,
    );
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Błąd podczas aktualizacji dostawcy o ID ${id}:`, error);
    return null;
  }
};

/**
 * Usuwa dostawcę
 * @param id Identyfikator dostawcy
 * @returns True jeśli usunięto, false w przypadku błędu
 */
export const usunDostawce = async (id: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(
      `/suppliers/${encodeURIComponent(id)}`,
    );
    return response.data.success || false;
  } catch (error) {
    console.error(`Błąd podczas usuwania dostawcy o ID ${id}:`, error);
    return false;
  }
};
