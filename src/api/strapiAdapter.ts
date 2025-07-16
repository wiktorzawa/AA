import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_URL = `${STRAPI_URL}/api`;

export const strapiAxios = axios.create({
  baseURL: STRAPI_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - automatycznie dodaje token
strapiAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.url !== "/auth/local") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - obsługuje błędy 401 (wygaśnięcie tokenu)
strapiAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Jeśli token wygasł (401), automatycznie wyloguj użytkownika
    if (error.response?.status === 401) {
      console.warn("🚨 Token wygasł - automatyczne wylogowanie");

      // Wyczyść token z localStorage
      localStorage.removeItem("token");

      // Wyloguj użytkownika w store
      useAuthStore.getState().logout();

      // Przekieruj na stronę logowania (jeśli nie jesteśmy już tam)
      if (window.location.pathname !== "/authentication/sign-in") {
        window.location.href = "/authentication/sign-in";
      }
    }

    return Promise.reject(error);
  },
);

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const strapiError = error.response?.data?.error;
    if (strapiError) {
      throw {
        message: strapiError.message || "Błąd serwera Strapi",
        details: strapiError.details,
        name: strapiError.name,
        status: error.response?.status,
      };
    }
  }
  throw error;
};

export const strapiAdapter = {
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await strapiAxios.get(endpoint, { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async post<T, R>(
    endpoint: string,
    data?: T,
    config?: Record<string, unknown>,
  ): Promise<R> {
    try {
      const response = await strapiAxios.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async put<T, R>(endpoint: string, data?: T): Promise<R> {
    try {
      const response = await strapiAxios.put(endpoint, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async delete<R>(endpoint: string): Promise<R> {
    try {
      const response = await strapiAxios.delete(endpoint);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async upload<R>(endpoint: string, formData: FormData): Promise<R> {
    try {
      const response = await strapiAxios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

export default strapiAdapter;
