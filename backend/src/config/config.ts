import { logger } from "../utils/logger";

// Ta konfiguracja jest teraz znacznie prostsza.
// Zakładamy, że dotenv został już zainicjowany w głównym pliku aplikacji (server.ts)
// lub w konfiguracji testów (jest.config.js).
// Ten plik służy tylko do zbierania i eksportowania zmiennych w jednym miejscu.

export interface Config {
  port: number;
  frontendUrl: string;
  dbHost?: string;
  dbPort: number;
  dbUsername?: string;
  dbPassword?: string;
  dbName?: string;
  dbDialect: string;
  jwtSecret?: string;
  jwtRefreshSecret?: string;
  brightDataCustomerID?: string;
  brightDataApiToken?: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || "3001", 10),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5174",
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT || "3306", 10),
  dbUsername: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbDialect: process.env.DB_DIALECT || "mysql",
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  brightDataCustomerID: process.env.BRIGHT_DATA_CUSTOMER_ID,
  brightDataApiToken: process.env.BRIGHT_DATA_API_TOKEN,
};

// --- Walidacja kluczowych zmiennych środowiskowych ---
const requiredEnvVars: (keyof Config)[] = [
  "dbHost",
  "dbUsername",
  "dbName",
  "jwtSecret",
  "jwtRefreshSecret",
];

const missingVars = requiredEnvVars.filter((key) => !config[key]);

if (missingVars.length > 0) {
  const errorMessage = `KRYTYCZNY BŁĄD: Brakujące zmienne środowiskowe: ${missingVars.join(
    ", ",
  )}. Aplikacja nie może zostać uruchomiona.`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
}
