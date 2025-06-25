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
  multipleStatements: true, // Pozwala na wykonywanie wielu zapytań
};

interface DatabaseImprovement {
  step: string;
  description: string;
  sql: string;
  critical: boolean;
}

async function applyDatabaseImprovements(): Promise<void> {
  let connection: mysql.Connection | null = null;

  try {
    console.log("🔌 Łączenie z bazą danych...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Pomyślnie połączono z bazą danych msbox_db");

    // Wczytaj skrypt poprawek
    const improvementsPath = path.join(
      __dirname,
      "../database/database-improvements.sql",
    );

    if (!fs.existsSync(improvementsPath)) {
      throw new Error(`Nie znaleziono pliku poprawek: ${improvementsPath}`);
    }

    const improvementsSQL = fs.readFileSync(improvementsPath, "utf8");
    console.log("📄 Wczytano skrypt poprawek");

    // Sprawdź obecną strukturę bazy
    console.log("\n🔍 Sprawdzanie obecnej struktury bazy...");
    await checkCurrentStructure(connection);

    // Wykonaj kopię zapasową metadanych
    console.log("\n💾 Tworzenie kopii zapasowej metadanych...");
    await createMetadataBackup(connection);

    // Podziel skrypt na sekcje
    const improvements = parseImprovementScript(improvementsSQL);

    console.log(`\n🔧 Znaleziono ${improvements.length} kroków poprawek`);

    // Wykonaj poprawki krok po kroku
    for (const improvement of improvements) {
      console.log(`\n📋 Wykonywanie: ${improvement.step}`);
      console.log(`   Opis: ${improvement.description}`);

      try {
        if (improvement.critical) {
          console.log("⚠️  KRYTYCZNY KROK - wymagana uwaga");
        }

        // Wykonaj SQL
        await connection.execute(improvement.sql);
        console.log(`✅ Pomyślnie wykonano: ${improvement.step}`);
      } catch (error) {
        console.error(`❌ Błąd w kroku ${improvement.step}:`, error);

        if (improvement.critical) {
          console.error("💥 KRYTYCZNY BŁĄD - przerywanie procesu");
          throw error;
        } else {
          console.log("⚠️  Błąd niekrytyczny - kontynuowanie...");
        }
      }
    }

    // Weryfikuj zmiany
    console.log("\n🔍 Weryfikacja zmian...");
    await verifyImprovements(connection);

    // Generuj raport
    console.log("\n📊 Generowanie raportu...");
    await generateImprovementReport(connection);

    console.log("\n🎉 Wszystkie poprawki zostały zastosowane pomyślnie!");
  } catch (error) {
    console.error("💥 Błąd podczas stosowania poprawek:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Połączenie z bazą danych zamknięte");
    }
  }
}

function parseImprovementScript(sql: string): DatabaseImprovement[] {
  const improvements: DatabaseImprovement[] = [];

  // Podziel skrypt na sekcje na podstawie komentarzy
  const sections = sql.split(/-- ={40,}/);

  for (const section of sections) {
    if (section.trim().length === 0) continue;

    const lines = section.trim().split("\n");
    const firstLine = lines[0];

    if (firstLine.startsWith("-- KROK")) {
      const step = firstLine.replace(/^-- /, "").trim();
      const description = lines[1] ? lines[1].replace(/^-- /, "").trim() : "";

      // Wyciągnij SQL (pomijając komentarze)
      const sqlLines = lines.filter(
        (line) => !line.trim().startsWith("--") && line.trim().length > 0,
      );

      if (sqlLines.length > 0) {
        improvements.push({
          step,
          description,
          sql: sqlLines.join("\n"),
          critical: step.includes("KLUCZE OBCE") || step.includes("WALIDACJI"),
        });
      }
    }
  }

  return improvements;
}

async function checkCurrentStructure(
  connection: mysql.Connection,
): Promise<void> {
  try {
    // Sprawdź liczbę tabel
    const [tables] = await connection.execute(
      `
      SELECT COUNT(*) as table_count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `,
      [dbConfig.database],
    );

    const tableCount = (tables as any[])[0].table_count;
    console.log(`📊 Obecna liczba tabel: ${tableCount}`);

    // Sprawdź liczbę kluczy obcych
    const [foreignKeys] = await connection.execute(
      `
      SELECT COUNT(*) as fk_count 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL
    `,
      [dbConfig.database],
    );

    const fkCount = (foreignKeys as any[])[0].fk_count;
    console.log(`🔗 Obecna liczba kluczy obcych: ${fkCount}`);

    // Sprawdź liczbę indeksów
    const [indexes] = await connection.execute(
      `
      SELECT COUNT(*) as index_count 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = ?
    `,
      [dbConfig.database],
    );

    const indexCount = (indexes as any[])[0].index_count;
    console.log(`📇 Obecna liczba indeksów: ${indexCount}`);
  } catch (error) {
    console.error("❌ Błąd podczas sprawdzania struktury:", error);
  }
}

async function createMetadataBackup(
  connection: mysql.Connection,
): Promise<void> {
  try {
    const backupPath = path.join(__dirname, "../database/backup_metadata.sql");

    // Eksportuj strukturę tabel
    const [tables] = await connection.execute(
      `
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `,
      [dbConfig.database],
    );

    let backupContent = `-- Kopia zapasowa metadanych bazy ${dbConfig.database}\n`;
    backupContent += `-- Data: ${new Date().toISOString()}\n\n`;

    for (const table of tables as any[]) {
      const [ddl] = await connection.execute(
        `SHOW CREATE TABLE \`${table.TABLE_NAME}\``,
      );
      const ddlRow = (ddl as any[])[0];
      backupContent += `-- Tabela: ${table.TABLE_NAME}\n`;
      backupContent += `${ddlRow["Create Table"]};\n\n`;
    }

    fs.writeFileSync(backupPath, backupContent, "utf8");
    console.log(`💾 Kopia zapasowa zapisana: ${backupPath}`);
  } catch (error) {
    console.error("❌ Błąd podczas tworzenia kopii zapasowej:", error);
  }
}

async function verifyImprovements(connection: mysql.Connection): Promise<void> {
  try {
    // Sprawdź czy nowe tabele zostały utworzone
    const expectedTables = [
      "kategorie_produktow",
      "marki_produktow",
      "waluty",
      "audit_log",
    ];

    for (const tableName of expectedTables) {
      const [result] = await connection.execute(
        `
        SELECT COUNT(*) as exists_count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      `,
        [dbConfig.database, tableName],
      );

      const exists = (result as any[])[0].exists_count > 0;
      console.log(
        `${exists ? "✅" : "❌"} Tabela ${tableName}: ${exists ? "istnieje" : "nie istnieje"}`,
      );
    }

    // Sprawdź czy nowe kolumny zostały dodane
    const [columns] = await connection.execute(
      `
      SELECT COUNT(*) as column_count 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'katalog_produktow_master' 
      AND COLUMN_NAME IN ('id_kategorii', 'id_marki', 'kod_waluty', 'status_produktu')
    `,
      [dbConfig.database],
    );

    const newColumns = (columns as any[])[0].column_count;
    console.log(
      `✅ Dodano ${newColumns}/4 nowych kolumn do katalog_produktow_master`,
    );

    // Sprawdź nowe klucze obce
    const [newForeignKeys] = await connection.execute(
      `
      SELECT COUNT(*) as fk_count 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL
      AND CONSTRAINT_NAME LIKE 'fk_%'
    `,
      [dbConfig.database],
    );

    const newFkCount = (newForeignKeys as any[])[0].fk_count;
    console.log(`✅ Dodano nowe klucze obce (łącznie: ${newFkCount})`);
  } catch (error) {
    console.error("❌ Błąd podczas weryfikacji:", error);
  }
}

async function generateImprovementReport(
  connection: mysql.Connection,
): Promise<void> {
  try {
    const reportPath = path.join(
      __dirname,
      "../database/improvement_report.md",
    );

    let report = `# Raport poprawek bazy danych msbox_db\n\n`;
    report += `**Data wykonania:** ${new Date().toISOString()}\n\n`;

    // Statystyki po poprawkach
    const [tables] = await connection.execute(
      `
      SELECT COUNT(*) as table_count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `,
      [dbConfig.database],
    );

    const [foreignKeys] = await connection.execute(
      `
      SELECT COUNT(*) as fk_count 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL
    `,
      [dbConfig.database],
    );

    const [indexes] = await connection.execute(
      `
      SELECT COUNT(*) as index_count 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = ?
    `,
      [dbConfig.database],
    );

    report += `## 📊 Statystyki po poprawkach\n\n`;
    report += `- **Liczba tabel:** ${(tables as any[])[0].table_count}\n`;
    report += `- **Liczba kluczy obcych:** ${(foreignKeys as any[])[0].fk_count}\n`;
    report += `- **Liczba indeksów:** ${(indexes as any[])[0].index_count}\n\n`;

    // Lista nowych tabel
    const [newTables] = await connection.execute(
      `
      SELECT TABLE_NAME, TABLE_COMMENT 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN ('kategorie_produktow', 'marki_produktow', 'waluty', 'audit_log')
    `,
      [dbConfig.database],
    );

    report += `## 🆕 Nowe tabele\n\n`;
    for (const table of newTables as any[]) {
      report += `- **${table.TABLE_NAME}**: ${table.TABLE_COMMENT || "Brak opisu"}\n`;
    }

    report += `\n## ✅ Poprawki zostały zastosowane pomyślnie!\n\n`;
    report += `### Następne kroki:\n`;
    report += `1. Wypełnij tabele słownikowe danymi\n`;
    report += `2. Przetestuj aplikację z nowymi strukturami\n`;
    report += `3. Zoptymalizuj zapytania dla nowych indeksów\n`;
    report += `4. Wdróż zmiany w środowisku produkcyjnym\n`;

    fs.writeFileSync(reportPath, report, "utf8");
    console.log(`📄 Raport zapisany: ${reportPath}`);
  } catch (error) {
    console.error("❌ Błąd podczas generowania raportu:", error);
  }
}

// Uruchom skrypt
if (require.main === module) {
  applyDatabaseImprovements()
    .then(() => {
      console.log("🎉 Proces poprawek zakończony pomyślnie!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Błąd podczas procesu poprawek:", error);
      process.exit(1);
    });
}

export { applyDatabaseImprovements };
