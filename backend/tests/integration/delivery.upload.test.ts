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
import { Op } from "sequelize";

describe("Delivery File Upload Tests", () => {
  let supplierToken: string;
  let staffToken: string;
  let supplierId: string;
  let staffId: string;
  let testFilePath: string;

  beforeAll(async () => {
    // Używamy migracji zamiast sync, więc tylko czyścimy tabele
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await AuthDaneAutoryzacji.destroy({ where: {}, truncate: true });
    await AuthDostawcy.destroy({ where: {}, truncate: true });
    await AuthPracownicy.destroy({ where: {}, truncate: true });
    await DostDostawyProdukty.destroy({ where: {}, truncate: true });
    await DostNowaDostawa.destroy({ where: {}, truncate: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    // Tworzenie testowego dostawcy
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

    // Generowanie tokenów JWT
    const jwtSecret = process.env.JWT_SECRET || "msbox-secret-key";
    const supplierTokenData = jwt.sign(
      {
        id_logowania: supplierAuth.id_logowania,
        id_uzytkownika: supplier.id_dostawcy,
        adres_email: supplier.adres_email,
        rola_uzytkownika: "supplier",
      },
      jwtSecret,
      { expiresIn: "24h" },
    );
    supplierToken = `Bearer ${supplierTokenData}`;

    const staffTokenData = jwt.sign(
      {
        id_logowania: staffAuth.id_logowania,
        id_uzytkownika: staff.id_pracownika,
        adres_email: staff.adres_email,
        rola_uzytkownika: "staff",
      },
      jwtSecret,
      { expiresIn: "24h" },
    );
    staffToken = `Bearer ${staffTokenData}`;

    staffId = staff.id_pracownika;
  });

  afterAll(async () => {
    // Czyszczenie po testach
    if (testFilePath && fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    await sequelize.close();
  });

  beforeEach(async () => {
    // Czyszczenie tabel z użyciem truncate i cascade
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await DostDostawyProdukty.truncate({ cascade: true });
    await DostNowaDostawa.truncate({ cascade: true });
    await AuthDostawcy.destroy({
      where: { id_dostawcy: { [Op.not]: supplierId } },
    });
    await AuthDaneAutoryzacji.destroy({
      where: { id_uzytkownika: { [Op.notIn]: [supplierId, staffId] } },
    });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  });

  describe("POST /api/deliveries/upload", () => {
    it("should successfully upload and process XLSX file with Amazon Basics products", async () => {
      // Tworzenie testowego pliku XLSX na podstawie danych CSV
      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSXFile(
        testData,
        "Amazon_Basics_PL10023609_23669-656.xlsx",
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", supplierToken)
        .attach("file", testFilePath)
        .field("id_dostawcy", supplierId)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id_dostawy: "DST/PL10023609",
          id_dostawcy: supplierId,
          nazwa_pliku: "Amazon_Basics_PL10023609_23669-656.xlsx",
          nr_palet_dostawy: "23669-656",
          status_weryfikacji: "nowa",
        },
      });

      // Sprawdzenie czy dostawa została utworzona w bazie
      const delivery = await DostNowaDostawa.findOne({
        where: { id_dostawy: "DST/PL10023609" },
      });
      expect(delivery).toBeTruthy();
      expect(delivery?.id_dostawcy).toBe(supplierId);
      expect(delivery?.nazwa_pliku).toBe(
        "Amazon_Basics_PL10023609_23669-656.xlsx",
      );

      // Sprawdzenie czy produkty zostały dodane
      const products = await DostDostawyProdukty.findAll({
        where: { id_dostawy: "DST/PL10023609" },
      });
      expect(products.length).toBeGreaterThan(0);

      // Sprawdzenie pierwszego produktu
      const firstProduct = products[0];
      expect(firstProduct.nazwa_produktu).toContain("Amazon Basics");
      expect(firstProduct.kod_ean).toBeTruthy();
      expect(firstProduct.kod_asin).toBeTruthy();
      expect(firstProduct.ilosc).toBeGreaterThan(0);
    });

    it("should successfully upload and process XLS file with kitchen items", async () => {
      const testData = createKitchenItemsData();
      testFilePath = createTestXLSFile(
        testData,
        "Kitchen_Items_AM38160_90029531567.xls",
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", supplierToken)
        .attach("file", testFilePath)
        .field("id_dostawcy", supplierId)
        .expect(201);

      expect(response.body.data.id_dostawy).toBe("DST/AM38160");
      expect(response.body.data.nr_palet_dostawy).toBe("AM38160_90029531567");

      // Sprawdzenie produktów kuchennych
      const products = await DostDostawyProdukty.findAll({
        where: { id_dostawy: "DST/AM38160" },
      });

      const catitProduct = products.find((p) =>
        p.nazwa_produktu.includes("Catit Pixi Smart Feeder"),
      );
      expect(catitProduct).toBeTruthy();
      expect(catitProduct?.LPN).toBe("LPNHE919225404");
      expect(
        parseFloat(catitProduct?.cena_produktu_spec as unknown as string),
      ).toBe(98.24);
    });

    it("should handle file with missing delivery number", async () => {
      const testData = createTestDataWithoutDeliveryNumber();
      testFilePath = createTestXLSXFile(testData, "No_Delivery_Number.xlsx");

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", supplierToken)
        .attach("file", testFilePath)
        .field("id_dostawcy", supplierId)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: "Nie można wyodrębnić numeru dostawy z nazwy pliku.",
      });
    });

    it("should validate file format - reject unsupported format", async () => {
      // Tworzenie pliku tekstowego zamiast Excel
      testFilePath = path.join(__dirname, "test.txt");
      fs.writeFileSync(testFilePath, "This is not an Excel file");

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", supplierToken)
        .attach("file", testFilePath)
        .field("id_dostawcy", supplierId)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error:
          "Nieprawidłowy format pliku. Obsługiwane formaty: .xlsx, .xls, .xlsm",
      });
    });

    it("should handle duplicate delivery number", async () => {
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
        .set("Authorization", supplierToken)
        .attach("file", testFilePath)
        .field("id_dostawcy", supplierId)
        .expect(409);

      expect(response.body).toMatchObject({
        success: false,
        error: "Dostawa o numerze DST/PL10023609 już istnieje",
      });
    });

    it("should reject upload from staff for a supplier", async () => {
      // Użyj tokenu pracownika, aby spróbować utworzyć dostawę dla dostawcy
      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", staffToken) // Użyj tokenu pracownika
        .attach("file", testFilePath)
        .field("id_dostawcy", supplierId) // ID dostawcy
        .expect(403);

      expect(response.body.error).toBe("Brak uprawnień do tej dostawy");
    });

    it("should handle large file with many products", async () => {
      console.time("LargeFileTest");

      console.time("createLargeFileTestData");
      const testData = createLargeFileTestData();
      console.timeEnd("createLargeFileTestData");

      console.time("createTestXLSXFile");
      testFilePath = createTestXLSXFile(testData, "Large_File_AM38159.xlsx");
      console.timeEnd("createTestXLSXFile");

      console.time("uploadRequest");
      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", supplierToken)
        .attach("file", testFilePath)
        .field("id_dostawcy", supplierId)
        .expect(201);
      console.timeEnd("uploadRequest");

      expect(response.body.data.id_dostawy).toBe("DST/AM38159");

      console.time("dbQuery");
      const products = await DostDostawyProdukty.findAll({
        where: { id_dostawy: "DST/AM38159" },
      });
      console.timeEnd("dbQuery");

      expect(products.length).toBe(1000);
      console.timeEnd("LargeFileTest");
    }, 150000); // Zwiększony timeout do 150s

    it("should handle file with different column mappings", async () => {
      const testData = createVariantColumnMappingData();
      testFilePath = createTestXLSXFile(
        testData,
        "Variant_Columns_AM12345.xlsx",
      );

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", supplierToken)
        .attach("file", testFilePath)
        .field("id_dostawcy", supplierId)
        .expect(201);

      const products = await DostDostawyProdukty.findAll({
        where: { id_dostawy: response.body.data.id_dostawy },
      });

      // Sprawdzenie czy mapowanie kolumn działa poprawnie
      const product = products[0];
      expect(product.nazwa_produktu).toBeTruthy();
      expect(product.kod_ean).toBeTruthy();
      expect(product.kod_asin).toBeTruthy();
      expect(
        parseFloat(product.cena_produktu_spec as unknown as string),
      ).toBeGreaterThan(0);
    });
  });

  describe("File Upload Processing", () => {
    it("should extract delivery number from Amazon Basics filename", () => {
      const filename =
        "Dostawa magazyn Wiktor 16.05.2025r Amazon Basics PL10023609_23669-656.xlsx";
      const deliveryNumber =
        DostNowaDostawa.extractDeliveryNumberFromFilename(filename);

      expect(deliveryNumber).toBe("PL10023609");
    });

    it("should extract delivery number from kitchen items filename", () => {
      const filename =
        "Dostawa magazyn Wiktor 16.05.2025r drobne artykuły kuchenne AM38160_90029531567.xlsx";
      const deliveryNumber =
        DostNowaDostawa.extractDeliveryNumberFromFilename(filename);

      expect(deliveryNumber).toBe("AM38160");
    });

    it("should extract delivery number from electronics filename", () => {
      const filename =
        "Dostawa magazyn Wiktor 16.05.2025r elektronika i gry przenośne (lot AM38159 - 4 pall).xlsx";
      const deliveryNumber =
        DostNowaDostawa.extractDeliveryNumberFromFilename(filename);

      expect(deliveryNumber).toBe("AM38159");
    });

    it("should generate correct delivery ID format", () => {
      const deliveryId = DostNowaDostawa.generateDeliveryId("PL10023609");
      expect(deliveryId).toBe("DST/PL10023609");
    });

    it("should generate correct file ID format", () => {
      const fileId = DostNowaDostawa.generateIdPliku(1, "DST/PL10023609");
      expect(fileId).toBe("PLK/001/DST/PL10023609");
    });
  });

  describe("Excel File Processing", () => {
    it("should process Amazon Basics Excel data correctly", async () => {
      const testData = createAmazonBasicsData();
      testFilePath = createTestXLSXFile(testData, "Amazon_Basics_Test.xlsx");

      // Symulacja przetwarzania pliku
      const workbook = XLSX.readFile(testFilePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      expect(jsonData.length).toBe(3);
      expect(jsonData[0]).toMatchObject({
        "NR Palety": "23669-656",
        "Item Desc": expect.stringContaining("Amazon Basics"),
        EAN: "0192233002651",
        ASIN: "B08K3P153S",
        WARTOŚĆ: 15.99,
      });
    });

    it("should process kitchen items Excel data with LPN correctly", async () => {
      const testData = createKitchenItemsData();
      testFilePath = createTestXLSXFile(testData, "Kitchen_Items_Test.xlsx");

      const workbook = XLSX.readFile(testFilePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      expect(jsonData.length).toBe(2);

      const catitProduct = jsonData.find(
        (item: any) =>
          item["Item Desc"] &&
          item["Item Desc"].includes("Catit Pixi Smart Feeder"),
      );

      expect(catitProduct).toMatchObject({
        "NR Palety": "AM38160_90029531567",
        LPN: "LPNHE919225404",
        "Unit Retail": 98.24,
        DEPARTMENT: "Pet Products",
      });
    });

    it("should handle different Excel file formats", async () => {
      const testData = createAmazonBasicsData();

      // Test XLSX
      const xlsxPath = createTestXLSXFile(testData, "test.xlsx");
      expect(fs.existsSync(xlsxPath)).toBe(true);

      // Test XLS
      const xlsPath = createTestXLSFile(testData, "test.xls");
      expect(fs.existsSync(xlsPath)).toBe(true);

      // Cleanup
      fs.unlinkSync(xlsxPath);
      fs.unlinkSync(xlsPath);
    });

    it("should validate product data structure", () => {
      const validProduct = {
        "NR Palety": "23669-656",
        "Item Desc": "Test Product",
        EAN: "1234567890123",
        ASIN: "B0TESTPROD",
        WARTOŚĆ: 19.99,
        ilosc: 2,
      };

      // Test walidacji (będzie zaimplementowana w serwisie)
      expect(validProduct["NR Palety"]).toBeTruthy();
      expect(validProduct["Item Desc"]).toBeTruthy();
      expect(validProduct["EAN"]).toMatch(/^\d{13}$/);
      expect(validProduct["ASIN"]).toMatch(/^B0[A-Z0-9]{8}$/);
      expect(typeof validProduct["WARTOŚĆ"]).toBe("number");
      expect(validProduct["WARTOŚĆ"]).toBeGreaterThan(0);
    });

    it("should handle missing or invalid data gracefully", () => {
      // Funkcja pomocnicza do walidacji produktu
      const isValidProduct = (product: any): boolean => {
        return (
          product &&
          typeof product["NR Palety"] === "string" &&
          product["NR Palety"].trim() !== "" &&
          typeof product["Item Desc"] === "string" &&
          product["Item Desc"].trim() !== "" &&
          typeof product["EAN"] === "string" &&
          /^\d{13}$/.test(product["EAN"]) &&
          typeof product["ASIN"] === "string" &&
          /^B0[A-Z0-9]{8}$/.test(product["ASIN"]) &&
          typeof product["WARTOŚĆ"] === "number" &&
          product["WARTOŚĆ"] > 0 &&
          typeof product["ilosc"] === "number" &&
          product["ilosc"] > 0
        );
      };

      const invalidProductMissingName = {
        "NR Palety": "23669-656",
        "Item Desc": "",
        EAN: "1234567890123",
        ASIN: "B0TESTPROD",
        WARTOŚĆ: 19.99,
        ilosc: 2,
      };

      const invalidProductBadEan = {
        "NR Palety": "23669-656",
        "Item Desc": "Test Product",
        EAN: "not-an-ean",
        ASIN: "B0TESTPROD",
        WARTOŚC: 19.99,
        ilosc: 2,
      };

      expect(isValidProduct(invalidProductMissingName)).toBe(false);
      expect(isValidProduct(invalidProductBadEan)).toBe(false);
    });
  });

  describe("Database Integration", () => {
    it("should create delivery with generated ID", async () => {
      const deliveryData = {
        id_dostawy: "DST/PL10023609",
        id_dostawcy: supplierId,
        id_pliku: "PLK/001/DST/PL10023609",
        nazwa_pliku: "Test_Amazon_Basics.xlsx",
        url_pliku_S3: "https://test-bucket.s3.amazonaws.com/test-file.xlsx",
        nr_palet_dostawy: "23669-656",
        status_weryfikacji: "nowa" as const,
      };

      const delivery = await DostNowaDostawa.create(deliveryData);

      expect(delivery.id_dostawy).toBe("DST/PL10023609");
      expect(delivery.id_dostawcy).toBe(supplierId);
      expect(delivery.status_weryfikacji).toBe("nowa");
    });

    it("should create products for delivery", async () => {
      // Najpierw utwórz dostawę
      const delivery = await DostNowaDostawa.create({
        id_dostawy: "DST/TEST001",
        id_dostawcy: supplierId,
        id_pliku: "PLK/001/DST/TEST001",
        nazwa_pliku: "Test_Products.xlsx",
        url_pliku_S3: "https://test-bucket.s3.amazonaws.com/test-products.xlsx",
        nr_palet_dostawy: "TEST001",
        status_weryfikacji: "nowa",
      });

      // Następnie dodaj produkty
      const productData = {
        id_dostawy: "DST/TEST001",
        nr_palety: "TEST001",
        nazwa_produktu: "Test Product",
        kod_ean: "1234567890123",
        kod_asin: "B0TESTPROD",
        ilosc: 10,
        cena_produktu_spec: 19.99,
        stan_produktu: "nowy",
        kraj_pochodzenia: "PL",
      };

      const product = await DostDostawyProdukty.create(productData);

      expect(product).toBeTruthy();
      expect(product.id_dostawy).toBe("DST/TEST001");
      expect(product.nazwa_produktu).toBe("Test Product");
      expect(product.kod_ean).toBe("1234567890123");
      expect(product.kod_asin).toBe("B0TESTPROD");
      expect(product.cena_produktu_spec).toBe(19.99);
    });

    it("should prevent duplicate delivery IDs", async () => {
      // 1. Utwórz pierwszą dostawę
      await DostNowaDostawa.create({
        id_dostawy: "DST/DUP123",
        id_dostawcy: supplierId,
        id_pliku: "PLK/001/DST/DUP123",
        nazwa_pliku: "Duplicate_1.xlsx",
        url_pliku_S3: "s3://test/file1.xlsx",
      });

      // 2. Spróbuj utworzyć drugą dostawę z tym samym ID poprzez upload
      const testData = createAmazonBasicsData(); // Dane nie mają znaczenia
      testFilePath = createTestXLSXFile(testData, "delivery_DUP123_test.xlsx");

      const response = await request(app)
        .post("/api/deliveries/upload")
        .set("Authorization", supplierToken)
        .attach("file", testFilePath)
        .field("id_dostawcy", supplierId)
        .expect(409);

      expect(response.body.error).toContain("Dostawa o numerze DST/DUP123");
    });
  });

  // Funkcje pomocnicze do tworzenia testowych danych
  type TestProduct = Record<string, string | number | null | undefined>;

  /**
   * Tworzy dane testowe dla produktów Amazon Basics
   */
  function createAmazonBasicsData(): TestProduct[] {
    return [
      {
        "NR Palety": "23669-656",
        "Item Desc":
          "Amazon Basics 'Everyday' Spannbetttuch aus 100%, Baumwolle, 140 x 200 x 30 cm - Hellgrau",
        EAN: "0192233002651",
        ASIN: "B08K3P153S",
        Stan: "A-Ware",
        Kraj: "DE",
        WARTOŚĆ: 15.99,
        ilosc: 1,
      },
      {
        "NR Palety": "23669-656",
        "Item Desc":
          "Amazon Basics - Bettwäsche-Set, Mikrofaser, 200 x 200 cm, Leicht Mikrofaser, marineblau, schlichtes Karo",
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
          "Amazon Basics - Verbindungskabel, USB Typ C auf Micro-USB Typ B, USB-2.0-Standard, doppelt geflochtenes Nylon, 0,9 m, Dunkelgrau",
        EAN: "0840095888806",
        ASIN: "B08K3P153S",
        Stan: "A-Ware",
        Kraj: "DE",
        WARTOŚĆ: 7.49,
        ilosc: 1,
      },
    ];
  }

  /**
   * Tworzy dane testowe dla produktów kuchennych
   */
  function createKitchenItemsData(): TestProduct[] {
    return [
      {
        "NR Palety": "AM38160_90029531567",
        "Item Desc":
          "Catit Pixi Smart Feeder automatique pour chats, contrôlé par une application, pour 1,2 kg",
        LPN: "LPNHE919225404",
        ilość: 1,
        "Unit Retail": 98.24,
        DEPARTMENT: "Pet Products",
        CATEGORY: "Habitats & Supplies",
      },
      {
        "NR Palety": "AM38160_90029531567",
        "Item Desc":
          "VEMER VE794100 OT1 - Thermostat d'ambiance hebdomadaire modulant pour chaudière avec protocole OpenTherm, Blanc",
        LPN: "LPNRR135792468",
        ilość: 1,
        "Unit Retail": 88.6,
        DEPARTMENT: "Home",
        CATEGORY: "Housewares",
      },
    ];
  }

  /**
   * Tworzy dane testowe bez numeru dostawy
   */
  function createTestDataWithoutDeliveryNumber(): TestProduct[] {
    return [
      {
        "NR Palety": "UNKNOWN_PALETTE",
        "Item Desc": "Test Product Without Delivery Number",
        EAN: "1234567890123",
        ASIN: "B000000000",
        Stan: "A-Ware",
        Kraj: "DE",
        WARTOŚĆ: 10.0,
        ilosc: 1,
      },
    ];
  }

  /**
   * Tworzy dane testowe dla dużego pliku
   */
  function createLargeFileTestData(): TestProduct[] {
    const data: TestProduct[] = [];
    for (let i = 1; i <= 1000; i++) {
      data.push({
        "NR Palety": "AM38159_90029568233",
        "Item Desc": `Test Product ${i}`,
        EAN: `123456789012${i.toString().padStart(3, "0")}`,
        ASIN: `B00000000${i.toString().padStart(1, "0")}`,
        LPN: `LPNTEST${i.toString().padStart(6, "0")}`,
        "Unit Retail": Math.round((Math.random() * 100 + 10) * 100) / 100,
        ilosc: Math.floor(Math.random() * 5) + 1,
      });
    }
    return data;
  }

  /**
   * Tworzy dane testowe z różnymi nazwami kolumn
   */
  function createVariantColumnMappingData(): TestProduct[] {
    return [
      {
        "Numer Palety": "TEST123_456789",
        "Nazwa Produktu": "Test Product with Different Column Names",
        "Kod EAN": "1234567890123",
        "Kod ASIN": "B000000001",
        LPN_NUMBER: "LPNVARTEST001",
        Price: 25.5,
        Quantity: 2,
        Condition: "New",
        Country: "PL",
      },
    ];
  }

  /**
   * @returns {string} Ścieżka do utworzonego pliku
   */
  function createTestXLSXFile(data: TestProduct[], filename: string): string {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dostawa");

    const filePath = path.join(__dirname, filename);
    XLSX.writeFile(wb, filePath);
    return filePath;
  }

  /**
   * Tworzy testowy plik XLS
   * @param {TestProduct[]} data - Dane do zapisu
   * @param {string} filename - Nazwa pliku
   * @returns {string} Ścieżka do utworzonego pliku
   */
  function createTestXLSFile(data: TestProduct[], filename: string): string {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dostawa");

    const filePath = path.join(__dirname, filename);
    XLSX.writeFile(wb, filePath);
    return filePath;
  }
});
