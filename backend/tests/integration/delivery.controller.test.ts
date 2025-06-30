import request from "supertest";
import { app } from "../../src/server";
import { sequelize } from "../../src/config/database";
import path from "path";
import fs from "fs";
import XLSX from "xlsx";
import { DostNowaDostawa } from "../../src/models/deliveries/DostNowaDostawa";
import { DostDostawyProdukty } from "../../src/models/deliveries/DostDostawyProdukty";
import { AuthDostawcy } from "../../src/models/auth/AuthDostawcy";
import { AuthPracownicy } from "../../src/models/auth/AuthPracownicy";
import { AuthDaneAutoryzacji } from "../../src/models/auth/AuthDaneAutoryzacji";
import jwt from "jsonwebtoken";

describe("Delivery Controller - File Upload Integration", () => {
  let supplierToken: string;
  let staffToken: string;
  let adminToken: string;
  let supplierId: string;
  let testFilePath: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Tworzenie testowych użytkowników
    const supplier = await AuthDostawcy.create({
      id_dostawcy: "SUP00001",
      nazwa_firmy: "Test Supplier Ltd.",
      imie_kontaktu: "Jan",
      nazwisko_kontaktu: "Kowalski",
      numer_nip: "1234567890",
      adres_email: "supplier@test.com",
      telefon: "+48123456789",
      adres_ulica: "Test Street",
      adres_numer_budynku: "123",
      adres_miasto: "Warsaw",
      adres_kod_pocztowy: "00-001",
      adres_kraj: "Polska",
    });

    const staff = await AuthPracownicy.create({
      id_pracownika: "STF00001",
      imie: "Jan",
      nazwisko: "Kowalski",
      rola: "staff",
      adres_email: "staff@test.com",
      telefon: "+48123456789",
    });

    const admin = await AuthPracownicy.create({
      id_pracownika: "ADM00001",
      imie: "Anna",
      nazwisko: "Nowak",
      rola: "admin",
      adres_email: "admin@test.com",
      telefon: "+48123456789",
    });

    supplierId = supplier.id_dostawcy;

    // Tworzenie rekordów autoryzacji dla użytkowników
    const supplierAuth = await AuthDaneAutoryzacji.create({
      id_logowania: "LOG00001",
      id_uzytkownika: supplier.id_dostawcy,
      adres_email: supplier.adres_email,
      hash_hasla: "$2b$10$test", // Fake hash
      rola_uzytkownika: "supplier",
      nieudane_proby_logowania: 0,
      ostatnie_logowanie: new Date(),
    });

    const staffAuth = await AuthDaneAutoryzacji.create({
      id_logowania: "LOG00002",
      id_uzytkownika: staff.id_pracownika,
      adres_email: staff.adres_email,
      hash_hasla: "$2b$10$test", // Fake hash
      rola_uzytkownika: "staff",
      nieudane_proby_logowania: 0,
      ostatnie_logowanie: new Date(),
    });

    const adminAuth = await AuthDaneAutoryzacji.create({
      id_logowania: "LOG00003",
      id_uzytkownika: admin.id_pracownika,
      adres_email: admin.adres_email,
      hash_hasla: "$2b$10$test", // Fake hash
      rola_uzytkownika: "admin",
      nieudane_proby_logowania: 0,
      ostatnie_logowanie: new Date(),
    });

    // Generowanie tokenów JWT
    const jwtSecret = process.env.JWT_SECRET || "msbox-secret-key";
    supplierToken = jwt.sign(
      {
        id_logowania: supplierAuth.id_logowania,
        id_uzytkownika: supplier.id_dostawcy,
        adres_email: supplier.adres_email,
        rola_uzytkownika: "supplier",
      },
      jwtSecret,
      { expiresIn: "24h" },
    );

    staffToken = jwt.sign(
      {
        id_logowania: staffAuth.id_logowania,
        id_uzytkownika: staff.id_pracownika,
        adres_email: staff.adres_email,
        rola_uzytkownika: "staff",
      },
      jwtSecret,
      { expiresIn: "24h" },
    );

    adminToken = jwt.sign(
      {
        id_logowania: adminAuth.id_logowania,
        id_uzytkownika: admin.id_pracownika,
        adres_email: admin.adres_email,
        rola_uzytkownika: "admin",
      },
      jwtSecret,
      { expiresIn: "24h" },
    );
  });

  afterAll(async () => {
    // Czyszczenie plików testowych
    if (testFilePath && fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    await sequelize.close();
  });

  beforeEach(async () => {
    // Czyszczenie danych przed każdym testem
    await DostDostawyProdukty.destroy({ where: {} });
    await DostNowaDostawa.destroy({ where: {} });
  });

  describe("POST /api/deliveries/upload", () => {
    it("should upload Amazon Basics Excel file successfully", async () => {
      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSXFile(
        testData,
        "Amazon_Basics_PL10023609_23669-656.xlsx",
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "PL10023609")
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: "Plik został pomyślnie przesłany i przetworzony",
        data: {
          id_dostawy: "DST/PL10023609",
          id_dostawcy: supplierId,
          nazwa_pliku: "Amazon_Basics_PL10023609_23669-656.xlsx",
          nr_palet_dostawy: "23669-656",
          status_weryfikacji: "nowa",
          liczba_produktow: 3,
          wartosc_calkowita: expect.any(Number),
        },
      });

      // Weryfikacja w bazie danych
      const delivery = await DostNowaDostawa.findByPk("DST/PL10023609");
      expect(delivery).toBeTruthy();
      expect(delivery?.id_dostawcy).toBe(supplierId);

      const products = await DostDostawyProdukty.findAll({
        where: { id_dostawy: "DST/PL10023609" },
      });
      expect(products.length).toBe(3);
    });

    it("should upload kitchen items Excel file with LPN codes", async () => {
      const testData = createKitchenItemsData();
      testFilePath = createTestXLSXFile(
        testData,
        "Kitchen_Items_AM38160_90029531567.xlsx",
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "AM38160")
        .expect(201);

      expect(response.body.data.id_dostawy).toBe("DST/AM38160");
      expect(response.body.data.nr_palet_dostawy).toBe("AM38160_90029531567");

      const products = await DostDostawyProdukty.findAll({
        where: { id_dostawy: "DST/AM38160" },
      });

      const catitProduct = products.find((p) =>
        p.nazwa_produktu.includes("Catit Pixi Smart Feeder"),
      );
      expect(catitProduct).toBeTruthy();
      expect(catitProduct?.LPN).toBe("LPNHE919225404");
      expect(parseFloat(String(catitProduct?.cena_produktu_spec))).toBe(98.24);
    });

    it("should require delivery number confirmation", async () => {
      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSXFile(
        testData,
        "Amazon_Basics_NoNumber_Products.xlsx", // ← Nazwa BEZ numeru dostawy
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        // Brak potwierdzenia numeru dostawy
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error:
          "Nie można wyodrębnić numeru dostawy z nazwy pliku. Proszę podać numer dostawy ręcznie.",
      });
    });

    it("should accept manual delivery number when not detected from filename", async () => {
      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSXFile(
        testData,
        "Amazon_Basics_NoNumber_Products.xlsx", // ← Nazwa BEZ numeru dostawy
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "PL10023609") // ← Użytkownik podaje numer ręcznie
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: "Plik został pomyślnie przesłany i przetworzony",
        data: {
          id_dostawy: "DST/PL10023609",
          id_dostawcy: supplierId,
          nazwa_pliku: "Amazon_Basics_NoNumber_Products.xlsx",
          status_weryfikacji: "nowa",
        },
      });
    });

    it("should validate delivery number confirmation", async () => {
      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSXFile(
        testData,
        "Amazon_Basics_PL10023609_23669-656.xlsx",
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "WRONG_NUMBER") // Nieprawidłowy numer
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error:
          "Potwierdzony numer dostawy nie zgadza się z wykrytym numerem PL10023609",
      });
    });

    it("should handle file size limits", async () => {
      // Tworzenie bardzo dużego pliku (symulacja) - 50,000 produktów = ~12-15MB
      const largeData = Array(50000)
        .fill(null)
        .map((_, i) => ({
          "NR Palety": `LARGE${i}`,
          "Item Desc": `Large Product ${i} with very long description to increase file size significantly for testing purposes`,
          EAN: `123456789${i.toString().padStart(4, "0")}`, // 13 znaków max
          ASIN: `B0LARGE${i.toString().padStart(3, "0")}`,
          ilosc: 1,
          WARTOŚĆ: 10.0,
        }));

      testFilePath = createTestXLSXFile(largeData, "Large_File.xlsx");

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "LARGE")
        .expect(413); // Payload Too Large

      expect(response.body).toMatchObject({
        success: false,
        error: "Plik jest zbyt duży. Maksymalny rozmiar to 10MB",
      });
    });

    it("should validate file format", async () => {
      // Tworzenie pliku tekstowego zamiast Excel
      testFilePath = path.join(__dirname, "invalid_file.txt");
      fs.writeFileSync(testFilePath, "This is not an Excel file");

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "TEST")
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error:
          "Nieprawidłowy format pliku. Obsługiwane formaty: .xlsx, .xls, .xlsm",
      });
    });

    it("should handle missing file", async () => {
      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .field("confirmDeliveryNumber", "TEST")
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Brak pliku do przesłania",
      });
    });

    it("should prevent duplicate delivery upload", async () => {
      // Najpierw utwórz dostawę
      await DostNowaDostawa.create({
        id_dostawy: "DST/PL10023609",
        id_dostawcy: supplierId,
        id_pliku: "PLK/001/DST/PL10023609",
        nazwa_pliku: "existing_file.xlsx",
        url_pliku_S3: "https://s3.example.com/existing_file.xlsx",
        nr_palet_dostawy: "23669-656",
        status_weryfikacji: "nowa",
      });

      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSXFile(
        testData,
        "Duplicate_PL10023609_23669-656.xlsx",
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "PL10023609")
        .expect(409);

      expect(response.body).toMatchObject({
        success: false,
        error: "Dostawa o numerze DST/PL10023609 już istnieje",
      });
    });

    it("should require authentication", async () => {
      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSXFile(testData, "No_Auth_Test.xlsx");

      const response = await request(app)
        .post("/api/deliveries/upload")
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "NOAUTH")
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: "Token uwierzytelnienia nie został podany.",
      });
    });

    it("should allow staff to upload on behalf of supplier", async () => {
      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSXFile(
        testData,
        "Staff_Upload_PL10023609_23669-656.xlsx",
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${staffToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "PL10023609")
        .field("supplierId", supplierId) // Staff może określić dostawcę
        .expect(201);

      expect(response.body.data.id_dostawcy).toBe(supplierId);
    });

    it("should handle Excel file with formulas and formatting", async () => {
      // Tworzenie pliku z formułami Excel
      const ws = XLSX.utils.aoa_to_sheet([
        ["NR Palety", "Item Desc", "EAN", "ASIN", "ilosc", "WARTOŚĆ", "SUMA"],
        [
          "FORMULA123",
          "Test Product with Formula",
          "1234567890123",
          "B0FORMULA1",
          2,
          15.99,
          "=E2*F2",
        ],
        [
          "FORMULA123",
          "Another Product",
          "9876543210987",
          "B0FORMULA2",
          3,
          25.5,
          "=E3*F3",
        ],
      ]);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      testFilePath = path.join(__dirname, "Formula_Test.xlsx");
      XLSX.writeFile(wb, testFilePath);

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "FORMULA123")
        .expect(201);

      expect(response.body.data.id_dostawy).toBe("DST/FORMULA123");

      const products = await DostDostawyProdukty.findAll({
        where: { id_dostawy: "DST/FORMULA123" },
      });

      expect(products.length).toBe(2);
      expect(parseFloat(String(products[0].cena_produktu_spec))).toBe(15.99);
      expect(parseFloat(String(products[1].cena_produktu_spec))).toBe(25.5);
    });

    it("should handle XLS format files", async () => {
      const testData = createKitchenItemsData();
      testFilePath = createTestXLSFile(testData, "Kitchen_Items.xls");

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "AM38160")
        .expect(201);

      expect(response.body.data.id_dostawy).toBe("DST/AM38160");
    });

    it("should handle XLSM format files with macros", async () => {
      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSMFile(testData, "Macro_PL10023609_File.xlsm"); // Dodano numer do nazwy

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "PL10023609")
        .expect(201);

      expect(response.body.data.id_dostawy).toBe("DST/PL10023609");
    });

    it("should validate product data integrity", async () => {
      const invalidProductData = [
        {
          "NR Palety": "INVALID001",
          "Item Desc": "", // Pusta nazwa produktu
          EAN: "invalid-ean", // Nieprawidłowy EAN
          ASIN: "", // Pusty ASIN
          ilosc: -1, // Ujemna ilość
          WARTOŚĆ: "not-a-number", // Nieprawidłowa cena
        },
      ];

      testFilePath = createTestXLSXFile(
        invalidProductData,
        "Invalid_Products.xlsx",
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .field("confirmDeliveryNumber", "INVALID001")
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining("Nieprawidłowe dane produktu"),
      });
    });
  });

  describe("GET /api/deliveries/upload/preview", () => {
    it("should preview file without saving to database", async () => {
      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSXFile(
        testData,
        "Preview_PL10023609_Test.xlsx",
      ); // ← Dodano numer do nazwy

      const response = await request(app)
        .post("/api/deliveries/upload/preview")
        .set("Authorization", `Bearer ${supplierToken}`)
        .attach("deliveryFile", testFilePath)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          detectedDeliveryNumber: "PL10023609",
          fileName: "Preview_PL10023609_Test.xlsx",
          totalProducts: 3,
          estimatedValue: expect.any(Number),
          productSample: expect.any(Array),
        },
      });

      // Sprawdzenie czy dane nie zostały zapisane w bazie
      const deliveryCount = await DostNowaDostawa.count();
      expect(deliveryCount).toBe(0);
    });
  });

  // Funkcje pomocnicze
  function createAmazonBasicsData() {
    return [
      {
        "NR Palety": "23669-656",
        "Item Desc":
          "Amazon Basics 'Everyday' Spannbetttuch aus 100%, Baumwolle, 140 x 200 x 30 cm - Hellgrau",
        EAN: "0192233002651",
        ASIN: "B0713SLN3L",
        Stan: "A-Ware",
        Kraj: "DE",
        WARTOŚĆ: 15.99,
        ilosc: 1,
      },
      {
        "NR Palety": "23669-656",
        "Item Desc": "Amazon Basics - Bettwäsche-Set, Mikrofaser, 200 x 200 cm",
        EAN: "0844178061209",
        ASIN: "B07B9S2DL8",
        Stan: "A-Ware",
        Kraj: "DE",
        WARTOŚĆ: 16.29,
        ilosc: 1,
      },
      {
        "NR Palety": "23669-656",
        "Item Desc":
          "Amazon Basics - Verbindungskabel, USB Typ C auf Micro-USB Typ B",
        EAN: "0192233024776",
        ASIN: "B07CWDYP18",
        Stan: "A-Ware",
        Kraj: "DE",
        WARTOŚĆ: 14.99,
        ilosc: 6,
      },
    ];
  }

  function createKitchenItemsData() {
    return [
      {
        "NR Palety": "AM38160_90029531567",
        "Item Desc":
          "Catit Pixi Smart Feeder automatique pour chats, contrôlé par une application, pour 1,2 kg",
        EAN: "15561013666",
        ASIN: "B093MF7X18",
        LPN: "LPNHE919225404",
        ilość: 1,
        "Unit Retail": 98.24,
        DEPARTMENT: "Pet Products",
        CATEGORY: "Habitats & Supplies",
      },
      {
        "NR Palety": "AM38160_90029531567",
        "Item Desc": "VEMER VE794100 OT1 - Thermostat d'ambiance",
        EAN: "8.00795E+12",
        ASIN: "B0BC1BV9J1",
        LPN: "LPNHE924777243",
        ilość: 1,
        "Unit Retail": 88.6,
        DEPARTMENT: "Home",
        CATEGORY: "Housewares",
      },
    ];
  }

  function createTestXLSXFile(data: any[], filename: string): string {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const filePath = path.join(__dirname, filename);
    XLSX.writeFile(wb, filePath);

    return filePath;
  }

  function createTestXLSFile(data: any[], filename: string): string {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const filePath = path.join(__dirname, filename);
    XLSX.writeFile(wb, filePath, { bookType: "xls" });

    return filePath;
  }

  function createTestXLSMFile(data: any[], filename: string): string {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const filePath = path.join(__dirname, filename);
    XLSX.writeFile(wb, filePath, { bookType: "xlsm" });

    return filePath;
  }
});
