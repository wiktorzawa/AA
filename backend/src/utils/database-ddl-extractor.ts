import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// Konfiguracja połączenia z bazą danych
const dbConfig = {
  host: "flask-app-msbox.chqqwymic43o.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "1Nieporet!",
  database: "msbox_db",
  port: 3306,
  ssl: {
    rejectUnauthorized: false,
  },
};

interface TableInfo {
  tableName: string;
  ddl: string;
}

async function extractDatabaseDDL(): Promise<void> {
  let connection: mysql.Connection | null = null;

  try {
    console.log("🔌 Łączenie z bazą danych...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Pomyślnie połączono z bazą danych msbox_db");

    // Pobierz listę wszystkich tabel
    console.log("📋 Pobieranie listy tabel...");
    const [tablesResult] = await connection.execute(
      `
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      ORDER BY TABLE_NAME
    `,
      [dbConfig.database],
    );

    const tables = tablesResult as Array<{ TABLE_NAME: string }>;
    console.log(`📊 Znaleziono ${tables.length} tabel:`);
    tables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${table.TABLE_NAME}`);
    });

    // Wyciągnij DDL dla każdej tabeli
    const tablesDDL: TableInfo[] = [];

    for (const table of tables) {
      try {
        console.log(`🔍 Pobieranie DDL dla tabeli: ${table.TABLE_NAME}`);

        const [ddlResult] = await connection.execute(
          `SHOW CREATE TABLE \`${table.TABLE_NAME}\``,
        );
        const ddlRow = (ddlResult as any[])[0];

        tablesDDL.push({
          tableName: table.TABLE_NAME,
          ddl: ddlRow["Create Table"] || ddlRow["Create View"] || "",
        });

        console.log(`✅ DDL pobrane dla: ${table.TABLE_NAME}`);
      } catch (error) {
        console.error(
          `❌ Błąd podczas pobierania DDL dla tabeli ${table.TABLE_NAME}:`,
          error,
        );
      }
    }

    // Zapisz DDL do pliku
    const outputDir = path.join(__dirname, "../database");
    const outputFile = path.join(outputDir, "msbox_db_ddl.sql");

    // Upewnij się, że katalog istnieje
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let ddlContent = `-- DDL Export for database: ${dbConfig.database}\n`;
    ddlContent += `-- Generated on: ${new Date().toISOString()}\n`;
    ddlContent += `-- Host: ${dbConfig.host}\n\n`;

    ddlContent += `-- =============================================\n`;
    ddlContent += `-- DATABASE SCHEMA DDL\n`;
    ddlContent += `-- =============================================\n\n`;

    for (const table of tablesDDL) {
      ddlContent += `-- =============================================\n`;
      ddlContent += `-- Table: ${table.tableName}\n`;
      ddlContent += `-- =============================================\n\n`;
      ddlContent += `${table.ddl};\n\n`;
    }

    fs.writeFileSync(outputFile, ddlContent, "utf8");
    console.log(`📁 DDL zapisane do pliku: ${outputFile}`);

    // Wyświetl podsumowanie w konsoli
    console.log("\n" + "=".repeat(60));
    console.log("📊 PODSUMOWANIE BAZY DANYCH");
    console.log("=".repeat(60));
    console.log(`🏷️  Nazwa bazy: ${dbConfig.database}`);
    console.log(`🌐 Host: ${dbConfig.host}`);
    console.log(`📈 Liczba tabel: ${tablesDDL.length}`);
    console.log(`📄 Plik DDL: ${outputFile}`);
    console.log("=".repeat(60));

    // Wyświetl DDL w konsoli dla podglądu
    console.log("\n🔍 PODGLĄD DDL WSZYSTKICH TABEL:\n");
    for (const table of tablesDDL) {
      console.log(`\n-- Tabela: ${table.tableName}`);
      console.log("-".repeat(50));
      console.log(table.ddl);
      console.log("");
    }
  } catch (error) {
    console.error("❌ Błąd podczas wyciągania DDL:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Połączenie z bazą danych zamknięte");
    }
  }
}

// Uruchom skrypt
if (require.main === module) {
  extractDatabaseDDL()
    .then(() => {
      console.log("🎉 Wyciąganie DDL zakończone pomyślnie!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Błąd podczas wyciągania DDL:", error);
      process.exit(1);
    });
}

export { extractDatabaseDDL };
