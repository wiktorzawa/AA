import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// --- UJEDNOLICONA KONFIGURACJA ZMIENNYCH ŚRODOWISKOWYCH ---
// Konfiguracja dotenv musi być na samym początku, aby wszystkie moduły miały dostęp
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// --- DODANY LOG DO DEBUGOWANIA ---
console.log("--- DEBUG: Wartości zmiennych środowiskowych z .env ---");
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log("-----------------------------------------------------");

import { config } from "./config/config";
import { TIME_LIMITS } from "./constants";
import session from "express-session";
import crypto from "crypto"; // Do generowania secret
import { sessionCleaner, errorHandler, requestLogger } from "./middleware"; // Import nowych middleware
import { initializeDatabase } from "./config/database";
import { logger } from "./utils/logger";

logger.info("Zmienne środowiskowe załadowane");
logger.debug("Sprawdzenie załadowanego portu", { port: process.env.PORT });

logger.debug("ALLEGRO_REDIRECT_URI from process.env in server.ts", {
  allegroRedirectUri: process.env.ALLEGRO_REDIRECT_URI,
});

// --- Inicjalizacja Aplikacji Express ---
logger.info("Tworzę aplikację Express");
export const app: Express = express();
const PORT = process.env.PORT || 3001;
logger.info("Port serwera", { port: PORT });

// --- Konfiguracja Middleware ---
logger.info("Konfiguruję middleware");

// Konfiguracja CORS
logger.info("Konfiguruję CORS");
const corsOptions = {
  origin: config.frontendUrl,
  credentials: true,
};
app.use(cors(corsOptions));

// Parsery
logger.info("Konfiguruję JSON parser");
app.use(express.json());

// Logger
logger.info("Konfiguruję logger żądań");
app.use(requestLogger);

// Zarządzanie sesjami
logger.info("Konfiguruję automatyczne zarządzanie sesjami");
const sessionSecret =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: TIME_LIMITS.SESSION_MAX_AGE,
    },
  }),
);

app.use(sessionCleaner);

// --- Globalny handler błędów ---
// Przeniesiony tutaj, aby łapać błędy z middleware, ale przed routingiem
app.use(errorHandler);

// --- Inicjalizacja i Start Serwera ---

// Funkcja startowa serwera
export const startServer = async () => {
  logger.info("Rozpoczynam uruchamianie serwera");
  try {
    logger.info("Inicjalizuję bazę danych");
    await initializeDatabase();

    // --- Routes ---
    // Ładowane dopiero po pomyślnej inicjalizacji bazy danych
    logger.info("Konfiguruję routing");
    try {
      const routes = (await import("./routes")).default;
      app.use("/api", routes);
    } catch (error) {
      // Używamy console.error, aby mieć pewność, że log zostanie wyświetlony
      console.error("!!! SZCZEGÓŁOWY BŁĄD IMPORTOWANIA TRAS:", error);
      logger.error("Błąd krytyczny podczas importowania modułu tras.", {
        error,
      });
      process.exit(1);
    }

    // Prosty endpoint testowy
    app.get("/api/ping", (req: Request, res: Response) => {
      res.json({ message: "pong" });
    });

    // Strona główna
    app.get("/", (req: Request, res: Response) => {
      res.send("Backend MS-BOX");
    });

    app.listen(PORT, () => {
      logger.info("Serwer działa", { url: `http://localhost:${PORT}` });
      logger.info("Backend gotowy do przyjmowania żądań");
    });
  } catch (error) {
    logger.error("Błąd podczas uruchamiania serwera", { error });
    process.exit(1);
  }
};

// Uruchomienie serwera, jeśli plik jest wykonywany bezpośrednio
if (require.main === module) {
  logger.info("Wywołuję startServer");
  startServer();
}
