import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { config } from "./config/config";
import session from "express-session";
import crypto from "crypto"; // Do generowania secret
import { sessionCleaner, errorHandler, requestLogger } from "./middleware"; // Import nowych middleware
import { initializeDatabase } from "./config/database";

// --- Konfiguracja i ładowanie zmiennych ---
console.log("🔧 [startup]: Ładuję zmienne środowiskowe...");
// Najpierw wczytaj główny .env z katalogu nadrzędnego
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
console.log(
  "📁 [startup]: Ładuję główny .env z:",
  path.resolve(__dirname, "../../.env"),
);
// Następnie wczytaj lokalny backend/.env (może nadpisać niektóre zmienne jak PORT)
console.log("📁 [startup]: Ładuję lokalny backend/.env");
dotenv.config(); // Domyślnie szuka .env w bieżącym katalogu (backend)

console.log("✅ [startup]: Zmienne środowiskowe załadowane");

console.log(
  "DEBUG: ALLEGRO_REDIRECT_URI from process.env in server.ts:",
  process.env.ALLEGRO_REDIRECT_URI,
);

// --- Inicjalizacja Aplikacji Express ---
console.log("🚀 [startup]: Tworzę aplikację Express...");
export const app: Express = express();
const PORT = process.env.PORT || 3001;
console.log("🌐 [startup]: Port serwera:", PORT);

// --- Konfiguracja Middleware ---
console.log("🔧 [middleware]: Konfiguruję middleware...");

// Konfiguracja CORS
console.log("🔧 [middleware]: Konfiguruję CORS...");
const corsOptions = {
  origin: config.frontendUrl,
  credentials: true,
};
app.use(cors(corsOptions));

// Parsery
console.log("🔧 [middleware]: Konfiguruję JSON parser...");
app.use(express.json());

// Logger
console.log("🔧 [middleware]: Konfiguruję logger żądań...");
app.use(requestLogger);

// Zarządzanie sesjami
console.log("🔧 [middleware]: Konfiguruję automatyczne zarządzanie sesjami...");
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
      maxAge: 24 * 60 * 60 * 1000, // 24 godziny
    },
  }),
);

app.use(sessionCleaner);

// --- Routes ---
console.log("🛣️ [routes]: Konfiguruję routing...");
// Importuj główny plik z routingiem
import routes from "./routes";
console.log("🛣️ [routes]: Dodaję główny router /api...");
app.use("/api", routes);

// Prosty endpoint testowy
app.get("/api/ping", (req: Request, res: Response) => {
  res.json({ message: "pong" });
});

// Strona główna
app.get("/", (req: Request, res: Response) => {
  res.send("Backend MS-BOX");
});

// --- Inicjalizacja i Start Serwera ---

// Globalny handler błędów (musi być na końcu)
console.log("🔧 [middleware]: Konfiguruję globalny handler błędów...");
app.use(errorHandler);

// Funkcja startowa serwera
export const startServer = async () => {
  console.log("🚀 [server]: Rozpoczynam uruchamianie serwera...");
  try {
    console.log("🗄️ [server]: Inicjalizuję bazę danych...");
    await initializeDatabase();
    console.log("✅ [server]: Baza danych zainicjalizowana pomyślnie");

    app.listen(PORT, () => {
      console.log(`⚡️ [server]: Serwer działa na http://localhost:${PORT}`);
      console.log("🎉 [server]: Backend gotowy do przyjmowania żądań!");
    });
  } catch (error) {
    console.error("❌ [server]: Błąd podczas uruchamiania serwera:", error);
    process.exit(1);
  }
};

// Uruchomienie serwera, jeśli plik jest wykonywany bezpośrednio
if (require.main === module) {
  console.log("🎬 [startup]: Wywołuję startServer()...");
  startServer();
}
