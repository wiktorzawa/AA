import axiosInstance from "./axios";
import { logger } from "../utils/logger";
// Definicja typu produktu dostawy z backend
export interface DeliveryProduct {
  id_produktu_dostawy: number;
  id_dostawy?: string;
  nr_palety?: string;
  LPN?: string;
  kod_ean?: string;
  kod_asin?: string;
  nazwa_produktu: string;
  ilosc: number;
  cena_produktu_spec?: number;
  stan_produktu?: string;
  kraj_pochodzenia?: string;
  kategoria_produktu?: string;
  status_weryfikacji: string;
  uwagi_weryfikacji?: string;
  data_utworzenia: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Interfejsy dla delivery API
export interface DeliveryUploadRequest {
  file: File;
  supplierId: string;
  confirmDeliveryNumber?: string;
}

export interface DeliveryUploadResponse {
  success: boolean;
  data?: {
    id_dostawy: string;
    id_dostawcy: string;
    nazwa_pliku: string;
    nr_palet_dostawy?: string;
    status_weryfikacji: string;
    liczba_produktow: number;
    wartosc_calkowita: number;
    url_pliku_S3: string;
    data_utworzenia: string;
  };
  error?: string;
}

export interface DeliveryPreviewResponse {
  success: boolean;
  data?: {
    status: string;
    missingFields?: string[];
    detectedDeliveryNumber?: string;
    detectedPaletteNumbers: string[];
    fileName: string;
    totalProducts: number;
    estimatedValue: number;
    productSample: Array<{
      nr_palety?: string;
      nazwa_produktu: string;
      kod_ean?: string;
      kod_asin?: string;
      ilosc: number;
      cena_produktu_spec?: number;
    }>;
    columnMapping: Record<string, string>;
    validationWarnings: string[];
  };
  error?: string;
}

/**
 * Przesyła plik dostawy do systemu
 * @param data Dane z plikiem i opcjonalnym numerem dostawy
 * @returns Odpowiedź z informacją o sukcesie i detalami dostawy
 */
export const uploadDeliveryFile = async (
  data: DeliveryUploadRequest,
): Promise<DeliveryUploadResponse> => {
  logger.info("Uploading delivery file", {
    fileName: data.file.name,
    fileSize: data.file.size,
    supplierId: data.supplierId,
    confirmDeliveryNumber: data.confirmDeliveryNumber,
  });

  try {
    const formData = new FormData();
    formData.append("deliveryFile", data.file);
    formData.append("id_dostawcy", data.supplierId); // Dodajemy ID dostawcy

    if (data.confirmDeliveryNumber) {
      formData.append("confirmDeliveryNumber", data.confirmDeliveryNumber);
    }

    const response = await axiosInstance.post("/deliveries/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // Zwiększony timeout dla uploadów
      timeout: 60000, // 60 sekund
    });

    return response.data;
  } catch (error: unknown) {
    logger.error("Failed to upload delivery file", { error });

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: DeliveryUploadResponse };
      };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd podczas przesyłania pliku dostawy",
    };
  }
};

/**
 * Tworzy podgląd pliku bez zapisywania do bazy
 * @param file Plik do podglądu
 * @returns Podgląd zawartości pliku
 */
export const previewDeliveryFile = async (
  file: File,
): Promise<DeliveryPreviewResponse> => {
  try {
    const formData = new FormData();
    formData.append("deliveryFile", file);

    const response = await axiosInstance.post("/deliveries/preview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // 30 sekund
    });

    return response.data;
  } catch (error: unknown) {
    logger.error("Failed to preview delivery file", { error });

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: DeliveryPreviewResponse };
      };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd podczas tworzenia podglądu pliku",
    };
  }
};

/**
 * Pobiera listę dostaw
 * @returns Lista dostaw użytkownika
 */
export const getDeliveries = async () => {
  try {
    const response = await axiosInstance.get("/deliveries");
    return response.data;
  } catch (error: unknown) {
    logger.error("Failed to fetch deliveries", { error });

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: unknown } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd podczas pobierania listy dostaw",
    };
  }
};

/**
 * Pobiera produkty dla konkretnej dostawy.
 * @param deliveryId - ID dostawy, dla której mają zostać pobrane produkty.
 * @returns Obiekt z danymi produktów zgodny z oczekiwaniami komponentu
 */
export const getProductsByDeliveryId = async (
  deliveryId: string,
): Promise<ApiResponse<DeliveryProduct[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<DeliveryProduct[]>>(
      `/deliveries/${deliveryId}/products`,
    );

    // Zwracamy cały obiekt response.data (zawiera success, data, message)
    return response.data;
  } catch (error) {
    logger.error("Błąd podczas pobierania produktów dla dostawy:", {
      deliveryId,
      error,
    });
    // Rzucenie błędu dalej pozwoli react-query na odpowiednie zarządzanie stanem błędu
    throw error;
  }
};
