const dotenv = require("dotenv");
const path = require("path");

// Wczytaj zmienne środowiskowe z pliku .env.test
dotenv.config({ path: path.resolve(__dirname, "./.env.test") });

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/server.ts",
    "!src/config/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testTimeout: 30000,
  maxWorkers: 1, // Sekwencyjne uruchamianie testów dla bazy danych
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
    "^aws-sdk$": "<rootDir>/tests/__mocks__/aws-sdk.ts",
  },
  // Konfiguracja dla testów z plikami
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transformIgnorePatterns: ["node_modules/(?!(xlsx|multer)/)"],
  // Obsługa plików binarnych w testach
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/coverage/"],
};
