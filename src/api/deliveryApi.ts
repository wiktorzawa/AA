import axiosInstance from "./axios";

// Interfejsy dla delivery API
export interface DeliveryUploadRequest {
  file: File;
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
  console.log("🚀 [deliveryApi] uploadDeliveryFile called with:", {
    fileName: data.file.name,
    fileSize: data.file.size,
    confirmDeliveryNumber: data.confirmDeliveryNumber,
  });

  try {
    // Pobierz token z localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        error: "Token uwierzytelnienia nie został podany.",
      };
    }

    const formData = new FormData();
    formData.append("deliveryFile", data.file);

    if (data.confirmDeliveryNumber) {
      formData.append("confirmDeliveryNumber", data.confirmDeliveryNumber);
    }

    const response = await axiosInstance.post("/deliveries/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      // Zwiększony timeout dla uploadów
      timeout: 60000, // 60 sekund
    });

    return response.data;
  } catch (error: unknown) {
    console.error("❌ [deliveryApi]: Błąd uploadu:", error);

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
    // Pobierz token z localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        error: "Token uwierzytelnienia nie został podany.",
      };
    }

    const formData = new FormData();
    formData.append("deliveryFile", file);

    const response = await axiosInstance.post("/deliveries/preview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      timeout: 30000, // 30 sekund
    });

    return response.data;
  } catch (error: unknown) {
    console.error("❌ [deliveryApi]: Błąd podglądu:", error);

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
    // Pobierz token z localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        error: "Token uwierzytelnienia nie został podany.",
      };
    }

    const response = await axiosInstance.get("/deliveries", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("❌ [deliveryApi]: Błąd pobierania dostaw:", error);

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
