import axios from "axios";

// Konfiguracja Strapi
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_URL = `${STRAPI_URL}/api`;

// Tworzenie instancji axios dla Strapi
export const strapiAxios = axios.create({
  baseURL: STRAPI_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor do dodawania tokena JWT jeśli istnieje
strapiAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Nie dołączaj tokena do żądania logowania, aby uniknąć konfliktów
    if (token && config.url !== "/auth/local") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Mapowanie endpointów Express na Strapi
export const endpointMap: Record<string, string> = {
  // Auth endpoints
  "/auth/login": "/auth/local",
  "/auth/logout": "/auth/logout",
  "/auth/me": "/users/me",

  // Delivery endpoints
  "/deliveries": "/deliveries",
  "/deliveries/upload": "/deliveries/upload",
  "/deliveries/preview": "/deliveries/preview",

  // Product endpoints
  "/products": "/products",

  // Staff endpoints
  "/staff": "/staff-members",

  // Supplier endpoints
  "/suppliers": "/suppliers",
};

// Definicje interfejsów dla odpowiedzi i błędów, aby unikać bezpośredniej zależności od typów axios
interface ApiResponse {
  data: {
    data: unknown;
    meta?: unknown;
  };
}

interface ApiError {
  response?: {
    data?: {
      error?: {
        message: string;
        details: unknown;
      };
    };
  };
  message?: string;
}

// Funkcja do transformacji danych ze Strapi
export const transformStrapiResponse = (response: ApiResponse) => {
  // Strapi zwraca dane w formacie { data: {...}, meta: {...} }
  if (response.data && response.data.data) {
    return {
      success: true,
      data: response.data.data,
      meta: response.data.meta,
    };
  }
  return response.data;
};

// Funkcja do transformacji błędów ze Strapi
export const transformStrapiError = (error: ApiError) => {
  if (error.response?.data?.error) {
    const strapiError = error.response.data.error;
    return {
      success: false,
      error: strapiError.message || "Błąd serwera",
      details: strapiError.details,
    };
  }
  return {
    success: false,
    error: error.message || "Nieoczekiwany błąd",
  };
};

// Adapter dla metod API
export const strapiAdapter = {
  // Metoda GET
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const mappedEndpoint = endpointMap[endpoint] || endpoint;
      const response = await strapiAxios.get(mappedEndpoint, { params });
      return transformStrapiResponse(response) as T;
    } catch (error) {
      throw transformStrapiError(error as ApiError);
    }
  },

  // Metoda POST
  async post<T, R>(
    endpoint: string,
    data?: T,
    config?: Record<string, unknown>,
  ): Promise<R> {
    try {
      const mappedEndpoint = endpointMap[endpoint] || endpoint;
      const response = await strapiAxios.post(mappedEndpoint, data, config);
      return transformStrapiResponse(response) as R;
    } catch (error) {
      throw transformStrapiError(error as ApiError);
    }
  },

  // Metoda PUT
  async put<T, R>(endpoint: string, data?: T): Promise<R> {
    try {
      const mappedEndpoint = endpointMap[endpoint] || endpoint;
      const response = await strapiAxios.put(mappedEndpoint, data);
      return transformStrapiResponse(response) as R;
    } catch (error) {
      throw transformStrapiError(error as ApiError);
    }
  },

  // Metoda DELETE
  async delete<R>(endpoint: string): Promise<R> {
    try {
      const mappedEndpoint = endpointMap[endpoint] || endpoint;
      const response = await strapiAxios.delete(mappedEndpoint);
      return transformStrapiResponse(response) as R;
    } catch (error) {
      throw transformStrapiError(error as ApiError);
    }
  },

  // Upload plików (multipart/form-data)
  async upload<R>(endpoint: string, formData: FormData): Promise<R> {
    try {
      const mappedEndpoint = endpointMap[endpoint] || endpoint;
      const response = await strapiAxios.post(mappedEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return transformStrapiResponse(response) as R;
    } catch (error) {
      throw transformStrapiError(error as ApiError);
    }
  },
};

export default strapiAdapter;
