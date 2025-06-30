import axiosInstance from "./axios";

// Interfejs dla wpisu w historii logowań
export interface WpisHistoriiLogowania {
  id_wpisu: number;
  id_logowania: string;
  data_proby_logowania: string;
  status_logowania: "success" | "failed";
  poczatek_sesji?: string | null;
  koniec_sesji?: string | null;
}

// Interfejs dla odpowiedzi API
export interface HistoriaLogowaniaResponse {
  success: boolean;
  data?: WpisHistoriiLogowania[];
  count?: number;
  error?: string;
}

export interface OstatnieLogowanieResponse {
  success: boolean;
  data?: WpisHistoriiLogowania | null;
  error?: string;
}

export interface CzyszczenieHistoriiResponse {
  success: boolean;
  message?: string;
  deletedCount?: number;
  error?: string;
}

/**
 * Pobiera historię logowań dla konkretnego użytkownika
 * @param id_logowania Identyfikator logowania użytkownika
 * @param limit Maksymalna liczba wpisów do pobrania (domyślnie 50)
 * @returns Historia logowań użytkownika
 */
export const pobierzHistorieLogowania = async (
  id_logowania: string,
  limit: number = 50,
): Promise<HistoriaLogowaniaResponse> => {
  try {
    const response = await axiosInstance.get(
      `/auth/login-history/${encodeURIComponent(id_logowania)}`,
      {
        params: { limit },
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: HistoriaLogowaniaResponse };
      };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd podczas pobierania historii logowań",
    };
  }
};

/**
 * Pobiera ostatnie udane logowanie użytkownika
 * @param id_logowania Identyfikator logowania użytkownika
 * @returns Ostatnie udane logowanie lub null
 */
export const pobierzOstatnieUdaneLogowanie = async (
  id_logowania: string,
): Promise<OstatnieLogowanieResponse> => {
  try {
    const response = await axiosInstance.get(
      `/auth/last-login/${encodeURIComponent(id_logowania)}`,
    );
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: OstatnieLogowanieResponse };
      };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd podczas pobierania ostatniego logowania",
    };
  }
};

/**
 * Czyści starą historię logowań (tylko dla adminów)
 * @param dni Liczba dni - wpisy starsze niż ta wartość zostaną usunięte (domyślnie 90)
 * @returns Informacja o liczbie usuniętych wpisów
 */
export const wyczyścStaraHistorie = async (
  dni: number = 90,
): Promise<CzyszczenieHistoriiResponse> => {
  try {
    const response = await axiosInstance.post("/auth/clean-history", { dni });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: CzyszczenieHistoriiResponse };
      };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd podczas czyszczenia historii logowań",
    };
  }
};

/**
 * Formatuje datę dla wyświetlenia w polskim formacie
 * @param dateString String z datą w formacie ISO
 * @returns Sformatowana data
 */
export const formatujDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Zwraca opis statusu logowania w języku polskim
 * @param status Status logowania
 * @returns Opis statusu
 */
export const opisStatusu = (status: "success" | "failed"): string => {
  return status === "success" ? "Udane" : "Nieudane";
};

/**
 * Zwraca klasę CSS dla statusu logowania
 * @param status Status logowania
 * @returns Klasa CSS
 */
export const klasaStatusu = (status: "success" | "failed"): string => {
  return status === "success"
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
};
