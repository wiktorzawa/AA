// ===== ROLE UŻYTKOWNIKÓW =====
export const USER_ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  SUPPLIER: "supplier",
} as const;

// ===== STATUSY WERYFIKACJI =====
export const DELIVERY_STATUS = {
  NEW: "nowa",
  VERIFICATION: "trwa weryfikacja",
  VERIFIED: "zweryfikowano",
  REPORT: "raport",
  FINISHED: "zakończono",
} as const;

export const PRODUCT_STATUS = {
  NEW: "nowy",
  APPROVED: "zatwierdzony",
  REJECTED: "odrzucony",
} as const;

// ===== LIMITY CZASOWE =====
export const TIME_LIMITS = {
  SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 24 godziny w ms
  LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minut w ms
  DEFAULT_SCRAPING_INTERVAL: 24, // godziny
  CLEANUP_INTERVAL_MINUTES: 60, // minuty
} as const;

// ===== LIMITY PLIKÓW =====
export const FILE_LIMITS = {
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB w bajtach
  MAX_PRICE_VALUE: 100000, // maksymalna cena produktu
} as const;

// ===== KONFIGURACJA BAZY DANYCH =====
export const DATABASE_CONFIG = {
  CONNECTION_IDLE_TIME: 10000, // ms
  STRING_FIELD_LENGTH: 1000, // znaki
} as const;

// ===== NAZWY MODELI/ALIASÓW =====
export const MODEL_ALIASES = {
  ADMIN: "admin",
  STAFF: "staff",
  SUPPLIER: "supplier",
} as const;

// ===== PREFIKSY ID =====
export const ID_PREFIXES = {
  ADMIN: "ADM",
  STAFF: "STF",
  SUPPLIER: "SUP",
} as const;

// ===== BŁĘDY I KOMUNIKATY =====
export const ERROR_MESSAGES = {
  INVALID_ROLE: 'Nieprawidłowa rola. Dozwolone wartości to "admin" lub "staff"',
  INVALID_ROLE_ALL:
    'Nieprawidłowa rola. Dozwolone wartości to "admin", "staff" lub "supplier"',
  MISSING_REQUIRED_FIELDS: "Wszystkie wymagane pola muszą być wypełnione",
  FILE_TOO_LARGE: "Plik jest za duży",
  DELIVERY_NOT_FOUND: "Dostawa nie została znaleziona",
  SUPPLIER_NOT_FOUND: "Dostawca nie został znaleziony",
  MISSING_CREDENTIALS: "Nie podano adresu e-mail lub hasła.",
  INVALID_CREDENTIALS: "Nieprawidłowy adres e-mail lub hasło.",
  INVALID_REFRESH_TOKEN: "Nieprawidłowy lub wygasły token odświeżający.",
} as const;

// ===== TYPY DLA TypeScript =====
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type DeliveryStatus =
  (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS];
export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];
