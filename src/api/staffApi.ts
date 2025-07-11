import strapiAdapter from "./strapiAdapter";
import { logger } from "../utils/logger";

// Interfejs dla modelu danych pracownika
export interface Pracownik {
  id: number; // Strapi używa numerycznych ID
  id_pracownika: string;
  imie: string;
  nazwisko: string;
  rola: "admin" | "staff";
  adres_email: string;
  telefon?: string | null;
  createdAt: string;
  updatedAt: string;
  // Mapowanie dla kompatybilności wstecznej
  data_utworzenia?: string;
  data_aktualizacji?: string;
}

// Typ dla nowego pracownika (bez dat)
export type NowyPracownik = Omit<
  Pracownik,
  "id" | "createdAt" | "updatedAt" | "data_utworzenia" | "data_aktualizacji"
>;

// Typ dla aktualizacji pracownika (częściowe dane, bez ID i dat)
export type AktualizacjaPracownika = Partial<
  Omit<
    Pracownik,
    | "id"
    | "id_pracownika"
    | "createdAt"
    | "updatedAt"
    | "data_utworzenia"
    | "data_aktualizacji"
  >
>;

// Typ dla nowego pracownika bez ID (generowane automatycznie)
export type NowyPracownikBezId = Omit<NowyPracownik, "id_pracownika">;

// Interfejs dla odpowiedzi z hasłem
export interface PracownikZHaslem {
  staff: Pracownik;
  password: string;
}

// Definicja typu dla elementu danych pracownika Strapi
interface StrapiStaffItem {
  id: number;
  attributes: Omit<Pracownik, "id">;
  [key: string]: any;
}

/**
 * Mapuje dane Strapi na format aplikacji
 */
const mapStrapiToAppFormat = (strapiData: StrapiStaffItem): Pracownik => {
  return {
    id: strapiData.id,
    id_pracownika:
      strapiData.attributes?.id_pracownika ||
      strapiData.id_pracownika ||
      `STAFF-${strapiData.id}`,
    imie: strapiData.attributes?.imie || strapiData.imie,
    nazwisko: strapiData.attributes?.nazwisko || strapiData.nazwisko,
    rola: strapiData.attributes?.rola || strapiData.rola || "staff",
    adres_email: strapiData.attributes?.adres_email || strapiData.adres_email,
    telefon: strapiData.attributes?.telefon || strapiData.telefon,
    createdAt: strapiData.attributes?.createdAt || strapiData.createdAt,
    updatedAt: strapiData.attributes?.updatedAt || strapiData.updatedAt,
    // Kompatybilność wsteczna
    data_utworzenia: strapiData.attributes?.createdAt || strapiData.createdAt,
    data_aktualizacji: strapiData.attributes?.updatedAt || strapiData.updatedAt,
  };
};

/**
 * Pobiera wszystkich pracowników
 * @returns Lista pracowników
 * @throws Error gdy nie można pobrać danych
 */
export const pobierzPracownikow = async (): Promise<Pracownik[]> => {
  try {
    const response = await strapiAdapter.get("/staff-members?populate=*");

    if (response.data) {
      // Format Strapi z atrybutami
      return response.data.map((item: StrapiStaffItem) =>
        mapStrapiToAppFormat(item),
      );
    } else if (Array.isArray(response)) {
      // Bezpośrednia odpowiedź
      return response.map((item: StrapiStaffItem) =>
        mapStrapiToAppFormat(item),
      );
    }

    return [];
  } catch (error) {
    logger.error("Failed to get staff members", { error });
    throw error;
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
    const response = await strapiAdapter.get(`/staff-members/${id}?populate=*`);

    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    } else if (response.id) {
      return mapStrapiToAppFormat(response);
    }

    throw new Error(`Staff member with ID ${id} not found`);
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
    // Generuj hasło
    const password = Math.random().toString(36).slice(-8) + "A1!";

    // Utwórz pracownika w Strapi
    const response = await strapiAdapter.post("/staff-members", {
      data: {
        ...pracownik,
        id_pracownika: `STAFF-${Date.now()}`,
      },
    });

    let createdStaff;
    if (response.data) {
      createdStaff = mapStrapiToAppFormat(response.data);
    } else {
      createdStaff = mapStrapiToAppFormat(response);
    }

    // Utwórz użytkownika w systemie autoryzacji
    try {
      await strapiAdapter.post("/auth/local/register", {
        username: pracownik.adres_email,
        email: pracownik.adres_email,
        password: password,
        role: pracownik.rola || "staff",
      });
    } catch (authError) {
      logger.warn("Failed to create auth user for staff member", { authError });
    }

    return {
      staff: createdStaff,
      password: password,
    };
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
    const response = await strapiAdapter.post("/staff-members", {
      data: pracownik,
    });

    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    } else {
      return mapStrapiToAppFormat(response);
    }
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
    const response = await strapiAdapter.put(`/staff-members/${id}`, {
      data: dane,
    });

    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    } else {
      return mapStrapiToAppFormat(response);
    }
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
    await strapiAdapter.delete(`/staff-members/${id}`);
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete staff member", { id, error });
    throw error;
  }
};
