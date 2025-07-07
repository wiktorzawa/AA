import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants";
import type { Product } from "../types/product.types";
import { logger } from "../utils/logger";

export const getAllProducts = async ({
  queryKey,
}: {
  queryKey: (string | number)[];
}): Promise<{
  products: Product[];
  pagination: { page: number; totalPages: number; totalItems: number };
}> => {
  const [_key, searchTerm, currentPage] = queryKey;

  logger.info("Próba pobrania produktów z API...", { searchTerm, currentPage });

  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.BASE, {
      params: {
        search: searchTerm,
        page: currentPage,
        limit: 10,
      },
    });

    if (!response.data.success) {
      throw new Error(
        response.data.message || "API zwróciło błąd (success: false)",
      );
    }

    const { products, paginationInfo } = response.data.data;

    return {
      products: products || [],
      pagination: paginationInfo || { page: 1, totalPages: 1, totalItems: 0 },
    };
  } catch (error: any) {
    // --- BEZPOŚREDNIE LOGOWANIE BŁĘDU DO KONSOLI ---
    console.error("!!! ZŁAPANO SZCZEGÓŁOWY BŁĄD W productsApi.ts !!!");
    console.error(error);
    console.error("--- KONIEC SZCZEGÓŁOWEGO BŁĘDU ---");

    // Jeśli to błąd Axios, pokażmy więcej szczegółów
    if (error.response) {
      console.error("Status odpowiedzi serwera:", error.response.status);
      console.error("Dane odpowiedzi serwera:", error.response.data);
    }

    throw new Error(
      "Nie udało się pobrać produktów. Sprawdź konsolę (F12) po więcej szczegółów.",
    );
  }
};
