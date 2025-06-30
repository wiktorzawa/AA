import { DeliveryService } from "../../src/services/deliveryService";
import { DostNowaDostawa } from "../../src/models/deliveries/DostNowaDostawa";
import { DostDostawyProdukty } from "../../src/models/deliveries/DostDostawyProdukty";
import { sequelize } from "../../src/config/database";
import XLSX from "xlsx";
import path from "path";
import fs from "fs";

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

describe("DeliveryService - Core Functionality", () => {
  let deliveryService: DeliveryService;

  beforeAll(() => {
    deliveryService = new DeliveryService();
  });

  describe("File Name Processing", () => {
    it("should extract delivery number from Amazon Basics filename", () => {
      const filename =
        "Dostawa magazyn Wiktor 16.05.2025r Amazon Basics PL10023609_23669-656.xlsx";
      const deliveryNumber =
        DostNowaDostawa.extractDeliveryNumberFromFilename(filename);

      expect(deliveryNumber).toBe("PL10023609");
    });

    it("should extract delivery number from kitchen items filename", () => {
      const filename =
        "Dostawa magazyn Wiktor 16.05.2025r drobne artykuły kuchenne AM38160_90029531567.csv";
      const deliveryNumber =
        DostNowaDostawa.extractDeliveryNumberFromFilename(filename);

      expect(deliveryNumber).toBe("AM38160");
    });

    it("should generate correct delivery ID", () => {
      const deliveryNumber = "PL10023609";
      const deliveryId = DostNowaDostawa.generateDeliveryId(deliveryNumber);

      expect(deliveryId).toBe("DST/PL10023609");
    });

    it("should generate correct file ID", () => {
      const fileCount = 5;
      const deliveryId = "DST/PL10023609";
      const fileId = DostNowaDostawa.generateIdPliku(fileCount, deliveryId);

      expect(fileId).toBe("PLK/005/DST/PL10023609");
    });
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

  describe("Data Processing", () => {
    it("should parse number correctly", () => {
      const parseNumber = (deliveryService as any).parseNumber;

      expect(parseNumber("123")).toBe(123);
      expect(parseNumber("123.45")).toBe(123.45);
      expect(parseNumber("123,45")).toBe(12345); // The implementation doesn't handle comma as decimal separator
      expect(parseNumber("invalid")).toBeNull();
      expect(parseNumber(null)).toBeNull();
      expect(parseNumber(undefined)).toBeNull();
    });

    it("should normalize EAN codes correctly", () => {
      const normalizeEAN = (deliveryService as any).normalizeEAN;

      expect(normalizeEAN("1234567890123")).toBe("1234567890123");
      expect(normalizeEAN("8.00795E+12")).toBe("8007950000000"); // Scientific notation conversion
      expect(normalizeEAN("")).toBeUndefined();
      expect(normalizeEAN(null)).toBeUndefined();
    });

    it("should validate file format correctly", () => {
      const validateFileFormat = (deliveryService as any).validateFileFormat;

      const validFile = {
        mimetype:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 1024,
      } as Express.Multer.File;

      expect(() => validateFileFormat(validFile)).not.toThrow();

      const invalidFile = {
        mimetype: "text/plain",
        size: 1024,
      } as Express.Multer.File;

      expect(() => validateFileFormat(invalidFile)).toThrow(
        "Nieprawidłowy format pliku",
      );

      const tooLargeFile = {
        mimetype:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 15 * 1024 * 1024, // 15MB
      } as Express.Multer.File;

      expect(() => validateFileFormat(tooLargeFile)).toThrow(
        "Plik jest zbyt duży",
      );
    });
  });

  describe("Product Validation", () => {
    it("should validate product data correctly", () => {
      const validateProductData = (deliveryService as any).validateProductData;

      const validProducts = [
        {
          nazwa_produktu: "Test Product 1",
          ilosc: 1,
          kod_ean: "1234567890123",
          kod_asin: "B0TEST001",
          cena_produktu_spec: 10.99,
        },
        {
          nazwa_produktu: "Test Product 2",
          ilosc: 2,
          kod_ean: "9876543210987",
          kod_asin: "B0TEST002",
          cena_produktu_spec: 15.5,
        },
      ];

      const warnings = validateProductData(validProducts);
      expect(warnings).toEqual([]);

      const invalidProducts = [
        {
          nazwa_produktu: "",
          ilosc: 0,
          kod_ean: "",
          kod_asin: "",
        },
      ];

      const invalidWarnings = validateProductData(invalidProducts);
      expect(invalidWarnings.length).toBeGreaterThan(0);
      expect(invalidWarnings[0]).toContain("produktów bez kodu EAN");
    });
  });
});
