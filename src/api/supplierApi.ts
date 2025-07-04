import axiosInstance from "./axios";
import { logger } from "../utils/logger";

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
 * @throws Error gdy nie można pobrać danych
 */
export const pobierzDostawcow = async (): Promise<Dostawca[]> => {
  try {
    const response = await axiosInstance.get("/suppliers");
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch suppliers");
    }
    return response.data.data || [];
  } catch (error) {
    logger.error("Failed to get suppliers", { error });
    throw error;
  }
};

/**
 * Pobiera dostawcę po ID
 * @param id Identyfikator dostawcy
 * @returns Dane dostawcy
 * @throws Error gdy nie można pobrać danych lub dostawca nie istnieje
 */
export const pobierzDostawce = async (id: string): Promise<Dostawca> => {
  try {
    const response = await axiosInstance.get(
      `/suppliers/${encodeURIComponent(id)}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Supplier not found");
    }
    if (!response.data.data) {
      throw new Error(`Supplier with ID ${id} not found`);
    }
    return response.data.data;
  } catch (error) {
    logger.error("Failed to get supplier", { id, error });
    throw error;
  }
};

/**
 * Pobiera dostawcę po NIP
 * @param nip Numer NIP
 * @returns Dane dostawcy
 * @throws Error gdy nie można pobrać danych lub dostawca nie istnieje
 */
export const pobierzDostawcePoNip = async (nip: string): Promise<Dostawca> => {
  try {
    const response = await axiosInstance.get(`/suppliers/nip/${nip}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Supplier not found");
    }
    if (!response.data.data) {
      throw new Error(`Supplier with NIP ${nip} not found`);
    }
    return response.data.data;
  } catch (error) {
    logger.error("Failed to get supplier by NIP", { nip, error });
    throw error;
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
    logger.error("Failed to check NIP availability", { nip, error });
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
    logger.error("Failed to check email availability", { email, error });
    return { available: false, message: "Błąd podczas sprawdzania email" };
  }
};

/**
 * Dodaje nowego dostawcę z automatycznie wygenerowanym hasłem
 * @param dostawca Dane nowego dostawcy (bez ID)
 * @returns Dane utworzonego dostawcy wraz z wygenerowanym hasłem
 * @throws Error gdy nie można utworzyć dostawcy
 */
export const dodajDostawceZHaslem = async (
  dostawca: NowyDostawcaBezId,
): Promise<DostawcaZHaslem> => {
  try {
    const response = await axiosInstance.post(
      "/suppliers/with-password",
      dostawca,
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create supplier");
    }
    if (!response.data.data) {
      throw new Error("No data returned from server");
    }
    return response.data.data;
  } catch (error) {
    logger.error("Failed to add supplier with password", { error });
    throw error;
  }
};

/**
 * Dodaje nowego dostawcę (bez konta logowania)
 * @param dostawca Dane nowego dostawcy
 * @returns Dane utworzonego dostawcy
 * @throws Error gdy nie można utworzyć dostawcy
 */
export const dodajDostawce = async (
  dostawca: NowyDostawca,
): Promise<Dostawca> => {
  try {
    const response = await axiosInstance.post("/suppliers", dostawca);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create supplier");
    }
    if (!response.data.data) {
      throw new Error("No data returned from server");
    }
    return response.data.data;
  } catch (error) {
    logger.error("Failed to add supplier", { error });
    throw error;
  }
};

/**
 * Aktualizuje dane dostawcy
 * @param id Identyfikator dostawcy
 * @param dane Dane do aktualizacji
 * @returns Zaktualizowane dane dostawcy
 * @throws Error gdy nie można zaktualizować danych
 */
export const aktualizujDostawce = async (
  id: string,
  dane: AktualizacjaDostawcy,
): Promise<Dostawca> => {
  try {
    const response = await axiosInstance.put(
      `/suppliers/${encodeURIComponent(id)}`,
      dane,
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update supplier");
    }
    if (!response.data.data) {
      throw new Error("No data returned from server");
    }
    return response.data.data;
  } catch (error) {
    logger.error("Failed to update supplier", { id, error });
    throw error;
  }
};

/**
 * Usuwa dostawcę
 * @param id Identyfikator dostawcy
 * @returns Informacja o pomyślnym usunięciu
 * @throws Error gdy nie można usunąć dostawcy
 */
export const usunDostawce = async (id: string): Promise<{ success: true }> => {
  try {
    const response = await axiosInstance.delete(
      `/suppliers/${encodeURIComponent(id)}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete supplier");
    }
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete supplier", { id, error });
    throw error;
  }
};
