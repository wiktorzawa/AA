import strapiAdapter from "./strapiAdapter";
import { logger } from "../utils/logger";
import type { SupplierProfile as Supplier } from "@/types/app.types";
import type { ApiSupplierSupplier } from "@/types/strapi";

// Interfejs dla odpowiedzi z hasłem
export interface DostawcaZHaslem {
  supplier: Supplier;
  password: string;
}

// Definicja typu dla elementu danych dostawcy Strapi
interface StrapiSupplierItem {
  id: number;
  attributes: ApiSupplierSupplier["attributes"];
}

/**
 * Mapuje dane Strapi na format aplikacji (SupplierProfile)
 */
const mapStrapiToAppFormat = (strapiData: StrapiSupplierItem): Supplier => {
  const {
    supplierId,
    companyName,
    contactFirstName,
    contactLastName,
    nip,
    email,
    phone,
    website,
    street,
    buildingNumber,
    apartmentNumber,
    city,
    postalCode,
    country,
  } = strapiData.attributes;

  return {
    id: strapiData.id,
    supplierId,
    companyName,
    contactFirstName,
    contactLastName,
    nip,
    email,
    phone,
    website,
    street,
    buildingNumber,
    apartmentNumber,
    city,
    postalCode,
    country,
  };
};

/**
 * Mapuje dane aplikacji (SupplierProfile) na format Strapi
 */
const mapAppToStrapiFormat = (appData: Partial<Omit<Supplier, "id">>) => {
  const strapiData: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(appData)) {
    strapiData[key] = value;
  }
  return strapiData;
};

/**
 * Pobiera wszystkich dostawców
 */
export const pobierzDostawcow = async (): Promise<Supplier[]> => {
  try {
    const response = await strapiAdapter.get<{ data: StrapiSupplierItem[] }>(
      "/suppliers?populate=*&sort=companyName:asc",
    );
    return response.data ? response.data.map(mapStrapiToAppFormat) : [];
  } catch (error) {
    logger.error("Failed to get suppliers", { error });
    throw error;
  }
};

/**
 * Pobiera dostawcę po ID
 */
export const pobierzDostawce = async (id: string): Promise<Supplier> => {
  try {
    const response = await strapiAdapter.get<{ data: StrapiSupplierItem }>(
      `/suppliers/${id}?populate=*`,
    );
    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    }
    throw new Error(`Supplier with ID ${id} not found`);
  } catch (error) {
    logger.error("Failed to get supplier", { id, error });
    throw error;
  }
};

/**
 * Dodaje nowego dostawcę z automatycznie wygenerowanym hasłem
 */
export const dodajDostawceZHaslem = async (
  dostawca: Omit<Supplier, "id">,
): Promise<DostawcaZHaslem> => {
  const password = Math.random().toString(36).slice(-8) + "S1!";
  const payload = { data: mapAppToStrapiFormat(dostawca) };
  try {
    const response = await strapiAdapter.post<
      typeof payload,
      { data: StrapiSupplierItem }
    >("/suppliers", payload);

    if (!response.data) {
      throw new Error("Failed to create supplier, no data in response");
    }
    const createdSupplier = mapStrapiToAppFormat(response.data);

    try {
      await strapiAdapter.post("/auth/local/register", {
        username: dostawca.email,
        email: dostawca.email,
        password: password,
        role: "supplier", // Upewnij się, że rola 'supplier' istnieje i ma odpowiedni 'type' w Strapi
        supplier_profile: createdSupplier.id,
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
 * Aktualizuje dane dostawcy
 */
export const aktualizujDostawce = async (
  id: string,
  dane: Partial<Omit<Supplier, "id">>,
): Promise<Supplier> => {
  const payload = { data: mapAppToStrapiFormat(dane) };
  try {
    const response = await strapiAdapter.put<
      typeof payload,
      { data: StrapiSupplierItem }
    >(`/suppliers/${id}`, payload);

    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    }
    throw new Error(
      `Failed to update supplier with ID ${id}, no data received.`,
    );
  } catch (error) {
    logger.error("Failed to update supplier", { id, error });
    throw error;
  }
};

/**
 * Usuwa dostawcę
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
 */
export const sprawdzDostepnoscNIP = async (
  nip: string,
): Promise<{ available: boolean }> => {
  try {
    const response = await strapiAdapter.get<{ data: StrapiSupplierItem[] }>(
      `/suppliers?filters[nip][$eq]=${nip}`,
    );
    return { available: (response.data || []).length === 0 };
  } catch (error) {
    logger.error("Failed to check NIP availability", { nip, error });
    throw error;
  }
};

/**
 * Sprawdza dostępność adresu email
 */
export const sprawdzDostepnoscEmail = async (
  email: string,
): Promise<{ available: boolean }> => {
  try {
    const response = await strapiAdapter.get<{ data: StrapiSupplierItem[] }>(
      `/suppliers?filters[email][$eq]=${email}`,
    );
    return { available: (response.data || []).length === 0 };
  } catch (error) {
    logger.error("Failed to check email availability", { email, error });
    throw error;
  }
};

// Usunięto zbędną funkcję `dodajDostawce`
