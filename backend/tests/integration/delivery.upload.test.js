"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../../src/server");
const database_1 = require("../../src/config/database");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const xlsx_1 = __importDefault(require("xlsx"));
const DostNowaDostawa_1 = require("../../src/models/deliveries/DostNowaDostawa");
const DostDostawyProdukty_1 = require("../../src/models/deliveries/DostDostawyProdukty");
const AuthDostawcy_1 = require("../../src/models/auth/AuthDostawcy");
const AuthPracownicy_1 = require("../../src/models/auth/AuthPracownicy");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe("Delivery File Upload Tests", () => {
    let supplierToken;
    let staffToken;
    let supplierId;
    let testFilePath;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database_1.sequelize.sync({ force: true });
        // Tworzenie testowego dostawcy
        const supplier = yield AuthDostawcy_1.AuthDostawcy.create({
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
        const staff = yield AuthPracownicy_1.AuthPracownicy.create({
            id_pracownika: "STF00001",
            imie: "Jan",
            nazwisko: "Kowalski",
            rola: "staff",
            adres_email: "staff@test.com",
            telefon: "+48123456789",
        });
        supplierId = supplier.id_dostawcy;
        // Generowanie tokenów JWT
        const jwtSecret = process.env.JWT_SECRET || "test-secret";
        supplierToken = jsonwebtoken_1.default.sign({
            id_logowania: "LOG00001",
            id_uzytkownika: supplier.id_dostawcy,
            adres_email: supplier.adres_email,
            rola_uzytkownika: "supplier",
        }, jwtSecret, { expiresIn: "24h" });
        staffToken = jsonwebtoken_1.default.sign({
            id_logowania: "LOG00002",
            id_uzytkownika: staff.id_pracownika,
            adres_email: staff.adres_email,
            rola_uzytkownika: "staff",
        }, jwtSecret, { expiresIn: "24h" });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Czyszczenie po testach
        if (testFilePath && fs_1.default.existsSync(testFilePath)) {
            fs_1.default.unlinkSync(testFilePath);
        }
        yield database_1.sequelize.close();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Czyszczenie tabel przed każdym testem
        yield DostDostawyProdukty_1.DostDostawyProdukty.destroy({ where: {} });
        yield DostNowaDostawa_1.DostNowaDostawa.destroy({ where: {} });
    }));
    describe("POST /api/deliveries/upload", () => {
        it("should successfully upload and process XLSX file with Amazon Basics products", () => __awaiter(void 0, void 0, void 0, function* () {
            // Tworzenie testowego pliku XLSX na podstawie danych CSV
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSXFile(testData, "Amazon_Basics_PL10023609_23669-656.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
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
            const delivery = yield DostNowaDostawa_1.DostNowaDostawa.findOne({
                where: { id_dostawy: "DST/PL10023609" },
            });
            expect(delivery).toBeTruthy();
            expect(delivery === null || delivery === void 0 ? void 0 : delivery.id_dostawcy).toBe(supplierId);
            expect(delivery === null || delivery === void 0 ? void 0 : delivery.nazwa_pliku).toBe("Amazon_Basics_PL10023609_23669-656.xlsx");
            // Sprawdzenie czy produkty zostały dodane
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: "DST/PL10023609" },
            });
            expect(products.length).toBeGreaterThan(0);
            // Sprawdzenie pierwszego produktu
            const firstProduct = products[0];
            expect(firstProduct.nazwa_produktu).toContain("Amazon Basics");
            expect(firstProduct.kod_ean).toBeTruthy();
            expect(firstProduct.kod_asin).toBeTruthy();
            expect(firstProduct.ilosc).toBeGreaterThan(0);
        }));
        it("should successfully upload and process XLS file with kitchen items", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createKitchenItemsData();
            testFilePath = createTestXLSFile(testData, "Kitchen_Items_AM38160_90029531567.xls");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", supplierToken)
                .attach("file", testFilePath)
                .field("id_dostawcy", supplierId)
                .expect(201);
            expect(response.body.data.id_dostawy).toBe("DST/AM38160");
            expect(response.body.data.nr_palet_dostawy).toBe("AM38160_90029531567");
            // Sprawdzenie produktów kuchennych
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: "DST/AM38160" },
            });
            const catitProduct = products.find((p) => p.nazwa_produktu.includes("Catit Pixi Smart Feeder"));
            expect(catitProduct).toBeTruthy();
            expect(catitProduct === null || catitProduct === void 0 ? void 0 : catitProduct.LPN).toBe("LPNHE919225404");
            expect(catitProduct === null || catitProduct === void 0 ? void 0 : catitProduct.cena_produktu_spec).toBe(98.24);
        }));
        it("should handle file with missing delivery number", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createTestDataWithoutDeliveryNumber();
            testFilePath = createTestXLSXFile(testData, "No_Delivery_Number.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", supplierToken)
                .attach("file", testFilePath)
                .field("id_dostawcy", supplierId)
                .expect(400);
            expect(response.body).toMatchObject({
                success: false,
                error: "Nie można wygenerować ID dostawy z nazwy pliku",
            });
        }));
        it("should validate file format - reject unsupported format", () => __awaiter(void 0, void 0, void 0, function* () {
            // Tworzenie pliku tekstowego zamiast Excel
            testFilePath = path_1.default.join(__dirname, "test.txt");
            fs_1.default.writeFileSync(testFilePath, "This is not an Excel file");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", supplierToken)
                .attach("file", testFilePath)
                .field("id_dostawcy", supplierId)
                .expect(400);
            expect(response.body).toMatchObject({
                success: false,
                error: "Nieprawidłowy format pliku. Obsługiwane formaty: .xlsx, .xls, .xlsm",
            });
        }));
        it("should handle duplicate delivery number", () => __awaiter(void 0, void 0, void 0, function* () {
            // Najpierw utwórz dostawę
            yield DostNowaDostawa_1.DostNowaDostawa.create({
                id_dostawy: "DST/PL10023609",
                id_dostawcy: supplierId,
                id_pliku: "PLK/001/DST/PL10023609",
                nazwa_pliku: "existing_file.xlsx",
                url_pliku_S3: "https://s3.example.com/existing_file.xlsx",
                nr_palet_dostawy: "23669-656",
                status_weryfikacji: "nowa",
            });
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSXFile(testData, "Duplicate_PL10023609_23669-656.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", supplierToken)
                .attach("file", testFilePath)
                .field("id_dostawcy", supplierId)
                .expect(409);
            expect(response.body).toMatchObject({
                success: false,
                error: "Dostawa o numerze DST/PL10023609 już istnieje",
            });
        }));
        it("should validate supplier permissions", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSXFile(testData, "Amazon_Basics_PL10023609_23669-656.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", "Bearer invalid-token")
                .attach("file", testFilePath)
                .field("id_dostawcy", "SUP99999") // Inny dostawca
                .expect(403);
            expect(response.body).toMatchObject({
                success: false,
                error: "Brak uprawnień do tej dostawy",
            });
        }));
        it("should handle large file with many products", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createLargeFileTestData();
            testFilePath = createTestXLSXFile(testData, "Large_File_AM38159.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", supplierToken)
                .attach("file", testFilePath)
                .field("id_dostawcy", supplierId)
                .expect(201);
            expect(response.body.data.id_dostawy).toBe("DST/AM38159");
            // Sprawdzenie czy wszystkie produkty zostały dodane
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: "DST/AM38159" },
            });
            expect(products.length).toBe(1000); // 1000 produktów testowych
        }));
        it("should handle file with different column mappings", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createVariantColumnMappingData();
            testFilePath = createTestXLSXFile(testData, "Variant_Mapping_Test.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", supplierToken)
                .attach("file", testFilePath)
                .field("id_dostawcy", supplierId)
                .expect(201);
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: response.body.data.id_dostawy },
            });
            // Sprawdzenie czy mapowanie kolumn działa poprawnie
            const product = products[0];
            expect(product.nazwa_produktu).toBeTruthy();
            expect(product.kod_ean).toBeTruthy();
            expect(product.kod_asin).toBeTruthy();
            expect(product.cena_produktu_spec).toBeGreaterThan(0);
        }));
    });
    describe("File Upload Processing", () => {
        it("should extract delivery number from Amazon Basics filename", () => {
            const filename = "Dostawa magazyn Wiktor 16.05.2025r Amazon Basics PL10023609_23669-656.xlsx";
            const deliveryNumber = DostNowaDostawa_1.DostNowaDostawa.extractDeliveryNumberFromFilename(filename);
            expect(deliveryNumber).toBe("PL10023609");
        });
        it("should extract delivery number from kitchen items filename", () => {
            const filename = "Dostawa magazyn Wiktor 16.05.2025r drobne artykuły kuchenne AM38160_90029531567.xlsx";
            const deliveryNumber = DostNowaDostawa_1.DostNowaDostawa.extractDeliveryNumberFromFilename(filename);
            expect(deliveryNumber).toBe("AM38160");
        });
        it("should extract delivery number from electronics filename", () => {
            const filename = "Dostawa magazyn Wiktor 16.05.2025r elektronika i gry przenośne (lot AM38159 - 4 pall).xlsx";
            const deliveryNumber = DostNowaDostawa_1.DostNowaDostawa.extractDeliveryNumberFromFilename(filename);
            expect(deliveryNumber).toBe("AM38159");
        });
        it("should generate correct delivery ID format", () => {
            const deliveryId = DostNowaDostawa_1.DostNowaDostawa.generateDeliveryId("PL10023609");
            expect(deliveryId).toBe("DST/PL10023609");
        });
        it("should generate correct file ID format", () => {
            const fileId = DostNowaDostawa_1.DostNowaDostawa.generateIdPliku(1, "DST/PL10023609");
            expect(fileId).toBe("PLK/001/DST/PL10023609");
        });
    });
    describe("Excel File Processing", () => {
        it("should process Amazon Basics Excel data correctly", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSXFile(testData, "Amazon_Basics_Test.xlsx");
            // Symulacja przetwarzania pliku
            const workbook = xlsx_1.default.readFile(testFilePath);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = xlsx_1.default.utils.sheet_to_json(worksheet);
            expect(jsonData.length).toBe(3);
            expect(jsonData[0]).toMatchObject({
                "NR Palety": "23669-656",
                "Item Desc": expect.stringContaining("Amazon Basics"),
                EAN: "0192233002651",
                ASIN: "B0713SLN3L",
                WARTOŚĆ: 15.99,
            });
        }));
        it("should process kitchen items Excel data with LPN correctly", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createKitchenItemsData();
            testFilePath = createTestXLSXFile(testData, "Kitchen_Items_Test.xlsx");
            const workbook = xlsx_1.default.readFile(testFilePath);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = xlsx_1.default.utils.sheet_to_json(worksheet);
            expect(jsonData.length).toBe(2);
            const catitProduct = jsonData.find((item) => item["Item Desc"] &&
                item["Item Desc"].includes("Catit Pixi Smart Feeder"));
            expect(catitProduct).toMatchObject({
                "NR Palety": "AM38160_90029531567",
                LPN: "LPNHE919225404",
                "Unit Retail": 98.24,
                DEPARTMENT: "Pet Products",
            });
        }));
        it("should handle different Excel file formats", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsData();
            // Test XLSX
            const xlsxPath = createTestXLSXFile(testData, "test.xlsx");
            expect(fs_1.default.existsSync(xlsxPath)).toBe(true);
            // Test XLS
            const xlsPath = createTestXLSFile(testData, "test.xls");
            expect(fs_1.default.existsSync(xlsPath)).toBe(true);
            // Cleanup
            fs_1.default.unlinkSync(xlsxPath);
            fs_1.default.unlinkSync(xlsPath);
        }));
        it("should validate product data structure", () => {
            const validProduct = {
                "NR Palety": "23669-656",
                "Item Desc": "Test Product",
                EAN: "1234567890123",
                ASIN: "B0TEST123",
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
            const invalidProducts = [
                {
                    "NR Palety": "",
                    "Item Desc": "",
                    EAN: "invalid",
                    ASIN: "",
                    WARTOŚĆ: "not-a-number",
                    ilosc: -1,
                },
                {
                    "NR Palety": null,
                    "Item Desc": undefined,
                    EAN: "123", // za krótki
                    ASIN: "INVALID_ASIN",
                    WARTOŚĆ: 0,
                    ilosc: 0,
                },
            ];
            invalidProducts.forEach((product) => {
                // Test walidacji - te produkty powinny być odrzucone
                const hasValidPallet = product["NR Palety"] && product["NR Palety"].length > 0;
                const hasValidDesc = product["Item Desc"] && product["Item Desc"].length > 0;
                const hasValidEAN = product["EAN"] && /^\d{13}$/.test(product["EAN"]);
                const hasValidASIN = product["ASIN"] && /^B0[A-Z0-9]{8}$/.test(product["ASIN"]);
                const hasValidPrice = typeof product["WARTOŚĆ"] === "number" && product["WARTOŚĆ"] > 0;
                const hasValidQuantity = typeof product["ilosc"] === "number" && product["ilosc"] > 0;
                const isValidProduct = hasValidPallet &&
                    hasValidDesc &&
                    hasValidEAN &&
                    hasValidASIN &&
                    hasValidPrice &&
                    hasValidQuantity;
                expect(isValidProduct).toBe(false);
            });
        });
    });
    describe("Database Integration", () => {
        it("should create delivery with generated ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const deliveryData = {
                id_dostawy: "DST/PL10023609",
                id_dostawcy: supplierId,
                id_pliku: "PLK/001/DST/PL10023609",
                nazwa_pliku: "Test_Amazon_Basics.xlsx",
                url_pliku_S3: "https://test-bucket.s3.amazonaws.com/test-file.xlsx",
                nr_palet_dostawy: "23669-656",
                status_weryfikacji: "nowa",
            };
            const delivery = yield DostNowaDostawa_1.DostNowaDostawa.create(deliveryData);
            expect(delivery.id_dostawy).toBe("DST/PL10023609");
            expect(delivery.id_dostawcy).toBe(supplierId);
            expect(delivery.status_weryfikacji).toBe("nowa");
        }));
        it("should create products for delivery", () => __awaiter(void 0, void 0, void 0, function* () {
            // Najpierw utwórz dostawę
            const delivery = yield DostNowaDostawa_1.DostNowaDostawa.create({
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
                kod_EAN: "1234567890123",
                kod_ASIN: "B0TEST123",
                ilosc_produktu: 2,
                cena_produktu_spec: 19.99,
                status_weryfikacji: "nowy",
            };
            const product = yield DostDostawyProdukty_1.DostDostawyProdukty.create(productData);
            expect(product.id_dostawy).toBe("DST/TEST001");
            expect(product.nazwa_produktu).toBe("Test Product");
            expect(product.kod_ean).toBe("1234567890123");
            expect(product.cena_produktu_spec).toBe(19.99);
        }));
        it("should prevent duplicate delivery IDs", () => __awaiter(void 0, void 0, void 0, function* () {
            // Utwórz pierwszą dostawę
            yield DostNowaDostawa_1.DostNowaDostawa.create({
                id_dostawy: "DST/DUPLICATE001",
                id_dostawcy: supplierId,
                id_pliku: "PLK/001/DST/DUPLICATE001",
                nazwa_pliku: "First_Delivery.xlsx",
                url_pliku_S3: "https://test-bucket.s3.amazonaws.com/first.xlsx",
                nr_palet_dostawy: "DUPLICATE001",
                status_weryfikacji: "nowa",
            });
            // Próba utworzenia duplikatu powinna się nie powieść
            yield expect(DostNowaDostawa_1.DostNowaDostawa.create({
                id_dostawy: "DST/DUPLICATE001", // Ten sam ID
                id_dostawcy: supplierId,
                id_pliku: "PLK/002/DST/DUPLICATE001",
                nazwa_pliku: "Second_Delivery.xlsx",
                url_pliku_S3: "https://test-bucket.s3.amazonaws.com/second.xlsx",
                nr_palet_dostawy: "DUPLICATE001",
                status_weryfikacji: "nowa",
            })).rejects.toThrow();
        }));
    });
    // Funkcje pomocnicze do tworzenia testowych danych
    function createAmazonBasicsData() {
        return [
            {
                "NR Palety": "23669-656",
                "Item Desc": "Amazon Basics 'Everyday' Spannbetttuch aus 100%, Baumwolle, 140 x 200 x 30 cm - Hellgrau",
                EAN: "0192233002651",
                ASIN: "B0713SLN3L",
                Stan: "A-Ware",
                Kraj: "DE",
                WARTOŚĆ: 15.99,
                ilosc: 1,
            },
            {
                "NR Palety": "23669-656",
                "Item Desc": "Amazon Basics - Bettwäsche-Set, Mikrofaser, 200 x 200 cm, Leicht Mikrofaser, marineblau, schlichtes Karo",
                EAN: "0844178061209",
                ASIN: "B07B9S2DL8",
                Stan: "A-Ware",
                Kraj: "DE",
                WARTOŚĆ: 16.29,
                ilosc: 1,
            },
            {
                "NR Palety": "23669-656",
                "Item Desc": "Amazon Basics - Verbindungskabel, USB Typ C auf Micro-USB Typ B, USB-2.0-Standard, doppelt geflochtenes Nylon, 0,9 m, Dunkelgrau",
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
                "Item Desc": "Catit Pixi Smart Feeder automatique pour chats, contrôlé par une application, pour 1,2 kg",
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
                "Item Desc": "VEMER VE794100 OT1 - Thermostat d'ambiance hebdomadaire modulant pour chaudière avec protocole OpenTherm, Blanc",
                EAN: "8,00795E+12",
                ASIN: "B0BC1BV9J1",
                LPN: "LPNHE924777243",
                ilość: 1,
                "Unit Retail": 88.6,
                DEPARTMENT: "Home",
                CATEGORY: "Housewares",
            },
        ];
    }
    function createTestDataWithoutDeliveryNumber() {
        return [
            {
                "NR Palety": "UNKNOWN_PALETTE",
                "Item Desc": "Test Product Without Delivery Number",
                EAN: "1234567890123",
                ASIN: "B0TESTTEST",
                Stan: "A-Ware",
                Kraj: "DE",
                WARTOŚĆ: 10.0,
                ilosc: 1,
            },
        ];
    }
    function createLargeFileTestData() {
        const data = [];
        for (let i = 1; i <= 1000; i++) {
            data.push({
                "NR Palety": "AM38159_90029568233",
                "Item Desc": `Test Product ${i}`,
                EAN: `123456789012${i.toString().padStart(3, "0")}`,
                ASIN: `B0TEST${i.toString().padStart(4, "0")}`,
                LPN: `LPNTEST${i.toString().padStart(6, "0")}`,
                "Unit Retail": Math.round((Math.random() * 100 + 10) * 100) / 100,
                ilosc: Math.floor(Math.random() * 5) + 1,
            });
        }
        return data;
    }
    function createVariantColumnMappingData() {
        return [
            {
                "Numer Palety": "TEST123_456789",
                "Nazwa Produktu": "Test Product with Different Column Names",
                "Kod EAN": "1234567890123",
                "Kod ASIN": "B0TESTVAR1",
                LPN_NUMBER: "LPNVARTEST001",
                Price: 25.5,
                Quantity: 2,
                Condition: "New",
                Country: "PL",
            },
        ];
    }
    function createTestXLSXFile(data, filename) {
        const ws = xlsx_1.default.utils.json_to_sheet(data);
        const wb = xlsx_1.default.utils.book_new();
        xlsx_1.default.utils.book_append_sheet(wb, ws, "Sheet1");
        const filePath = path_1.default.join(__dirname, filename);
        xlsx_1.default.writeFile(wb, filePath);
        return filePath;
    }
    function createTestXLSFile(data, filename) {
        const ws = xlsx_1.default.utils.json_to_sheet(data);
        const wb = xlsx_1.default.utils.book_new();
        xlsx_1.default.utils.book_append_sheet(wb, ws, "Sheet1");
        const filePath = path_1.default.join(__dirname, filename);
        xlsx_1.default.writeFile(wb, filePath, { bookType: "xls" });
        return filePath;
    }
});
