import { Sequelize, Dialect } from "sequelize";
import { config } from "./config";
import { logger } from "../utils/logger";

// Stworzenie instancji Sequelize z użyciem scentralizowanej konfiguracji
export const sequelize = new Sequelize({
  dialect: config.dbDialect as Dialect,
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.dbName,
  logging: false, // Wyłącz logowanie zapytań SQL w konsoli
  timezone: "+02:00",
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
  dialectOptions: {
    connectTimeout: 60000,
    ssl: {
      require: false,
      rejectUnauthorized: false,
    },
  },
  retry: {
    max: 3,
  },
});

// Funkcja do inicjalizacji modeli i połączenia z bazą
export const initializeDatabase = async () => {
  try {
    // Dynamiczne importowanie i inicjalizacja wszystkich modeli
    logger.info("Ładowanie modeli Sequelize...");
    const { initializeAllModels } = await import("../models");
    initializeAllModels();
    logger.info("Modele załadowane.");

    logger.info("Uwierzytelnianie w bazie danych...");
    await sequelize.authenticate({
      logging: (msg) => logger.debug(`[Sequelize Auth] ${msg}`),
    });
    logger.info("✅ Połączenie z bazą danych zostało nawiązane pomyślnie");
  } catch (error) {
    logger.error("❌ KRYTYCZNY BŁĄD PODCZAS INICJALIZACJI BAZY DANYCH ❌");
    if (error instanceof Error) {
      logger.error(`Treść błędu: ${error.message}`);
      logger.error(`Stack trace: ${error.stack}`);
    } else {
      logger.error("Wystąpił nieznany błąd", { error });
    }
    // Upewniamy się, że proces zostanie zakończony z błędem
    process.exit(1);
  }
};
