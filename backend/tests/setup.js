"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/config/database");
const dotenv_1 = __importDefault(require("dotenv"));
// Ładowanie zmiennych środowiskowych dla testów
dotenv_1.default.config({ path: ".env.test" });
// Globalne ustawienia dla testów
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Ustawienie zmiennych środowiskowych dla testów
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "test-jwt-secret-key";
    process.env.AWS_ACCESS_KEY_ID = "test-access-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";
    process.env.AWS_REGION = "eu-west-1";
    process.env.S3_BUCKET_NAME = "test-bucket";
    // Połączenie z bazą danych testową
    try {
        yield database_1.sequelize.authenticate();
        console.log("✅ Połączenie z bazą danych testową nawiązane");
    }
    catch (error) {
        console.error("❌ Błąd połączenia z bazą danych testową:", error);
        throw error;
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Zamknięcie połączenia z bazą danych
    try {
        yield database_1.sequelize.close();
        console.log("✅ Połączenie z bazą danych testową zamknięte");
    }
    catch (error) {
        console.error("❌ Błąd zamykania połączenia z bazą danych:", error);
    }
}));
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
// Mock dla multer (jeśli potrzebny)
jest.mock("multer", () => {
    const multer = jest.requireActual("multer");
    return Object.assign(Object.assign({}, multer), { memoryStorage: jest.fn(() => ({})), diskStorage: jest.fn(() => ({})) });
});
// Pomocnicze funkcje dla testów
global.testHelpers = {
    // Funkcja do czyszczenia wszystkich tabel
    clearDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const models = database_1.sequelize.models;
            for (const modelName of Object.keys(models)) {
                yield models[modelName].destroy({ where: {}, force: true });
            }
        });
    },
    // Funkcja do resetowania sekwencji auto-increment
    resetSequences() {
        return __awaiter(this, void 0, void 0, function* () {
            if (database_1.sequelize.getDialect() === "postgres") {
                yield database_1.sequelize.query('TRUNCATE TABLE "dost_nowa_dostawa", "dost_dostawy_produkty", "dost_faktury_dostawcow", "dost_finanse_dostaw" RESTART IDENTITY CASCADE');
            }
            else if (database_1.sequelize.getDialect() === "mysql") {
                yield database_1.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
                yield database_1.sequelize.query("TRUNCATE TABLE dost_nowa_dostawa");
                yield database_1.sequelize.query("TRUNCATE TABLE dost_dostawy_produkty");
                yield database_1.sequelize.query("TRUNCATE TABLE dost_faktury_dostawcow");
                yield database_1.sequelize.query("TRUNCATE TABLE dost_finanse_dostaw");
                yield database_1.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
            }
        });
    },
};
