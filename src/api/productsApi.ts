import strapiAdapter from "./strapiAdapter";
import { logger } from "../utils/logger";
import type { Product } from "@/types/product.types";

// Interfejs dla odpowiedzi z paginacją
export interface ProductsResponse {
  success: boolean;
  data?: {
    products: Product[];
    paginationInfo: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  };
  error?: string;
}

// Definicja typu dla elementu danych produktu Strapi
interface StrapiProductItem {
  id: number;
  attributes: Omit<Product, "id">;
  [key: string]: any;
}

/**
 * Mapuje dane Strapi na format aplikacji
 */
const mapStrapiToAppFormat = (strapiData: StrapiProductItem): Product => {
  const attrs = strapiData.attributes || strapiData;
  return {
    id: strapiData.id,
    nazwa_produktu: attrs.nazwa_produktu,
    kod_ean: attrs.kod_ean,
    kod_asin: attrs.kod_asin,
    lpn: attrs.lpn,
    ilosc: attrs.ilosc,
    cena_produktu_spec: attrs.cena_produktu_spec,
    stan_produktu: attrs.stan_produktu,
    kraj_pochodzenia: attrs.kraj_pochodzenia,
    kategoria_produktu: attrs.kategoria_produktu,
    status_weryfikacji: attrs.status_weryfikacji,
    uwagi_weryfikacji: attrs.uwagi_weryfikacji,
    delivery: attrs.delivery?.data,
    palette: attrs.palette?.data,
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
  };
};

/**
 * Pobiera produkty z paginacją i wyszukiwaniem
 * @param page Numer strony
 * @param limit Liczba elementów na stronę
 * @param searchTerm Fraza wyszukiwania
 * @returns Lista produktów z informacjami o paginacji
 */
export const getProducts = async ({
  page = 1,
  limit = 10,
  searchTerm = "",
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
}): Promise<ProductsResponse> => {
  try {
    // Buduj parametry zapytania
    const params: Record<string, any> = {
      "pagination[page]": page,
      "pagination[pageSize]": limit,
      populate: "delivery,palette",
      sort: "createdAt:desc", // Zmieniono sortowanie na domyślne i bezpieczne
    };

    // Dodaj wyszukiwanie jeśli jest
    if (searchTerm) {
      params["filters[$or][0][nazwa_produktu][$containsi]"] = searchTerm;
      params["filters[$or][1][kod_ean][$containsi]"] = searchTerm;
      params["filters[$or][2][kod_asin][$containsi]"] = searchTerm;
      params["filters[$or][3][lpn][$containsi]"] = searchTerm;
    }

    const queryString = new URLSearchParams(params).toString();
    const response = await strapiAdapter.get(`/products?${queryString}`);

    // Sprawdź format odpowiedzi Strapi
    let products: Product[] = [];
    let totalItems = 0;

    if (response.data && response.meta) {
      // Format z paginacją
      products = response.data.map((item: StrapiProductItem) =>
        mapStrapiToAppFormat(item),
      );
      totalItems = response.meta.pagination.total;
    } else if (Array.isArray(response)) {
      // Bezpośrednia tablica
      products = response.map((item: StrapiProductItem) =>
        mapStrapiToAppFormat(item),
      );
      totalItems = products.length;
    }

    const totalPages = Math.ceil(totalItems / limit);

    return {
      success: true,
      data: {
        products,
        paginationInfo: {
          totalItems,
          totalPages,
          currentPage: page,
        },
      },
    };
  } catch (error) {
    logger.error("Failed to fetch products", { error });
    return {
      success: false,
      error: "Wystąpił błąd podczas pobierania produktów",
    };
  }
};

/**
 * Pobiera szczegóły produktu po ID
 * @param id ID produktu
 * @returns Dane produktu
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await strapiAdapter.get(`/products/${id}?populate=*`);

    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    } else if (response.id) {
      return mapStrapiToAppFormat(response);
    }

    return null;
  } catch (error) {
    logger.error("Failed to fetch product", { id, error });
    throw error;
  }
};

/**
 * Aktualizuje produkt
 * @param id ID produktu
 * @param data Dane do aktualizacji
 * @returns Zaktualizowany produkt
 */
export const updateProduct = async (
  id: number,
  data: Partial<Product>,
): Promise<Product> => {
  try {
    const response = await strapiAdapter.put(`/products/${id}`, {
      data: {
        nazwa_produktu: data.nazwa_produktu,
        kod_ean: data.kod_ean,
        kod_asin: data.kod_asin,
        lpn: data.lpn,
        ilosc: data.ilosc,
        cena_produktu_spec: data.cena_produktu_spec,
        stan_produktu: data.stan_produktu,
        kraj_pochodzenia: data.kraj_pochodzenia,
        kategoria_produktu: data.kategoria_produktu,
        status_weryfikacji: data.status_weryfikacji,
      },
    });

    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    } else {
      return mapStrapiToAppFormat(response);
    }
  } catch (error) {
    logger.error("Failed to update product", { id, error });
    throw error;
  }
};

/**
 * Usuwa produkt
 * @param id ID produktu
 * @returns Sukces operacji
 */
export const deleteProduct = async (
  id: number,
): Promise<{ success: boolean }> => {
  try {
    await strapiAdapter.delete(`/products/${id}`);
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete product", { id, error });
    throw error;
  }
};
