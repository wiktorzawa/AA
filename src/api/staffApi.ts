import axiosInstance from "./axios";
import { logger } from "../utils/logger";

// Interfejs dla modelu danych pracownika bazujący na nowych modelach Sequelize
export interface Pracownik {
  id_pracownika: string;
  imie: string;
  nazwisko: string;
  rola: "admin" | "staff";
  adres_email: string;
  telefon?: string | null;
  data_utworzenia: string;
  data_aktualizacji: string;
}

// Typ dla nowego pracownika (bez dat)
export type NowyPracownik = Omit<
  Pracownik,
  "data_utworzenia" | "data_aktualizacji"
>;

// Typ dla aktualizacji pracownika (częściowe dane, bez ID i dat)
export type AktualizacjaPracownika = Partial<
  Omit<Pracownik, "id_pracownika" | "data_utworzenia" | "data_aktualizacji">
>;

// Typ dla nowego pracownika bez ID (generowane automatycznie)
export type NowyPracownikBezId = Omit<NowyPracownik, "id_pracownika">;

// Interfejs dla odpowiedzi z hasłem
export interface PracownikZHaslem {
  staff: Pracownik;
  password: string;
}

/**
 * Pobiera wszystkich pracowników
 * @returns Lista pracowników
 * @throws Error gdy nie można pobrać danych
 */
export const pobierzPracownikow = async (): Promise<Pracownik[]> => {
  try {
    const response = await axiosInstance.get("/staff");
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch staff members");
    }
    return response.data.data || [];
  } catch (error) {
    logger.error("Failed to get staff members", { error });
    throw error; // Rzucamy błąd dalej dla TanStack Query
  }
};

/**
 * Pobiera pracownika po ID
 * @param id Identyfikator pracownika
 * @returns Dane pracownika
 * @throws Error gdy nie można pobrać danych lub pracownik nie istnieje
 */
export const pobierzPracownika = async (id: string): Promise<Pracownik> => {
  try {
    const response = await axiosInstance.get(
      `/staff/${encodeURIComponent(id)}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Staff member not found");
    }
    if (!response.data.data) {
      throw new Error(`Staff member with ID ${id} not found`);
    }
    return response.data.data;
  } catch (error) {
    logger.error("Failed to get staff member", { id, error });
    throw error;
  }
};

/**
 * Dodaje nowego pracownika z automatycznie wygenerowanym hasłem
 * @param pracownik Dane nowego pracownika (bez ID)
 * @returns Dane utworzonego pracownika z hasłem
 * @throws Error gdy nie można utworzyć pracownika
 */
export const dodajPracownikaZHaslem = async (
  pracownik: NowyPracownikBezId,
): Promise<PracownikZHaslem> => {
  try {
    const response = await axiosInstance.post(
      "/staff/with-password",
      pracownik,
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create staff member");
    }
    if (!response.data.data) {
      throw new Error("No data returned from server");
    }
    return response.data.data;
  } catch (error) {
    logger.error("Failed to add staff member with password", { error });
    throw error;
  }
};

/**
 * Dodaje nowego pracownika (bez konta logowania)
 * @param pracownik Dane nowego pracownika
 * @returns Dane utworzonego pracownika
 * @throws Error gdy nie można utworzyć pracownika
 */
export const dodajPracownika = async (
  pracownik: NowyPracownik,
): Promise<Pracownik> => {
  try {
    const response = await axiosInstance.post("/staff", pracownik);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create staff member");
    }
    if (!response.data.data) {
      throw new Error("No data returned from server");
    }
    return response.data.data;
  } catch (error) {
    logger.error("Failed to add staff member", { error });
    throw error;
  }
};

/**
 * Aktualizuje dane pracownika
 * @param id Identyfikator pracownika
 * @param dane Dane do aktualizacji
 * @returns Zaktualizowane dane pracownika
 * @throws Error gdy nie można zaktualizować danych
 */
export const aktualizujPracownika = async (
  id: string,
  dane: AktualizacjaPracownika,
): Promise<Pracownik> => {
  try {
    const response = await axiosInstance.put(
      `/staff/${encodeURIComponent(id)}`,
      dane,
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update staff member");
    }
    if (!response.data.data) {
      throw new Error("No data returned from server");
    }
    return response.data.data;
  } catch (error) {
    logger.error("Failed to update staff member", { id, error });
    throw error;
  }
};

/**
 * Usuwa pracownika
 * @param id Identyfikator pracownika
 * @returns Informacja o pomyślnym usunięciu
 * @throws Error gdy nie można usunąć pracownika
 */
export const usunPracownika = async (
  id: string,
): Promise<{ success: true }> => {
  try {
    const response = await axiosInstance.delete(
      `/staff/${encodeURIComponent(id)}`,
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete staff member");
    }
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete staff member", { id, error });
    throw error;
  }
};
