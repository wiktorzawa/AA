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
describe("Delivery Controller - File Upload Integration", () => {
    let supplierToken;
    let staffToken;
    let adminToken;
    let supplierId;
    let testFilePath;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database_1.sequelize.sync({ force: true });
        // Tworzenie testowych użytkowników
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
        const admin = yield AuthPracownicy_1.AuthPracownicy.create({
            id_pracownika: "ADM00001",
            imie: "Anna",
            nazwisko: "Nowak",
            rola: "admin",
            adres_email: "admin@test.com",
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
        adminToken = jsonwebtoken_1.default.sign({
            id_logowania: "LOG00003",
            id_uzytkownika: admin.id_pracownika,
            adres_email: admin.adres_email,
            rola_uzytkownika: "admin",
        }, jwtSecret, { expiresIn: "24h" });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Czyszczenie plików testowych
        if (testFilePath && fs_1.default.existsSync(testFilePath)) {
            fs_1.default.unlinkSync(testFilePath);
        }
        yield database_1.sequelize.close();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Czyszczenie danych przed każdym testem
        yield DostDostawyProdukty_1.DostDostawyProdukty.destroy({ where: {} });
        yield DostNowaDostawa_1.DostNowaDostawa.destroy({ where: {} });
    }));
    describe("POST /api/deliveries/upload", () => {
        it("should upload Amazon Basics Excel file successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSXFile(testData, "Amazon_Basics_PL10023609_23669-656.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
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
            const delivery = yield DostNowaDostawa_1.DostNowaDostawa.findByPk("DST/PL10023609");
            expect(delivery).toBeTruthy();
            expect(delivery === null || delivery === void 0 ? void 0 : delivery.id_dostawcy).toBe(supplierId);
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: "DST/PL10023609" },
            });
            expect(products.length).toBe(3);
        }));
        it("should upload kitchen items Excel file with LPN codes", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createKitchenItemsData();
            testFilePath = createTestXLSXFile(testData, "Kitchen_Items_AM38160_90029531567.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "AM38160")
                .expect(201);
            expect(response.body.data.id_dostawy).toBe("DST/AM38160");
            expect(response.body.data.nr_palet_dostawy).toBe("AM38160_90029531567");
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: "DST/AM38160" },
            });
            const catitProduct = products.find((p) => p.nazwa_produktu.includes("Catit Pixi Smart Feeder"));
            expect(catitProduct).toBeTruthy();
            expect(catitProduct === null || catitProduct === void 0 ? void 0 : catitProduct.LPN).toBe("LPNHE919225404");
            expect(catitProduct === null || catitProduct === void 0 ? void 0 : catitProduct.cena_produktu_spec).toBe(98.24);
        }));
        it("should require delivery number confirmation", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSXFile(testData, "Amazon_Basics_PL10023609_23669-656.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                // Brak potwierdzenia numeru dostawy
                .expect(400);
            expect(response.body).toMatchObject({
                success: false,
                error: "Wymagane potwierdzenie numeru dostawy",
            });
        }));
        it("should validate delivery number confirmation", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSXFile(testData, "Amazon_Basics_PL10023609_23669-656.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "WRONG_NUMBER") // Nieprawidłowy numer
                .expect(400);
            expect(response.body).toMatchObject({
                success: false,
                error: "Potwierdzony numer dostawy nie zgadza się z wykrytym numerem PL10023609",
            });
        }));
        it("should handle file size limits", () => __awaiter(void 0, void 0, void 0, function* () {
            // Tworzenie bardzo dużego pliku (symulacja)
            const largeData = Array(10000)
                .fill(null)
                .map((_, i) => ({
                "NR Palety": `LARGE${i}`,
                "Item Desc": `Large Product ${i}`,
                EAN: `12345678901${i.toString().padStart(2, "0")}`,
                ASIN: `B0LARGE${i.toString().padStart(3, "0")}`,
                ilosc: 1,
                WARTOŚĆ: 10.0,
            }));
            testFilePath = createTestXLSXFile(largeData, "Large_File.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "LARGE")
                .expect(413); // Payload Too Large
            expect(response.body).toMatchObject({
                success: false,
                error: "Plik jest zbyt duży. Maksymalny rozmiar to 10MB",
            });
        }));
        it("should validate file format", () => __awaiter(void 0, void 0, void 0, function* () {
            // Tworzenie pliku tekstowego zamiast Excel
            testFilePath = path_1.default.join(__dirname, "invalid_file.txt");
            fs_1.default.writeFileSync(testFilePath, "This is not an Excel file");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "TEST")
                .expect(400);
            expect(response.body).toMatchObject({
                success: false,
                error: "Nieprawidłowy format pliku. Obsługiwane formaty: .xlsx, .xls, .xlsm",
            });
        }));
        it("should handle missing file", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${supplierToken}`)
                .field("confirmDeliveryNumber", "TEST")
                .expect(400);
            expect(response.body).toMatchObject({
                success: false,
                error: "Brak pliku do przesłania",
            });
        }));
        it("should prevent duplicate delivery upload", () => __awaiter(void 0, void 0, void 0, function* () {
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
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "PL10023609")
                .expect(409);
            expect(response.body).toMatchObject({
                success: false,
                error: "Dostawa o numerze DST/PL10023609 już istnieje",
            });
        }));
        it("should require authentication", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSXFile(testData, "No_Auth_Test.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "NOAUTH")
                .expect(401);
            expect(response.body).toMatchObject({
                success: false,
                error: "Brak tokenu autoryzacji",
            });
        }));
        it("should allow staff to upload on behalf of supplier", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSXFile(testData, "Staff_Upload_PL10023609_23669-656.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${staffToken}`)
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "PL10023609")
                .field("supplierId", supplierId) // Staff może określić dostawcę
                .expect(201);
            expect(response.body.data.id_dostawcy).toBe(supplierId);
        }));
        it("should handle Excel file with formulas and formatting", () => __awaiter(void 0, void 0, void 0, function* () {
            // Tworzenie pliku z formułami Excel
            const ws = xlsx_1.default.utils.aoa_to_sheet([
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
            const wb = xlsx_1.default.utils.book_new();
            xlsx_1.default.utils.book_append_sheet(wb, ws, "Sheet1");
            testFilePath = path_1.default.join(__dirname, "Formula_Test.xlsx");
            xlsx_1.default.writeFile(wb, testFilePath);
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "FORMULA123")
                .expect(201);
            expect(response.body.data.id_dostawy).toBe("DST/FORMULA123");
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: "DST/FORMULA123" },
            });
            expect(products.length).toBe(2);
            expect(products[0].cena_produktu_spec).toBe(15.99);
            expect(products[1].cena_produktu_spec).toBe(25.5);
        }));
        it("should handle XLS format files", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createKitchenItemsData();
            testFilePath = createTestXLSFile(testData, "Kitchen_Items.xls");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "AM38160")
                .expect(201);
            expect(response.body.data.id_dostawy).toBe("DST/AM38160");
        }));
        it("should handle XLSM format files with macros", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSMFile(testData, "Macro_File.xlsm");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "PL10023609")
                .expect(201);
            expect(response.body.data.id_dostawy).toBe("DST/PL10023609");
        }));
        it("should validate product data integrity", () => __awaiter(void 0, void 0, void 0, function* () {
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
            testFilePath = createTestXLSXFile(invalidProductData, "Invalid_Products.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload")
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                .field("confirmDeliveryNumber", "INVALID001")
                .expect(400);
            expect(response.body).toMatchObject({
                success: false,
                error: expect.stringContaining("Nieprawidłowe dane produktu"),
            });
        }));
    });
    describe("GET /api/deliveries/upload/preview", () => {
        it("should preview file without saving to database", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsData();
            testFilePath = createTestXLSXFile(testData, "Preview_Test.xlsx");
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/api/deliveries/upload/preview")
                .set("Authorization", `Bearer ${supplierToken}`)
                .attach("deliveryFile", testFilePath)
                .expect(200);
            expect(response.body).toMatchObject({
                success: true,
                data: {
                    detectedDeliveryNumber: "PL10023609",
                    fileName: "Preview_Test.xlsx",
                    totalProducts: 3,
                    estimatedValue: expect.any(Number),
                    productSample: expect.any(Array),
                },
            });
            // Sprawdzenie czy dane nie zostały zapisane w bazie
            const deliveryCount = yield DostNowaDostawa_1.DostNowaDostawa.count();
            expect(deliveryCount).toBe(0);
        }));
    });
    // Funkcje pomocnicze
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
                "Item Desc": "Amazon Basics - Verbindungskabel, USB Typ C auf Micro-USB Typ B",
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
    function createTestXLSMFile(data, filename) {
        const ws = xlsx_1.default.utils.json_to_sheet(data);
        const wb = xlsx_1.default.utils.book_new();
        xlsx_1.default.utils.book_append_sheet(wb, ws, "Sheet1");
        const filePath = path_1.default.join(__dirname, filename);
        xlsx_1.default.writeFile(wb, filePath, { bookType: "xlsm" });
        return filePath;
    }
});
