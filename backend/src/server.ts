import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path"; // Import modułu path
import cors from "cors";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import pool from "./db"; // Import puli połączeń
import { RowDataPacket } from "mysql2"; // Import typu dla wyników zapytania
import routes from "./routes"; // Import tras API
import session from "express-session"; // Import express-session
import crypto from "crypto"; // Do generowania secret

// Wczytaj najpierw główny .env (dla bazy danych itp.)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Następnie wczytaj lokalny backend/.env (może nadpisać niektóre zmienne jak PORT)
dotenv.config(); // Domyślnie szuka .env w bieżącym katalogu (backend)

// --- DEBUG: Sprawdź wczytaną wartość ALLEGRO_REDIRECT_URI ---
console.log(
  "DEBUG: ALLEGRO_REDIRECT_URI from process.env in server.ts:",
  process.env.ALLEGRO_REDIRECT_URI,
);
// --- END DEBUG ---

const app: Express = express();
const port = process.env.PORT || 3001;

// --- Middleware ---

// CORS - Zezwalaj na żądania z frontendu (dostosuj origin w razie potrzeby)
app.use(
  cors({
    origin: "http://localhost:5173", // Bezpośrednie ustawienie
    credentials: true,
  }),
);

// Parser JSON - aby Express rozumiał ciało żądania w formacie JSON
app.use(express.json());

// Middleware do obsługi sesji
// WAŻNE: W produkcji użyj bardziej bezpiecznego store, np. connect-redis, connect-mongo itp.
// oraz ustaw 'secure: true' jeśli używasz HTTPS.
// Sekret powinien być długim, losowym ciągiem znaków przechowywanym w zmiennych środowiskowych.
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"), // Użyj zmiennej środowiskowej!
    resave: false,
    saveUninitialized: false, // Zmień na true, jeśli chcesz zapisywać sesje od razu
    cookie: {
      secure: process.env.NODE_ENV === "production", // Używaj bezpiecznych ciasteczek w produkcji (HTTPS)
      httpOnly: true, // Pomaga chronić przed atakami XSS
      maxAge: 1000 * 60 * 60 * 24, // Czas życia ciasteczka sesji (np. 1 dzień)
    },
  }),
);

// --- Routes ---

// Główny router API
app.use("/api", routes);

// Prosty endpoint testowy
app.get("/api/ping", (req: Request, res: Response) => {
  res.json({ message: "pong" });
});

// Endpoint do wykonywania zapytań SQL
app.post(
  "/api/query",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { sql, params } = req.body;
    console.log("--- Otrzymano żądanie /api/query ---");

    if (!sql || typeof sql !== "string") {
      console.log("Błąd /api/query: Brak lub nieprawidłowy parametr 'sql'");
      res
        .status(400)
        .json({ success: false, error: "SQL query string is required" });
      return;
    }

    if (params !== undefined && !Array.isArray(params)) {
      console.log("Błąd /api/query: Parametr 'params' nie jest tablicą");
      res
        .status(400)
        .json({ success: false, error: "Params must be an array" });
      return;
    }

    let connection;
    try {
      connection = await pool.getConnection();
      console.log("Pobrano połączenie z puli (query).");

      const [results] = await connection.execute(sql, params || []);
      console.log("Zapytanie SQL wykonane pomyślnie (query).");

      res.json({ success: true, data: results });
      return;
    } catch (error) {
      console.error(`Błąd podczas wykonywania zapytania SQL (query):`, error);
      const dbError = error as Error;
      res.status(500).json({
        success: false,
        error: `Database query failed: ${dbError.message}`,
      });
      return;
    } finally {
      if (connection) {
        console.log("Zwalnianie połączenia (query)...");
        connection.release();
      }
    }
  }),
);

// --- Start Server ---

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
