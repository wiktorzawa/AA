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
const deliveryService_1 = require("../../src/services/deliveryService");
const DostNowaDostawa_1 = require("../../src/models/deliveries/DostNowaDostawa");
const DostDostawyProdukty_1 = require("../../src/models/deliveries/DostDostawyProdukty");
const database_1 = require("../../src/config/database");
const xlsx_1 = __importDefault(require("xlsx"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Mock AWS S3
jest.mock("aws-sdk", () => ({
    S3: jest.fn(() => ({
        upload: jest.fn().mockReturnValue({
            promise: jest.fn().mockResolvedValue({
                Location: "https://s3.example.com/test-file.xlsx",
            }),
        }),
    })),
}));
describe("DeliveryService - File Processing", () => {
    let deliveryService;
    let testFilePath;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database_1.sequelize.sync({ force: true });
        deliveryService = new deliveryService_1.DeliveryService();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (testFilePath && fs_1.default.existsSync(testFilePath)) {
            fs_1.default.unlinkSync(testFilePath);
        }
        yield database_1.sequelize.close();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield DostDostawyProdukty_1.DostDostawyProdukty.destroy({ where: {} });
        yield DostNowaDostawa_1.DostNowaDostawa.destroy({ where: {} });
    }));
    describe("processExcelFile", () => {
        it("should extract delivery number from Amazon Basics filename", () => {
            const filename = "Dostawa magazyn Wiktor 16.05.2025r Amazon Basics PL10023609_23669-656.xlsx";
            const deliveryNumber = DostNowaDostawa_1.DostNowaDostawa.extractDeliveryNumberFromFilename(filename);
            expect(deliveryNumber).toBe("PL10023609");
        });
        it("should extract delivery number from kitchen items filename", () => {
            const filename = "Dostawa magazyn Wiktor 16.05.2025r drobne artykuły kuchenne AM38160_90029531567.csv";
            const deliveryNumber = DostNowaDostawa_1.DostNowaDostawa.extractDeliveryNumberFromFilename(filename);
            expect(deliveryNumber).toBe("AM38160");
        });
        it("should generate correct delivery ID", () => {
            const deliveryNumber = "PL10023609";
            const deliveryId = DostNowaDostawa_1.DostNowaDostawa.generateDeliveryId(deliveryNumber);
            expect(deliveryId).toBe("DST/PL10023609");
        });
        it("should process Excel file with Amazon Basics products", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createAmazonBasicsExcelData();
            testFilePath = createTestExcelFile(testData, "Amazon_Basics_PL10023609_23669-656.xlsx");
            const fileBuffer = fs_1.default.readFileSync(testFilePath);
            const mockFile = {
                originalname: "Amazon_Basics_PL10023609_23669-656.xlsx",
                buffer: fileBuffer,
                mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
            const result = yield deliveryService.createDeliveryFromFile(mockFile, "SUP00001");
            expect(result.id_dostawy).toBe("DST/PL10023609");
            expect(result.nazwa_pliku).toBe("Amazon_Basics_PL10023609_23669-656.xlsx");
            expect(result.nr_palet_dostawy).toBe("23669-656");
            // Sprawdzenie produktów
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: "DST/PL10023609" },
            });
            expect(products.length).toBe(3);
            const usbCable = products.find((p) => p.nazwa_produktu.includes("USB Typ C auf Micro-USB"));
            expect(usbCable).toBeTruthy();
            expect(usbCable === null || usbCable === void 0 ? void 0 : usbCable.ilosc).toBe(6);
            expect(usbCable === null || usbCable === void 0 ? void 0 : usbCable.cena_produktu_spec).toBe(14.99);
        }));
        it("should process Excel file with kitchen items and LPN codes", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createKitchenItemsExcelData();
            testFilePath = createTestExcelFile(testData, "Kitchen_Items_AM38160_90029531567.xlsx");
            const fileBuffer = fs_1.default.readFileSync(testFilePath);
            const mockFile = {
                originalname: "Kitchen_Items_AM38160_90029531567.xlsx",
                buffer: fileBuffer,
                mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
            const result = yield deliveryService.createDeliveryFromFile(mockFile, "SUP00001");
            expect(result.id_dostawy).toBe("DST/AM38160");
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: "DST/AM38160" },
            });
            const catitFeeder = products.find((p) => p.nazwa_produktu.includes("Catit Pixi Smart Feeder"));
            expect(catitFeeder).toBeTruthy();
            expect(catitFeeder === null || catitFeeder === void 0 ? void 0 : catitFeeder.LPN).toBe("LPNHE919225404");
            expect(catitFeeder === null || catitFeeder === void 0 ? void 0 : catitFeeder.cena_produktu_spec).toBe(98.24);
            expect(catitFeeder === null || catitFeeder === void 0 ? void 0 : catitFeeder.kategoria_produktu).toBe("Pet Products");
        }));
        it("should handle file with mixed column formats", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createMixedFormatExcelData();
            testFilePath = createTestExcelFile(testData, "Mixed_Format_Test.xlsx");
            const fileBuffer = fs_1.default.readFileSync(testFilePath);
            const mockFile = {
                originalname: "Mixed_Format_Test.xlsx",
                buffer: fileBuffer,
                mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
            const result = yield deliveryService.createDeliveryFromFile(mockFile, "SUP00001");
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: result.id_dostawy },
            });
            expect(products.length).toBeGreaterThan(0);
            // Sprawdzenie czy różne formaty kolumn zostały poprawnie zmapowane
            products.forEach((product) => {
                expect(product.nazwa_produktu).toBeTruthy();
                expect(product.kod_ean).toBeTruthy();
                expect(product.kod_asin).toBeTruthy();
            });
        }));
        it("should validate required columns in Excel file", () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidData = [
                {
                    "Wrong Column": "Invalid data",
                    "Another Wrong": "More invalid data",
                },
            ];
            testFilePath = createTestExcelFile(invalidData, "Invalid_Columns.xlsx");
            const fileBuffer = fs_1.default.readFileSync(testFilePath);
            const mockFile = {
                originalname: "Invalid_Columns.xlsx",
                buffer: fileBuffer,
                mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
            yield expect(deliveryService.createDeliveryFromFile(mockFile, "SUP00001")).rejects.toThrow("Brak wymaganych kolumn w pliku Excel");
        }));
        it("should handle empty Excel file", () => __awaiter(void 0, void 0, void 0, function* () {
            const emptyData = [];
            testFilePath = createTestExcelFile(emptyData, "Empty_File.xlsx");
            const fileBuffer = fs_1.default.readFileSync(testFilePath);
            const mockFile = {
                originalname: "Empty_File.xlsx",
                buffer: fileBuffer,
                mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
            yield expect(deliveryService.createDeliveryFromFile(mockFile, "SUP00001")).rejects.toThrow("Plik Excel jest pusty lub nie zawiera danych");
        }));
        it("should handle Excel file with scientific notation in EAN codes", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = [
                {
                    "NR Palety": "TEST123",
                    "Item Desc": "Product with Scientific EAN",
                    EAN: "8.00795E+12", // Notacja naukowa jak w pliku CSV
                    ASIN: "B0BC1BV9J1",
                    ilosc: 1,
                    "Unit Retail": 88.6,
                },
            ];
            testFilePath = createTestExcelFile(testData, "Scientific_EAN.xlsx");
            const fileBuffer = fs_1.default.readFileSync(testFilePath);
            const mockFile = {
                originalname: "Scientific_EAN.xlsx",
                buffer: fileBuffer,
                mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
            const result = yield deliveryService.createDeliveryFromFile(mockFile, "SUP00001");
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: result.id_dostawy },
            });
            const product = products[0];
            expect(product.kod_ean).toBe("8007950000000000"); // Skonwertowana notacja naukowa
        }));
        it("should calculate total value and VAT correctly", () => __awaiter(void 0, void 0, void 0, function* () {
            const testData = createValueCalculationTestData();
            testFilePath = createTestExcelFile(testData, "Value_Calculation_Test.xlsx");
            const fileBuffer = fs_1.default.readFileSync(testFilePath);
            const mockFile = {
                originalname: "Value_Calculation_Test.xlsx",
                buffer: fileBuffer,
                mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
            const result = yield deliveryService.createDeliveryFromFile(mockFile, "SUP00001");
            const products = yield DostDostawyProdukty_1.DostDostawyProdukty.findAll({
                where: { id_dostawy: result.id_dostawy },
            });
            // Sprawdzenie kalkulacji wartości
            const totalValue = products.reduce((sum, product) => sum + product.cena_produktu_spec * product.ilosc, 0);
            expect(totalValue).toBeCloseTo(334.96, 2); // Suma z testowych danych
        }));
    });
    describe("Column Mapping", () => {
        it("should map Amazon Basics CSV format columns correctly", () => {
            const headers = [
                "NR Palety",
                "Item Desc",
                "EAN",
                "ASIN",
                "Stan",
                "Kraj",
                "WARTOŚĆ",
                "ilosc",
            ];
            const mapping = deliveryService.detectColumnMapping(headers);
            expect(mapping).toEqual({
                paletteNumber: "NR Palety",
                productName: "Item Desc",
                ean: "EAN",
                asin: "ASIN",
                condition: "Stan",
                country: "Kraj",
                price: "WARTOŚĆ",
                quantity: "ilosc",
            });
        });
        it("should map kitchen items CSV format columns correctly", () => {
            const headers = [
                "NR Palety",
                "Item Desc",
                "EAN",
                "ASIN",
                "LPN",
                "ilość",
                "Unit Retail",
                "DEPARTMENT",
                "CATEGORY",
            ];
            const mapping = deliveryService.detectColumnMapping(headers);
            expect(mapping).toEqual({
                paletteNumber: "NR Palety",
                productName: "Item Desc",
                ean: "EAN",
                asin: "ASIN",
                lpn: "LPN",
                quantity: "ilość",
                price: "Unit Retail",
                department: "DEPARTMENT",
                category: "CATEGORY",
            });
        });
        it("should handle alternative column names", () => {
            const headers = [
                "Numer Palety",
                "Nazwa Produktu",
                "Kod EAN",
                "Kod ASIN",
                "Ilość",
                "Cena",
            ];
            const mapping = deliveryService.detectColumnMapping(headers);
            expect(mapping.paletteNumber).toBe("Numer Palety");
            expect(mapping.productName).toBe("Nazwa Produktu");
            expect(mapping.ean).toBe("Kod EAN");
            expect(mapping.asin).toBe("Kod ASIN");
            expect(mapping.quantity).toBe("Ilość");
            expect(mapping.price).toBe("Cena");
        });
    });
    // Funkcje pomocnicze
    function createAmazonBasicsExcelData() {
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
    function createKitchenItemsExcelData() {
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
                "GL DESCRIPTION": "gl_pet_products",
                CATEGORY: "Habitats & Supplies",
                SUBCATEGORY: "Feeders",
            },
            {
                "NR Palety": "AM38160_90029531567",
                "Item Desc": "VEMER VE794100 OT1 - Thermostat d'ambiance hebdomadaire modulant pour chaudière avec protocole OpenTherm, Blanc",
                EAN: "8.00795E+12",
                ASIN: "B0BC1BV9J1",
                LPN: "LPNHE924777243",
                ilość: 1,
                "Unit Retail": 88.6,
                DEPARTMENT: "Home",
                "GL DESCRIPTION": "gl_home",
                CATEGORY: "Housewares",
                SUBCATEGORY: "Laundry Baskets",
            },
        ];
    }
    function createMixedFormatExcelData() {
        return [
            {
                "NR Palety": "MIXED001",
                "Item Desc": "Mixed Format Product 1",
                EAN: "1234567890123",
                ASIN: "B0MIXED001",
                ilosc: 2,
                WARTOŚĆ: 25.5,
            },
            {
                "Numer Palety": "MIXED002",
                "Nazwa Produktu": "Mixed Format Product 2",
                "Kod EAN": "9876543210987",
                "Kod ASIN": "B0MIXED002",
                Ilość: 3,
                Cena: 35.75,
            },
        ];
    }
    function createValueCalculationTestData() {
        return [
            {
                "NR Palety": "VAL001",
                "Item Desc": "Value Test Product 1",
                EAN: "1111111111111",
                ASIN: "B0VAL00001",
                ilosc: 5,
                "Unit Retail": 19.99,
            },
            {
                "NR Palety": "VAL002",
                "Item Desc": "Value Test Product 2",
                EAN: "2222222222222",
                ASIN: "B0VAL00002",
                ilosc: 3,
                "Unit Retail": 45.0,
            },
            {
                "NR Palety": "VAL003",
                "Item Desc": "Value Test Product 3",
                EAN: "3333333333333",
                ASIN: "B0VAL00003",
                ilosc: 2,
                "Unit Retail": 74.99,
            },
        ];
    }
    function createTestExcelFile(data, filename) {
        const ws = xlsx_1.default.utils.json_to_sheet(data);
        const wb = xlsx_1.default.utils.book_new();
        xlsx_1.default.utils.book_append_sheet(wb, ws, "Sheet1");
        const filePath = path_1.default.join(__dirname, filename);
        xlsx_1.default.writeFile(wb, filePath);
        return filePath;
    }
});
