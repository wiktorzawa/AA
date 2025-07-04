import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Używamy zmiennej środowiskowej Vite do określenia bazowego URL API.
// Domyślnie wskazuje na localhost, co jest przydatne w dewelopmencie.
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 sekund
});

// Interceptor żądania - automatyczne dołączanie tokenu
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        const token = state.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.error("Nie można odczytać tokenu z localStorage", e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor odpowiedzi - obsługa błędów 401 i automatyczne odświeżanie tokenu
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStorage = localStorage.getItem("auth-storage");
        if (!authStorage) {
          throw new Error("Brak danych uwierzytelniających w localStorage");
        }

        const { state } = JSON.parse(authStorage);
        const refreshToken = state.refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Żądanie odświeżenia tokenu
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {
            refresh_token: refreshToken,
          },
        );

        const { token: newToken, refresh_token: newRefreshToken } =
          refreshResponse.data;

        // Zapisanie nowych tokenów - UWAGA: Zustand sam to zrobi, ale możemy wymusić
        // Tutaj zamiast ręcznie, polegamy na akcji ze store'a, jeśli to możliwe,
        // ale dla uproszczenia na razie zostawmy ręczny zapis, bo nie mamy dostępu do store'a.
        const newAuthState = {
          ...state,
          token: newToken,
          refreshToken: newRefreshToken,
        };
        localStorage.setItem(
          "auth-storage",
          JSON.stringify({ state: newAuthState, version: 0 }),
        );

        // Aktualizacja nagłówka w pierwotnym żądaniu
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Ponowienie pierwotnego żądania z nowym tokenem
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Odświeżenie nie powiodło się - wylogowanie użytkownika
        localStorage.removeItem("auth-storage");

        // Przekierowanie na stronę logowania
        window.location.href = "/authentication/sign-in";

        return Promise.reject(refreshError);
      }
    }

    // Wszystkie inne błędy przekazujemy dalej
    return Promise.reject(error);
  },
);

export default axiosInstance;
