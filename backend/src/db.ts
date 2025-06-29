import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path"; // Używamy standardowego importu

// Upewnijmy się, że zmienne środowiskowe są wczytane
// (chociaż server.ts już to robi, dodanie tutaj nie zaszkodzi)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST); // Log do debugowania
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_DATABASE:", process.env.DB_NAME); // Zmienna w .env to DB_NAME

// Utwórz pulę połączeń
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // Używamy DB_NAME zgodnie z .env
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10, // Można dostosować
  queueLimit: 0, // Bez limitu kolejki
  connectTimeout: 30000, // Zwiększono czas oczekiwania na 30 sekund
});

// Funkcja do testowania połączenia (opcjonalna, ale przydatna)
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Pomyślnie połączono z bazą danych MySQL!");
    connection.release(); // Zwolnij połączenie z powrotem do puli
  })
  .catch((err) => {
    console.error("❌ Błąd podczas łączenia z bazą danych:", err);
    // W realnej aplikacji można tu dodać logikę obsługi błędów krytycznych
  });

// Eksportuj pulę połączeń, aby można było jej używać w innych częściach aplikacji
export default pool;
