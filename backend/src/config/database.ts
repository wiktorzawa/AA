import { Sequelize } from "sequelize";
import { config } from "./config";

// Debug: sprawdź zmienne środowiskowe bazy danych
console.log("🔍 [database]: Debug zmiennych środowiskowych bazy danych:");
console.log("  DB_HOST:", process.env.DB_HOST);
console.log("  DB_PORT:", process.env.DB_PORT);
console.log("  DB_USER:", process.env.DB_USER);
console.log(
  "  DB_PASSWORD:",
  process.env.DB_PASSWORD ? "***USTAWIONE***" : "BRAK",
);
console.log("  DB_NAME:", process.env.DB_NAME);
console.log("🔍 [database]: Config z config.ts:");
console.log("  dbHost:", config.dbHost);
console.log("  dbPort:", config.dbPort);
console.log("  dbUsername:", config.dbUsername);
console.log("  dbPassword:", config.dbPassword ? "***USTAWIONE***" : "BRAK");
console.log("  dbName:", config.dbName);

export const sequelize = new Sequelize({
  dialect: config.dbDialect as any,
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUsername,
  password: config.dbPassword,
  database: config.dbName,
  logging: false,
  timezone: "+02:00", // Polska strefa czasowa (CEST)
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, // Zwiększone do 60s dla AWS
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
  dialectOptions: {
    connectTimeout: 60000, // 60s timeout połączenia
    acquireTimeout: 60000, // 60s timeout acquire
    timeout: 60000, // 60s query timeout
    ssl: {
      require: false, // Nie wymagaj SSL
      rejectUnauthorized: false,
    },
    timezone: "+02:00", // Także w dialectOptions dla MySQL
  },
  retry: {
    max: 3, // Maksymalnie 3 próby
  },
});

// Inicjalizacja modeli
export const initializeDatabase = async () => {
  try {
    // Dynamiczne importy i inicjalizacja modeli
    const { initAuthDaneAutoryzacji } = await import(
      "../models/auth/AuthDaneAutoryzacji"
    );
    const { initAuthPracownicy } = await import(
      "../models/auth/AuthPracownicy"
    );
    const { initAuthDostawcy } = await import("../models/auth/AuthDostawcy");
    const { initAuthHistoriaLogowan } = await import(
      "../models/auth/AuthHistoriaLogowan"
    );

    initAuthDaneAutoryzacji();
    initAuthPracownicy();
    initAuthDostawcy();
    initAuthHistoriaLogowan();

    const { initializeAllModels } = await import("../models");
    initializeAllModels();

    await sequelize.authenticate();
    console.log(
      "✅ [database]: Połączenie z bazą danych zostało nawiązane pomyślnie.",
    );
  } catch (error) {
    console.error(
      "❌ [database]: Błąd podczas inicjalizacji bazy danych:",
      error,
    );
    throw error;
  }
};
