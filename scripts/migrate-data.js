import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// --- KONFIGURACJA ---
// Ustawienie ścieżki do pliku .env w folderze backendu Strapi
dotenv.config({ path: "./strapi-backend/.env" });

// Hasła tekstowe podane przez użytkownika
const plainTextPasswords = {
  "admin@msbox.com": "admin",
  "pracownik@msbox.com": "pracownik",
  "firma@przyklad.pl": "dostawca",
  "wiktor.zawadzki@gmail.com": "admin", // Domyślne hasło dla drugiego admina
};

// --- DANE ŹRÓDŁOWE (Z PLIKÓW JSON) ---
const authData = [
  {
    id_logowania: "ADM/00001/LOG",
    id_uzytkownika: "ADM/00001",
    adres_email: "admin@msbox.com",
    rola_uzytkownika: "admin",
  },
  {
    id_logowania: "ADM/00002/LOG",
    id_uzytkownika: "ADM/00002",
    adres_email: "wiktor.zawadzki@gmail.com",
    rola_uzytkownika: "admin",
  },
  {
    id_logowania: "STF/00001/LOG",
    id_uzytkownika: "STF/00001",
    adres_email: "pracownik@msbox.com",
    rola_uzytkownika: "staff",
  },
  {
    id_logowania: "SUP/00001/LOG",
    id_uzytkownika: "SUP/00001",
    adres_email: "firma@przyklad.pl",
    rola_uzytkownika: "supplier",
  },
];

const staffData = [
  {
    id_pracownika: "ADM/00001",
    imie: "Admin",
    nazwisko: "System",
    rola: "admin",
    adres_email: "admin@msbox.com",
    telefon: "500100200",
  },
  {
    id_pracownika: "ADM/00002",
    imie: "Wiktor",
    nazwisko: "Zawadzki",
    rola: "admin",
    adres_email: "wiktor.zawadzki@gmail.com",
    telefon: "515227639",
  },
  {
    id_pracownika: "STF/00001",
    imie: "Jan",
    nazwisko: "Pracownik",
    rola: "staff",
    adres_email: "pracownik@msbox.com",
    telefon: "500300400",
  },
];

const supplierData = [
  {
    id_dostawcy: "SUP/00001",
    nazwa_firmy: "Firma Przykładowa Sp. z o.o.",
    imie_kontaktu: "Jan",
    nazwisko_kontaktu: "Dostawca",
    numer_nip: "5252363635",
    adres_email: "firma@przyklad.pl",
    telefon: "500600700",
    strona_www: "www.firma-przykladowa.pl",
    adres_ulica: "Przykładowa",
    adres_numer_budynku: "10",
    adres_numer_lokalu: "5",
    adres_miasto: "Warszawa",
    adres_kod_pocztowy: "00-001",
    adres_kraj: "Polska",
  },
  {
    id_dostawcy: "SUP/00002",
    nazwa_firmy: "F.H.U Restock Wiktor Zawadza",
    imie_kontaktu: "Wiktor",
    nazwisko_kontaktu: "Zawadzki",
    numer_nip: "1562145689",
    adres_email: "wiktor.test@gmail.com",
    telefon: "456789456",
    strona_www: "www.paletamix.pl",
    adres_ulica: "Ul.kordeckiego",
    adres_numer_budynku: "1",
    adres_numer_lokalu: null,
    adres_miasto: "Nieporęt",
    adres_kod_pocztowy: "05-126",
    adres_kraj: "Polska",
  },
];

// Główna funkcja migracyjna
async function migrateData() {
  let connection;
  console.log("🚀 Rozpoczynanie migracji danych...");

  try {
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || "3306", 10),
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });
    await connection.beginTransaction();
    console.log("✅ Połączono z bazą danych i rozpoczęto transakcję.");

    // Czyszczenie starych danych, aby uniknąć konfliktów
    console.log("🧹 Czyszczenie istniejących danych...");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0;");
    await connection.execute("DELETE FROM up_users_role_lnk;");
    await connection.execute("DELETE FROM up_users;");
    await connection.execute("DELETE FROM staff_members;");
    await connection.execute("DELETE FROM suppliers;");
    // Można dodać czyszczenie historii logowań, jeśli jest taka potrzeba
    // await connection.execute("DELETE FROM login_histories;");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("🧹 Istniejące dane użytkowników zostały wyczyszczone.");

    // Mapowanie ról Strapi na ID
    const [roles] = await connection.execute("SELECT id, name FROM up_roles;");
    const roleMap = roles.reduce((acc, role) => {
      acc[role.name.toLowerCase()] = role.id;
      return acc;
    }, {});
    console.log("🗺️ Zmapowano role Strapi:", roleMap);

    // Przechowywanie mapowania starych ID na nowe ID użytkowników Strapi
    const userIdMap = {};

    console.log("\n--- Rozpoczynanie migracji użytkowników (up_users) ---");
    for (const user of authData) {
      const password = plainTextPasswords[user.adres_email] || "Password123!"; // hasło domyślne
      const hashedPassword = await bcrypt.hash(password, 10);
      const username = user.adres_email.split("@")[0];
      const roleName =
        user.rola_uzytkownika === "admin"
          ? "authenticated"
          : user.rola_uzytkownika; // Admini też muszą mieć rolę 'authenticated'

      const [result] = await connection.execute(
        "INSERT INTO up_users (username, email, provider, password, confirmed, blocked, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
        [username, user.adres_email, "local", hashedPassword, true, false],
      );
      const newUserId = result.insertId;
      userIdMap[user.id_uzytkownika] = newUserId;
      console.log(
        `👤 Utworzono użytkownika: ${user.adres_email} (ID: ${newUserId})`,
      );

      // Przypisanie roli 'Authenticated'
      await connection.execute(
        "INSERT INTO up_users_role_lnk (user_id, role_id) VALUES (?, ?)",
        [newUserId, roleMap["authenticated"]],
      );
      console.log(`🔗 Przypisano rolę 'Authenticated' do ${user.adres_email}`);

      // Jeśli użytkownik to admin, przypisz dodatkowo rolę Super Admin
      if (user.rola_uzytkownika === "admin") {
        await connection.execute(
          "INSERT INTO up_users_role_lnk (user_id, role_id) VALUES (?, ?)",
          [newUserId, roleMap["admin"]],
        );
        console.log(`👑 Przypisano rolę 'Admin' do ${user.adres_email}`);
      }
    }

    console.log("\n--- Rozpoczynanie migracji pracowników (staff_members) ---");
    for (const staff of staffData) {
      const userId = userIdMap[staff.id_pracownika];
      if (userId) {
        // Krok 1: Wstaw dane do głównej tabeli staff_members
        const [result] = await connection.execute(
          "INSERT INTO staff_members (imie, nazwisko, rola, adres_email, telefon, id_pracownika, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())",
          [
            staff.imie,
            staff.nazwisko,
            staff.rola,
            staff.adres_email,
            staff.telefon,
            staff.id_pracownika,
          ],
        );
        const newStaffMemberId = result.insertId;
        console.log(
          `👨‍💼 Utworzono profil pracownika dla: ${staff.adres_email} (ID: ${newStaffMemberId})`,
        );

        // Krok 2: Utwórz wpis w tabeli łączącej
        await connection.execute(
          "INSERT INTO staff_members_user_lnk (staff_member_id, user_id) VALUES (?, ?)",
          [newStaffMemberId, userId],
        );
        console.log(
          `🔗 Połączono pracownika (ID: ${newStaffMemberId}) z użytkownikiem (ID: ${userId})`,
        );
      }
    }

    console.log("\n--- Rozpoczynanie migracji dostawców (suppliers) ---");
    for (const supplier of supplierData) {
      const userId = userIdMap[supplier.id_dostawcy];
      if (userId) {
        // Krok 1: Wstaw dane do głównej tabeli suppliers
        const [result] = await connection.execute(
          "INSERT INTO suppliers (nazwa_firmy, imie_kontaktu, nazwisko_kontaktu, numer_nip, adres_email, telefon, strona_www, adres_ulica, adres_numer_budynku, adres_numer_lokalu, adres_miasto, adres_kod_pocztowy, adres_kraj, id_dostawcy, created_at, updated_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())",
          [
            supplier.nazwa_firmy,
            supplier.imie_kontaktu,
            supplier.nazwisko_kontaktu,
            supplier.numer_nip,
            supplier.adres_email,
            supplier.telefon,
            supplier.strona_www,
            supplier.adres_ulica,
            supplier.adres_numer_budynku,
            supplier.adres_numer_lokalu,
            supplier.adres_miasto,
            supplier.adres_kod_pocztowy,
            supplier.adres_kraj,
            supplier.id_dostawcy,
          ],
        );
        const newSupplierId = result.insertId;
        console.log(
          `🚚 Utworzono profil dostawcy dla: ${supplier.adres_email} (ID: ${newSupplierId})`,
        );

        // Krok 2: Utwórz wpis w tabeli łączącej
        await connection.execute(
          "INSERT INTO suppliers_user_lnk (supplier_id, user_id) VALUES (?, ?)",
          [newSupplierId, userId],
        );
        console.log(
          `🔗 Połączono dostawcę (ID: ${newSupplierId}) z użytkownikiem (ID: ${userId})`,
        );
      }
    }

    await connection.commit();
    console.log(
      "\n🎉 Sukces! Migracja danych zakończona pomyślnie. Zmiany zostały zapisane.",
    );
  } catch (error) {
    if (connection) {
      await connection.rollback();
      console.error(
        "❌ Błąd krytyczny podczas migracji. Zmiany zostały wycofane.",
        error,
      );
    } else {
      console.error("❌ Błąd krytyczny połączenia z bazą danych.", error);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Połączenie z bazą danych zostało zamknięte.");
    }
  }
}

// Uruchom skrypt
migrateData();
