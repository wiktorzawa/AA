import axiosInstance from "./axios";

// Interfejs dla danych uwierzytelniających
export interface DaneLogowania {
  adres_email: string;
  haslo: string;
}

// Interfejs dla odpowiedzi z logowania
export interface OdpowiedzLogowania {
  success: boolean;
  userRole?: "admin" | "staff" | "supplier";
  userId?: string;
  token?: string;
  refresh_token?: string;
  uzytkownik?: {
    id_logowania: string;
    id_uzytkownika: string;
    adres_email: string;
    rola_uzytkownika: "admin" | "staff" | "supplier";
  };
  error?: string;
}

// Interfejs dla odświeżenia tokenu
export interface RefreshTokenRequest {
  refresh_token: string;
}

// Interfejs dla weryfikacji tokenu
export interface VerifyTokenResponse {
  success: boolean;
  user?: {
    id_logowania: string;
    id_uzytkownika: string;
    adres_email: string;
    rola_uzytkownika: "admin" | "staff" | "supplier";
  };
  error?: string;
}

/**
 * Loguje użytkownika do systemu
 * @param credentials Dane logowania (adres_email, haslo)
 * @returns Odpowiedź z informacją o sukcesie, roli użytkownika i tokenach
 */
export const zaloguj = async (
  credentials: DaneLogowania,
): Promise<OdpowiedzLogowania> => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: OdpowiedzLogowania } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd połączenia z serwerem",
    };
  }
};

/**
 * Odświeża token dostępu
 * @param refreshTokenData Dane z refresh tokenem
 * @returns Nowe tokeny lub błąd
 */
export const odswiezToken = async (
  refreshTokenData: RefreshTokenRequest,
): Promise<OdpowiedzLogowania> => {
  try {
    const response = await axiosInstance.post(
      "/auth/refresh-token",
      refreshTokenData,
    );
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: OdpowiedzLogowania } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd podczas odświeżania tokenu",
    };
  }
};

/**
 * Weryfikuje token dostępu
 * @param token Token do weryfikacji
 * @returns Dane użytkownika lub błąd
 */
export const weryfikujToken = async (
  token: string,
): Promise<VerifyTokenResponse> => {
  try {
    const response = await axiosInstance.post(
      "/auth/verify-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: VerifyTokenResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd podczas weryfikacji tokenu",
    };
  }
};

/**
 * Wylogowuje użytkownika z systemu
 * @param token Token użytkownika
 * @returns Odpowiedź o sukcesie wylogowania
 */
export const wyloguj = async (
  token: string,
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await axiosInstance.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: { success: boolean; error?: string } };
      };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd podczas wylogowania",
    };
  }
};

/**
 * Pobiera profil użytkownika
 * @param email Email użytkownika
 * @returns Dane profilu użytkownika
 */
export const pobierzProfilUzytkownika = async (email: string) => {
  try {
    const response = await axiosInstance.get(`/auth/profile/${email}`);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: unknown } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      error: "Błąd podczas pobierania profilu użytkownika",
    };
  }
};
