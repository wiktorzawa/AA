// Plik: backend/config/sequelize.config.js

// Na samej górze wczytujemy zmienne środowiskowe z pliku .env
// To sprawia, że wszystkie zmienne jak DB_USER, DB_PASSWORD stają się dostępne w tym pliku.
require("dotenv").config();

module.exports = {
  // Konfiguracja dla środowiska deweloperskiego (używana domyślnie)
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  // Konfiguracja dla środowiska testowego
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  // Konfiguracja dla środowiska produkcyjnego
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
