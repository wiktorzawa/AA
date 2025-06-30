import { sequelize } from "../src/config/database";
import { initializeAllModels } from "../src/models";
import dotenv from "dotenv";
import path from "path";

// Ładowanie zmiennych środowiskowych dla testów ze ścieżki backend/.env.test
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

// Globalne ustawienia dla testów
beforeAll(async () => {
  // Ustawienie zmiennych środowiskowych dla testów
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "msbox-secret-key";
  process.env.AWS_ACCESS_KEY_ID = "test-access-key";
  process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";
  process.env.AWS_REGION = "eu-west-1";
  process.env.S3_BUCKET_NAME = "test-bucket";
  process.env.ALLEGRO_CLIENT_ID = "test-allegro-client-id";
  process.env.ALLEGRO_CLIENT_SECRET = "test-allegro-client-secret";

  // Inicjalizuj wszystkie modele tylko raz
  try {
    initializeAllModels();
  } catch (error) {
    // Ignore if already initialized
    console.log("Models already initialized");
  }

  // Połączenie z bazą danych testową
  try {
    await sequelize.authenticate();
    console.log("✅ Połączenie z bazą danych testową nawiązane");

    // Synchronizuj bazę danych (utwórz tabele od nowa w środowisku testowym)
    await sequelize.sync({ force: true });
    console.log("✅ Tabele bazy danych testowej utworzone od nowa");
  } catch (error) {
    console.error("❌ Błąd połączenia z bazą danych testową:", error);
    throw error;
  }
});

afterAll(async () => {
  // Zamknięcie połączenia z bazą danych
  try {
    await sequelize.close();
    console.log("✅ Połączenie z bazą danych testową zamknięte");
  } catch (error) {
    console.error("❌ Błąd zamykania połączenia z bazą danych:", error);
  }
});

// Mock dla console.log w testach (opcjonalnie)
const originalConsoleLog = console.log;
beforeEach(() => {
  if (process.env.SUPPRESS_TEST_LOGS === "true") {
    console.log = jest.fn();
  }
});

afterEach(() => {
  if (process.env.SUPPRESS_TEST_LOGS === "true") {
    console.log = originalConsoleLog;
  }
});

// Globalne mock'i
jest.setTimeout(30000);

// Mock dla AWS SDK
jest.mock("aws-sdk", () => ({
  S3: jest.fn().mockImplementation(() => ({
    upload: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Location: "https://test-bucket.s3.amazonaws.com/test-file.xlsx",
        Key: "deliveries/test-file.xlsx",
        Bucket: "test-bucket",
      }),
    }),
    deleteObject: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    }),
    getSignedUrl: jest
      .fn()
      .mockResolvedValue("https://test-bucket.s3.amazonaws.com/signed-url"),
  })),
  config: {
    update: jest.fn(),
  },
}));

// Pomocnicze funkcje dla testów
global.testHelpers = {
  // Funkcja do czyszczenia wszystkich tabel
  async clearDatabase() {
    const models = sequelize.models;
    for (const modelName of Object.keys(models)) {
      try {
        await models[modelName].destroy({ where: {}, force: true });
      } catch (error) {
        // Ignoruj błędy dla nieistniejących tabel
        console.log(
          `Tabela ${modelName} nie istnieje lub nie można jej wyczyścić`,
        );
      }
    }
  },

  // Funkcja do resetowania sekwencji auto-increment
  async resetSequences() {
    try {
      if (sequelize.getDialect() === "postgres") {
        await sequelize.query(
          'TRUNCATE TABLE "dost_nowa_dostawa", "dost_dostawy_produkty", "dost_faktury_dostawcow", "dost_finanse_dostaw" RESTART IDENTITY CASCADE',
        );
      } else if (sequelize.getDialect() === "mysql") {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
        const tables = [
          "dost_nowa_dostawa",
          "dost_dostawy_produkty",
          "dost_faktury_dostawcow",
          "dost_finanse_dostaw",
        ];
        for (const table of tables) {
          try {
            await sequelize.query(`TRUNCATE TABLE ${table}`);
          } catch (error) {
            console.log(
              `Tabela ${table} nie istnieje lub nie można jej zresetować`,
            );
          }
        }
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      }
    } catch (error) {
      console.log(
        "Błąd podczas resetowania sekwencji:",
        (error as Error).message,
      );
    }
  },
};

// Rozszerzenie typów globalnych dla TypeScript
declare global {
  var testHelpers: {
    clearDatabase(): Promise<void>;
    resetSequences(): Promise<void>;
  };
}
