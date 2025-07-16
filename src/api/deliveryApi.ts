import { logger } from "../utils/logger";
// Usunięty import: import type { ColumnMapping, FilePreviewResponse } from "../types/api.types";
import type { Delivery } from "@/types/delivery.types";
import strapiAdapter from "./strapiAdapter";

// Typy przeniesione z api.types.ts
export type PreviewStatus =
  | "SUKCES"
  | "WYMAGA_POTWIERDZENIA"
  | "WYMAGA_MAPOWANIA"
  | "BŁĄD";

export interface FilePreviewResponse {
  analysisStatus: PreviewStatus;
  products: PreviewProduct[];
  availableColumns: string[];
  columnMapping: ColumnMapping;
  deliveryNumber: string | null;
  paletteNumbers: string[];
  totalProducts: number;
  estimatedValue: number;
  fileName: string;
  hasHeaders: boolean;
  productSample: PreviewProduct[];
  validationWarnings?: string[];
  validationDetails?: ValidationDetails;
}

export interface PreviewProduct {
  nr_palety?: string;
  nazwa_produktu: string;
  kod_ean?: string;
  kod_asin?: string;
  ilosc: number;
  cena_produktu_spec?: number;
  lpn?: string;
  stan_produktu?: string;
  kraj_pochodzenia?: string;
  kategoria_produktu?: string;
}

export interface ColumnMapping {
  paletteNumber?: string;
  productName?: string;
  ean?: string;
  asin?: string;
  quantity?: string;
  price?: string;
  lpn?: string;
  condition?: string;
  country?: string;
  department?: string;
  category?: string;
  subcategory?: string;
}

export interface ValidationDetails {
  criticalErrors: ValidationError[];
  warnings: ValidationError[];
  missingDataSummary: {
    productsWithoutPalette: number;
    productsWithoutEAN: number;
    productsWithoutPrice: number;
    productsWithoutQuantity: number;
  };
  dataQualityScore: number;
  recommendedAction: "proceed" | "review_required" | "manual_correction_needed";
}

export interface ValidationError {
  type: "critical" | "warning";
  code: string;
  message: string;
  field?: string;
  rowNumber?: number;
  affectedProducts?: number;
}

// Definicja typu dla elementu danych Strapi
interface StrapiDataItem {
  id: number;
  attributes: Omit<Delivery, "id">;
  [key: string]: any; // Zezwól na inne właściwości, których nie znamy
}

/**
 * Mapuje dane Strapi na format aplikacji
 */
const mapStrapiToAppFormat = (strapiData: StrapiDataItem): Delivery => {
  const attrs = strapiData.attributes || strapiData;
  return {
    id: strapiData.id,
    id_dostawy: attrs.id_dostawy,
    id_dostawcy: attrs.id_dostawcy,
    id_pliku: attrs.id_pliku,
    nazwa_pliku: attrs.nazwa_pliku,
    url_pliku_S3: attrs.url_pliku_S3,
    nr_palet_dostawy: attrs.nr_palet_dostawy,
    nr_lot_dostawy: attrs.nr_lot_dostawy,
    status_weryfikacji: attrs.status_weryfikacji,
    supplier: attrs.supplier?.data,
    products: attrs.products?.data,
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
  };
};

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
  mapping?: Record<string, string>;
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
    status: "SUKCES" | "WYMAGA_POTWIERDZENIA" | "WYMAGA_MAPOWANIA" | "BŁĄD";
    missingFields?: string[];
    detectedDeliveryNumber?: string;
    detectedPaletteNumbers: string[];
    fileName: string;
    totalProducts: number;
    estimatedValue: number;
    productSample: Array<Record<string, string | number>>;
    columnMapping: Record<string, string>;
    availableColumns: string[];
    hasHeaders: boolean;
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
    formData.append("id_dostawcy", data.supplierId);

    if (data.confirmDeliveryNumber) {
      formData.append("confirmDeliveryNumber", data.confirmDeliveryNumber);
    }

    // Dołącz mapowanie, jeśli zostało podane
    if (data.mapping) {
      formData.append("columnMapping", JSON.stringify(data.mapping));
    }

    const response = (await strapiAdapter.upload(
      "/deliveries/upload",
      formData,
    )) as DeliveryUploadResponse;

    // Sprawdź, czy odpowiedź z backendu wskazuje na sukces
    if (!response.success) {
      throw new Error(
        response.error || "Błąd podczas przetwarzania pliku na serwerze",
      );
    }

    return response;
  } catch (error: unknown) {
    logger.error("Failed to upload delivery file", { error });

    if (error instanceof Error) {
      throw error;
    }

    // Fallback na generyczny błąd
    throw new Error("Nieoczekiwany błąd podczas przesyłania pliku dostawy");
  }
};

/**
 * Tworzy podgląd pliku bez zapisywania do bazy
 * @param file Plik do podglądu
 * @param mapping Opcjonalne mapowanie kolumn od użytkownika
 * @returns Podgląd zawartości pliku
 */
export const previewFile = async (
  file: File,
  columnMapping?: ColumnMapping | null,
): Promise<DeliveryPreviewResponse> => {
  const formData = new FormData();
  formData.append("deliveryFile", file);
  if (columnMapping) {
    formData.append("columnMapping", JSON.stringify(columnMapping));
  }

  try {
    const response = (await strapiAdapter.post(
      "/deliveries/preview",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    )) as DeliveryPreviewResponse;

    // Backend zwraca { success: true, data: FilePreviewResponse }
    // Musimy wyciągnąć dane z response.data
    if (response && typeof response === "object" && "data" in response) {
      return response.data as DeliveryPreviewResponse;
    } else if (
      response &&
      typeof response === "object" &&
      "success" in response
    ) {
      // Fallback jeśli dane są bezpośrednio w response
      return response;
    }

    throw new Error("Nieprawidłowy format odpowiedzi z serwera");
  } catch (error: unknown) {
    logger.error("Failed to preview delivery file", { error });
    throw new Error("Nieoczekiwany błąd podczas tworzenia podglądu pliku");
  }
};

/**
 * Przesyła plik i finalizuje dostawę
 * @param file Plik z danymi
 * @param mapping Potwierdzone mapowanie kolumn
 * @param deliveryNumber Potwierdzony numer dostawy
 * @param supplierId Opcjonalny ID dostawcy
 * @returns Wynik operacji
 */
export const uploadAndProcessFile = async (
  file: File,
  mapping: ColumnMapping,
  deliveryNumber: string,
  supplierId: string, // Zmieniamy na wymagane
): Promise<DeliveryUploadResponse> => {
  try {
    const formData = new FormData();
    // Użyj klucza, którego oczekuje niestandardowy kontroler, np. 'file'
    formData.append("file", file, file.name);

    // Dane tekstowe przesyłane jako osobne pola
    formData.append("delivery_number", deliveryNumber);
    formData.append("id_dostawcy", supplierId);
    formData.append("mapping", JSON.stringify(mapping));

    // Endpoint 'confirm' oczekuje teraz tych danych
    const response = (await strapiAdapter.upload(
      "/deliveries/confirm",
      formData,
    )) as DeliveryUploadResponse;

    return response;
  } catch (error) {
    console.error("Błąd podczas przesyłania i przetwarzania pliku:", error);
    // Rzuć błąd dalej, aby można go było obsłużyć w useMutation
    throw error;
  }
};

/**
 * Tworzy dane finansowe dla dostawy
 * @param deliveryId ID dostawy
 * @param financeData Dane finansowe (kurs, marża, VAT, waluta)
 * @returns Wynik operacji z danymi finansowymi
 */
interface FinanceData {
  kurs_wymiany: number;
  procent_wartosci: number;
  stawka_vat: number;
  waluta: string;
}

interface FinanceResponse {
  id: number;
  // Zdefiniuj inne pola, które spodziewasz się otrzymać
}

export const createFinances = async (
  deliveryId: string,
  financeData: FinanceData,
): Promise<ApiResponse<FinanceResponse>> => {
  try {
    logger.info("Creating finances for delivery", {
      deliveryId,
      financeData,
    });

    const response = (await strapiAdapter.post(
      `/deliveries/${deliveryId}/finances`,
      financeData,
    )) as ApiResponse<FinanceResponse>;

    if (response.success) {
      logger.info("Finances created successfully", {
        deliveryId,
        financeId: response.data?.finance?.id,
      });
    }

    return response;
  } catch (error: unknown) {
    logger.error("Failed to create finances", {
      deliveryId,
      financeData,
      error,
    });

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Nieoczekiwany błąd podczas tworzenia danych finansowych");
  }
};

/**
 * Pobiera listę dostaw
 * @returns Lista dostaw użytkownika
 */
export const getDeliveries = async (): Promise<{
  success: boolean;
  data: Delivery[];
  error?: string;
}> => {
  try {
    const response = (await strapiAdapter.get("/deliveries?populate=*")) as {
      data: StrapiDataItem[];
    };
    const deliveries = Array.isArray(response.data)
      ? response.data.map(mapStrapiToAppFormat)
      : [];
    return {
      success: true,
      data: deliveries,
    };
  } catch (error: unknown) {
    logger.error("Failed to fetch deliveries", { error });
    return {
      success: false,
      data: [],
      error: "Błąd podczas pobierania listy dostaw",
    };
  }
};

/**
 * Pobiera dostawy dla konkretnego dostawcy
 * @param supplierId ID dostawcy (string, np. 'SUP-123')
 * @returns Lista dostaw dla danego dostawcy
 */
export const getSupplierDeliveries = async (
  supplierId: string,
): Promise<{ success: boolean; data: Delivery[]; error?: string }> => {
  try {
    const queryParams = new URLSearchParams({
      populate: "*",
      "filters[supplier][id_dostawcy][$eq]": supplierId,
    });
    const response = (await strapiAdapter.get(
      `/deliveries?${queryParams}`,
    )) as {
      data: StrapiDataItem[];
    };
    const deliveries = Array.isArray(response.data)
      ? response.data.map(mapStrapiToAppFormat)
      : [];
    return {
      success: true,
      data: deliveries,
    };
  } catch (error: unknown) {
    logger.error("Failed to fetch deliveries for supplier", {
      supplierId,
      error,
    });
    return {
      success: false,
      data: [],
      error: "Błąd podczas pobierania listy dostaw dla dostawcy",
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
    const response = (await strapiAdapter.get(
      `/deliveries/${deliveryId}/products`,
    )) as ApiResponse<DeliveryProduct[]>;
    return response;
  } catch (error) {
    logger.error("Błąd podczas pobierania produktów dla dostawy:", {
      deliveryId,
      error,
    });
    throw error;
  }
};
