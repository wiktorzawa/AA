// ===== KLUCZE LOCALSTORAGE =====
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER_PREFERENCES: "userPreferences",
  THEME: "theme",
} as const;

// ===== KLUCZE REACT QUERY =====
export const QUERY_KEYS = {
  PRODUCTS: ["products"],
  PRODUCTS_STATS: ["products-stats"],
  DELIVERIES: ["deliveries"],
  SUPPLIERS: ["suppliers"],
  STAFF: ["staff"],
  USERS: ["users"],
} as const;

// ===== ROUTING PATHS =====
export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ADMIN: {
    ROOT: "/admin",
    PRODUCTS: "/admin/products",
    DELIVERIES: "/admin/deliveries",
    STAFF: "/admin/staff",
    SUPPLIERS: "/admin/suppliers",
    SETTINGS: "/admin/settings",
  },
  STAFF: {
    ROOT: "/staff",
    DELIVERIES: "/staff/deliveries",
    PRODUCTS: "/staff/products",
  },
  SUPPLIER: {
    ROOT: "/supplier",
    DASHBOARD: "/supplier/dashboard",
    DELIVERIES: "/supplier/deliveries",
    UPLOAD: "/supplier/upload",
  },
} as const;

// ===== API ENDPOINTS =====
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
  DELIVERIES: {
    BASE: "/deliveries",
    UPLOAD: "/deliveries/upload",
    PREVIEW: "/deliveries/upload/preview",
    STATS: "/deliveries/stats",
  },
  STAFF: "/staff",
  SUPPLIERS: "/suppliers",
  ADSPOWER: {
    PROFILES: "/adspower/profiles",
    GROUPS: "/adspower/groups",
  },
} as const;

// ===== DEFAULT VALUES =====
export const DEFAULT_VALUES = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 20,
    SORT_BY: "data_utworzenia",
    SORT_ORDER: "DESC",
  },
  SIDEBAR_OPEN: true,
} as const;

// ===== UI CONSTANTS =====
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300, // ms
  ANIMATION_DURATION: 200, // ms
  MAX_FILE_SIZE_DISPLAY: "10MB",
  DATE_FORMAT: "DD/MM/YYYY",
  DATETIME_FORMAT: "DD/MM/YYYY HH:mm",
} as const;

// ===== VALIDATION LIMITS =====
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  FILE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  SEARCH_MIN_LENGTH: 2,
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Błąd połączenia z serwerem",
  UNAUTHORIZED: "Brak autoryzacji",
  FORBIDDEN: "Brak uprawnień",
  NOT_FOUND: "Zasób nie został znaleziony",
  SERVER_ERROR: "Błąd serwera",
  VALIDATION_ERROR: "Błąd walidacji danych",
  FILE_TOO_LARGE: "Plik jest za duży",
  INVALID_FILE_TYPE: "Nieprawidłowy typ pliku",
} as const;

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Zalogowano pomyślnie",
  LOGOUT_SUCCESS: "Wylogowano pomyślnie",
  UPLOAD_SUCCESS: "Plik został przesłany pomyślnie",
  SAVE_SUCCESS: "Zmiany zostały zapisane",
  DELETE_SUCCESS: "Element został usunięty",
} as const;

// ===== TYPY DLA TypeScript =====
export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
