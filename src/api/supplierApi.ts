import strapiAdapter from "./strapiAdapter";
import { logger } from "../utils/logger";
import type { Supplier } from "@/types/supplier.types";

// Interfejs dla odpowiedzi z hasłem
export interface DostawcaZHaslem {
  supplier: Supplier;
  password: string;
}

// Definicja typu dla elementu danych dostawcy Strapi
interface StrapiSupplierItem {
  id: number;
  attributes: Omit<Supplier, "id">;
  [key: string]: any;
}

/**
 * Mapuje dane Strapi na format aplikacji
 */
const mapStrapiToAppFormat = (strapiData: StrapiSupplierItem): Supplier => {
  const attrs = strapiData.attributes || strapiData;
  return {
    id: strapiData.id,
    id_dostawcy: attrs.id_dostawcy,
    nazwa_firmy: attrs.nazwa_firmy,
    imie_kontaktu: attrs.imie_kontaktu,
    nazwisko_kontaktu: attrs.nazwisko_kontaktu,
    numer_nip: attrs.numer_nip,
    adres_email: attrs.adres_email,
    telefon: attrs.telefon,
    strona_www: attrs.strona_www,
    adres_ulica: attrs.adres_ulica,
    adres_numer_budynku: attrs.adres_numer_budynku,
    adres_numer_lokalu: attrs.adres_numer_lokalu,
    adres_miasto: attrs.adres_miasto,
    adres_kod_pocztowy: attrs.adres_kod_pocztowy,
    adres_kraj: attrs.adres_kraj,
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
  };
};

/**
 * Pobiera wszystkich dostawców
 * @returns Lista dostawców
 * @throws Error gdy nie można pobrać danych
 */
export const pobierzDostawcow = async (): Promise<Supplier[]> => {
  try {
    const response = await strapiAdapter.get(
      "/suppliers?populate=*&sort=nazwa_firmy:asc",
    );

    if (response.data) {
      return response.data.map(mapStrapiToAppFormat);
    }

    return [];
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
export const pobierzDostawce = async (id: string): Promise<Supplier> => {
  try {
    const response = await strapiAdapter.get(`/suppliers/${id}?populate=*`);

    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    } else if (response.id) {
      return mapStrapiToAppFormat(response);
    }

    throw new Error(`Supplier with ID ${id} not found`);
  } catch (error) {
    logger.error("Failed to get supplier", { id, error });
    throw error;
  }
};

/**
 * Dodaje nowego dostawcę z automatycznie wygenerowanym hasłem
 * @param dostawca Dane nowego dostawcy (bez ID)
 * @returns Dane utworzonego dostawcy z hasłem
 * @throws Error gdy nie można utworzyć dostawcy
 */
export const dodajDostawceZHaslem = async (
  dostawca: Omit<Supplier, "id" | "createdAt" | "updatedAt">,
): Promise<DostawcaZHaslem> => {
  try {
    // Generuj hasło
    const password = Math.random().toString(36).slice(-8) + "S1!";

    // Utwórz dostawcę w Strapi
    const response = await strapiAdapter.post("/suppliers", {
      data: {
        ...dostawca,
        id_dostawcy: `SUP-${Date.now()}`,
      },
    });

    let createdSupplier;
    if (response.data) {
      createdSupplier = mapStrapiToAppFormat(response.data);
    } else {
      createdSupplier = mapStrapiToAppFormat(response);
    }

    // Utwórz użytkownika w systemie autoryzacji
    try {
      await strapiAdapter.post("/auth/local/register", {
        username: dostawca.email,
        email: dostawca.email,
        password: password,
        role: "supplier",
        supplier_id: createdSupplier.id,
      });
    } catch (authError) {
      logger.warn("Failed to create auth user for supplier", { authError });
    }

    return {
      supplier: createdSupplier,
      password: password,
    };
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
  dostawca: Omit<Supplier, "id" | "createdAt" | "updatedAt">,
): Promise<Supplier> => {
  try {
    const response = await strapiAdapter.post("/suppliers", {
      data: dostawca,
    });

    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    } else {
      return mapStrapiToAppFormat(response);
    }
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
  dane: Partial<Omit<Supplier, "id" | "createdAt" | "updatedAt">>,
): Promise<Supplier> => {
  try {
    const response = await strapiAdapter.put(`/suppliers/${id}`, {
      data: dane,
    });

    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    } else {
      return mapStrapiToAppFormat(response);
    }
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
    await strapiAdapter.delete(`/suppliers/${id}`);
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete supplier", { id, error });
    throw error;
  }
};

/**
 * Sprawdza dostępność numeru NIP
 * @param nip Numer NIP do sprawdzenia
 * @returns Informacja o dostępności
 */
export const sprawdzDostepnoscNIP = async (
  nip: string,
): Promise<{ available: boolean }> => {
  try {
    const response = await strapiAdapter.get(
      `/suppliers?filters[numer_nip][$eq]=${nip}`,
    );
    const suppliers = response.data || response;
    return { available: suppliers.length === 0 };
  } catch (error) {
    logger.error("Failed to check NIP availability", { nip, error });
    throw error;
  }
};

/**
 * Sprawdza dostępność adresu email
 * @param email Adres email do sprawdzenia
 * @returns Informacja o dostępności
 */
export const sprawdzDostepnoscEmail = async (
  email: string,
): Promise<{ available: boolean }> => {
  try {
    const response = await strapiAdapter.get(
      `/suppliers?filters[adres_email][$eq]=${email}`,
    );
    const suppliers = response.data || response;
    return { available: suppliers.length === 0 };
  } catch (error) {
    logger.error("Failed to check email availability", { email, error });
    throw error;
  }
};
