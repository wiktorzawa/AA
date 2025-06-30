import { Op } from "sequelize";
import { sequelize } from "../config/database";
import {
  DostNowaDostawa,
  DostDostawyProdukty,
  DostFakturyDostawcow,
  DostFinanseDostaw,
} from "../models/deliveries";
import {
  CreateDeliveryRequest,
  CreateProductRequest,
  CreateInvoiceRequest,
  CreateFinancesRequest,
  UpdateDeliveryStatusRequest,
  UpdateProductStatusRequest,
  DeliveryFilters,
  PaginationParams,
  PaginatedResponse,
  DeliveryResponse,
  ProductResponse,
  InvoiceResponse,
  FinancesResponse,
  DeliveryStatsResponse,
  FileUploadResponse,
  FilePreviewResponse,
  ProcessedExcelData,
  ColumnMapping,
  PreviewProduct,
  PreviewStatus,
} from "../types/delivery.types";
import { AppError } from "../utils/AppError";
import * as XLSX from "xlsx";
import { awsService } from "./awsService";
import { request } from "express";

export class DeliveryService {
  /**
   * 🆕 Tworzy nową dostawę z produktami (atomowa transakcja)
   */
  async createDelivery(data: CreateDeliveryRequest): Promise<DeliveryResponse> {
    const transaction = await sequelize.transaction();

    try {
      // 1. Walidacja danych wejściowych
      if (!data.id_dostawcy || !data.nazwa_pliku || !data.url_pliku_S3) {
        throw new AppError("Wszystkie wymagane pola muszą być wypełnione", 400);
      }

      // 2. Sprawdź czy dostawca istnieje (przez import z auth models)
      const { AuthDostawcy } = await import("../models/auth/AuthDostawcy");
      const dostawca = await AuthDostawcy.findByPk(data.id_dostawcy);
      if (!dostawca) {
        throw new AppError("Dostawca nie został znaleziony", 404);
      }

      // 3. Generuj ID dostawy na podstawie nazwy pliku
      const deliveryNumber = DostNowaDostawa.extractDeliveryNumberFromFilename(
        data.nazwa_pliku,
      );
      if (!deliveryNumber) {
        throw new AppError(
          "Nie można wyodrębnić numeru dostawy z nazwy pliku",
          400,
        );
      }
      const generatedDeliveryId =
        DostNowaDostawa.generateDeliveryId(deliveryNumber);

      // 4. Utwórz dostawę
      const dostawa = await DostNowaDostawa.create(
        {
          id_dostawy: generatedDeliveryId,
          id_dostawcy: data.id_dostawcy,
          id_pliku: "", // Zostanie wygenerowane po utworzeniu
          nazwa_pliku: data.nazwa_pliku,
          url_pliku_S3: data.url_pliku_S3,
          nr_palet_dostawy: data.nr_palet_dostawy,
        },
        { transaction },
      );

      // 4. Wygeneruj i zaktualizuj ID pliku
      const liczba_plikow = await DostNowaDostawa.count({
        where: { id_dostawcy: data.id_dostawcy },
        transaction,
      });

      const id_pliku = DostNowaDostawa.generateIdPliku(
        liczba_plikow,
        dostawa.id_dostawy,
      );
      await dostawa.update({ id_pliku }, { transaction });

      // 5. Dodaj produkty jeśli zostały podane
      if (data.products && data.products.length > 0) {
        await Promise.all(
          data.products.map((product) =>
            DostDostawyProdukty.create(
              {
                id_dostawy: dostawa.id_dostawy,
                ...product,
              },
              { transaction },
            ),
          ),
        );
      }

      await transaction.commit();

      console.log(
        `✅ [DeliveryService]: Utworzono dostawę ${dostawa.id_dostawy} dla dostawcy ${data.id_dostawcy}`,
      );

      return this.formatDeliveryResponse(dostawa);
    } catch (error) {
      await transaction.rollback();
      console.error(
        "❌ [DeliveryService]: Błąd podczas tworzenia dostawy:",
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas tworzenia dostawy", 500);
    }
  }

  /**
   * 🆕 Pobiera dostawy z filtrami i paginacją
   */
  async getDeliveries(
    filters: DeliveryFilters = {},
    pagination: PaginationParams = {},
  ): Promise<PaginatedResponse<DeliveryResponse>> {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = "data_utworzenia",
        sortOrder = "DESC",
      } = pagination;
      const offset = (page - 1) * limit;

      // Buduj warunki where
      const whereConditions: Record<string, any> = {};

      if (filters.id_dostawcy)
        whereConditions.id_dostawcy = filters.id_dostawcy;
      if (filters.status_weryfikacji)
        whereConditions.status_weryfikacji = filters.status_weryfikacji;
      if (filters.nazwa_pliku) {
        whereConditions.nazwa_pliku = { [Op.like]: `%${filters.nazwa_pliku}%` };
      }
      if (filters.data_od || filters.data_do) {
        whereConditions.data_utworzenia = {};
        if (filters.data_od)
          whereConditions.data_utworzenia[Op.gte] = new Date(filters.data_od);
        if (filters.data_do)
          whereConditions.data_utworzenia[Op.lte] = new Date(filters.data_do);
      }

      const { count, rows } = await DostNowaDostawa.findAndCountAll({
        where: whereConditions,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
      });

      const deliveries = rows.map(this.formatDeliveryResponse);

      return {
        data: deliveries,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      console.error(
        "❌ [DeliveryService]: Błąd podczas pobierania dostaw:",
        error,
      );
      throw new AppError("Błąd podczas pobierania dostaw", 500);
    }
  }

  /**
   * 🆕 Pobiera dostawę po ID z relacjami
   */
  async getDeliveryById(
    id_dostawy: string,
    includeRelations = true,
  ): Promise<DeliveryResponse> {
    try {
      const dostawa = await DostNowaDostawa.findByPk(id_dostawy);

      if (!dostawa) {
        throw new AppError("Dostawa nie została znaleziona", 404);
      }

      const response = this.formatDeliveryResponse(dostawa);

      if (includeRelations) {
        // Dodaj produkty
        const products = await DostDostawyProdukty.findByDostawa(id_dostawy);
        response.products = products.map(this.formatProductResponse);

        // Dodaj finanse
        const finances = await DostFinanseDostaw.findByDostawa(id_dostawy);
        if (finances) {
          response.finances = this.formatFinancesResponse(finances);
        }

        // Dodaj faktury
        const invoices = await DostFakturyDostawcow.findByDostawa(id_dostawy);
        response.invoices = invoices.map(this.formatInvoiceResponse);
      }

      return response;
    } catch (error) {
      console.error(
        `❌ [DeliveryService]: Błąd podczas pobierania dostawy ${id_dostawy}:`,
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas pobierania dostawy", 500);
    }
  }

  /**
   * 🆕 Aktualizuje status dostawy
   */
  async updateDeliveryStatus(
    id_dostawy: string,
    data: UpdateDeliveryStatusRequest,
  ): Promise<DeliveryResponse> {
    try {
      const dostawa = await DostNowaDostawa.findByPk(id_dostawy);

      if (!dostawa) {
        throw new AppError("Dostawa nie została znaleziona", 404);
      }

      await dostawa.updateStatus(data.status_weryfikacji);

      return this.formatDeliveryResponse(dostawa);
    } catch (error) {
      console.error(
        `❌ [DeliveryService]: Błąd podczas aktualizacji statusu dostawy ${id_dostawy}:`,
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas aktualizacji statusu dostawy", 500);
    }
  }

  /**
   * 🆕 Usuwa dostawę i wszystkie powiązane dane
   */
  async deleteDelivery(id_dostawy: string): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const dostawa = await DostNowaDostawa.findByPk(id_dostawy, {
        transaction,
      });

      if (!dostawa) {
        throw new AppError("Dostawa nie została znaleziona", 404);
      }

      // Usuń powiązane dane (CASCADE przez FK)
      await dostawa.destroy({ transaction });

      await transaction.commit();

      console.log(`✅ [DeliveryService]: Usunięto dostawę ${id_dostawy}`);
    } catch (error) {
      await transaction.rollback();
      console.error(
        `❌ [DeliveryService]: Błąd podczas usuwania dostawy ${id_dostawy}:`,
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas usuwania dostawy", 500);
    }
  }

  /**
   * 🆕 Zarządzanie produktami w dostawach
   */
  async addProductToDelivery(
    id_dostawy: string,
    productData: CreateProductRequest,
  ): Promise<ProductResponse> {
    try {
      // Sprawdź czy dostawa istnieje
      const dostawa = await DostNowaDostawa.findByPk(id_dostawy);
      if (!dostawa) {
        throw new AppError("Dostawa nie została znaleziona", 404);
      }

      const product = await DostDostawyProdukty.create({
        id_dostawy,
        ...productData,
      });

      return this.formatProductResponse(product);
    } catch (error) {
      console.error(
        `❌ [DeliveryService]: Błąd podczas dodawania produktu do dostawy ${id_dostawy}:`,
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas dodawania produktu", 500);
    }
  }

  async updateProductStatus(
    id_produktu: number,
    data: UpdateProductStatusRequest,
  ): Promise<ProductResponse> {
    try {
      const product = await DostDostawyProdukty.findByPk(id_produktu);

      if (!product) {
        throw new AppError("Produkt nie został znaleziony", 404);
      }

      await product.updateStatus(
        data.status_weryfikacji,
        data.uwagi_weryfikacji,
      );

      return this.formatProductResponse(product);
    } catch (error) {
      console.error(
        `❌ [DeliveryService]: Błąd podczas aktualizacji statusu produktu ${id_produktu}:`,
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas aktualizacji statusu produktu", 500);
    }
  }

  /**
   * 🆕 Zarządzanie fakturami
   */
  async createInvoice(data: CreateInvoiceRequest): Promise<InvoiceResponse> {
    try {
      // Walidacja
      if (!data.id_dostawcy || !data.numer_faktury) {
        throw new AppError("Wszystkie wymagane pola muszą być wypełnione", 400);
      }

      // Sprawdź czy numer faktury już istnieje
      const existingInvoice = await DostFakturyDostawcow.findByNumerFaktury(
        data.numer_faktury,
      );
      if (existingInvoice) {
        throw new AppError("Faktura o podanym numerze już istnieje", 409);
      }

      const invoice = await DostFakturyDostawcow.create({
        ...data,
        data_faktury: new Date(data.data_faktury),
        data_platnosci: new Date(data.data_platnosci),
      });

      return this.formatInvoiceResponse(invoice);
    } catch (error) {
      console.error(
        "❌ [DeliveryService]: Błąd podczas tworzenia faktury:",
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas tworzenia faktury", 500);
    }
  }

  /**
   * 🆕 Zarządzanie finansami dostaw
   */
  async createOrUpdateFinances(
    data: CreateFinancesRequest,
  ): Promise<FinancesResponse> {
    try {
      // Sprawdź czy dostawa istnieje
      const dostawa = await DostNowaDostawa.findByPk(data.id_dostawy);
      if (!dostawa) {
        throw new AppError("Dostawa nie została znaleziona", 404);
      }

      // Oblicz dane finansowe
      const calculated = DostFinanseDostaw.calculateFinances(
        data.suma_produktow,
        data.wartosc_produktow_spec,
        data.procent_wartosci,
        data.kurs_wymiany,
        data.stawka_vat,
      );

      // Sprawdź czy już istnieją finanse dla tej dostawy
      let finances = await DostFinanseDostaw.findByDostawa(data.id_dostawy);

      if (finances) {
        // Aktualizuj istniejące
        await finances.update({
          ...data,
          ...calculated,
        });
      } else {
        // Utwórz nowe
        finances = await DostFinanseDostaw.create({
          ...data,
          ...calculated,
        });
      }

      return this.formatFinancesResponse(finances);
    } catch (error) {
      console.error(
        "❌ [DeliveryService]: Błąd podczas zarządzania finansami:",
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas zarządzania finansami", 500);
    }
  }

  /**
   * 🆕 Statystyki dostaw
   */
  async getDeliveryStats(): Promise<DeliveryStatsResponse> {
    try {
      const deliveries = await DostNowaDostawa.findAll({
        order: [["data_utworzenia", "DESC"]],
      });

      const stats: DeliveryStatsResponse = {
        total_deliveries: deliveries.length,
        by_status: deliveries.reduce(
          (acc, d) => {
            acc[d.status_weryfikacji] = (acc[d.status_weryfikacji] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
        by_supplier: deliveries.reduce(
          (acc, d) => {
            acc[d.id_dostawcy] = (acc[d.id_dostawcy] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
        recent_deliveries: deliveries
          .slice(0, 10)
          .map(this.formatDeliveryResponse),
      };

      return stats;
    } catch (error) {
      console.error(
        "❌ [DeliveryService]: Błąd podczas pobierania statystyk:",
        error,
      );
      throw new AppError("Błąd podczas pobierania statystyk", 500);
    }
  }

  /**
   * 📤 Przesyła i przetwarza plik dostawy
   */
  async uploadAndProcessFile(
    file: Express.Multer.File,
    id_dostawcy: string,
    confirmDeliveryNumber?: string,
  ): Promise<FileUploadResponse> {
    const transaction = await sequelize.transaction();

    try {
      // 1. Walidacja pliku
      this.validateFileFormat(file);

      // 2. Przetwórz plik Excel
      const processedData = this.processExcelFile(file);

      // 3. Określ numer dostawy - najpierw z nazwy pliku, potem z potwierdzenia użytkownika
      let finalDeliveryNumber = processedData.deliveryNumber;

      if (!finalDeliveryNumber) {
        // Jeśli nie udało się wyodrębnić z nazwy pliku, użyj numeru podanego przez użytkownika
        if (confirmDeliveryNumber) {
          finalDeliveryNumber = confirmDeliveryNumber;
        } else {
          throw new AppError(
            "Nie można wyodrębnić numeru dostawy z nazwy pliku. Proszę podać numer dostawy ręcznie.",
            400,
          );
        }
      } else if (
        confirmDeliveryNumber &&
        processedData.deliveryNumber !== confirmDeliveryNumber
      ) {
        // Jeśli wykryto numer z pliku i użytkownik podał potwierdzenie, sprawdź czy się zgadzają
        throw new AppError(
          `Potwierdzony numer dostawy nie zgadza się z wykrytym numerem ${processedData.deliveryNumber}`,
          400,
        );
      }

      // 4. Sprawdź czy dostawa już istnieje
      const deliveryId =
        DostNowaDostawa.generateDeliveryId(finalDeliveryNumber);
      const existingDelivery = await DostNowaDostawa.findByPk(deliveryId);
      if (existingDelivery) {
        throw new AppError(`Dostawa o numerze ${deliveryId} już istnieje`, 409);
      }

      // 5. Prześlij plik do S3
      const s3Key = `deliveries/${id_dostawcy}/${deliveryId}/${file.originalname}`;
      console.log("📤 [DeliveryService]: Rozpoczynam upload do S3...");
      const s3Result = await awsService.uploadFile(file.buffer, s3Key);
      console.log("✅ [DeliveryService]: Upload do S3 zakończony pomyślnie");
      console.log("🔗 [DeliveryService]: S3 URL:", s3Result.Location);

      // 6. Utwórz dostawę w bazie danych
      console.log("💾 [DeliveryService]: Rozpoczynam zapis do bazy danych...");
      const dostawa = await DostNowaDostawa.create(
        {
          id_dostawy: deliveryId,
          id_dostawcy,
          id_pliku: "", // Zostanie wygenerowane
          nazwa_pliku: file.originalname,
          url_pliku_S3: s3Result.Location,
          nr_palet_dostawy: this.formatPaletteNumbers(
            processedData.paletteNumbers,
          ),
          status_weryfikacji: "nowa",
        },
        { transaction },
      );

      // 7. Wygeneruj i zaktualizuj ID pliku
      const liczba_plikow = await DostNowaDostawa.count({
        where: { id_dostawcy },
        transaction,
      });

      const id_pliku = DostNowaDostawa.generateIdPliku(
        liczba_plikow,
        dostawa.id_dostawy,
      );
      await dostawa.update({ id_pliku }, { transaction });

      // 8. Dodaj produkty
      const products = await Promise.all(
        processedData.products.map((product) =>
          DostDostawyProdukty.create(
            {
              id_dostawy: dostawa.id_dostawy,
              nr_palety: product.nr_palety,
              nazwa_produktu: product.nazwa_produktu,
              kod_ean: product.kod_ean,
              kod_asin: product.kod_asin,
              LPN: product.lpn,
              ilosc: product.ilosc,
              cena_produktu_spec: product.cena_produktu_spec,
              stan_produktu: product.stan_produktu,
              kraj_pochodzenia: product.kraj_pochodzenia,
              kategoria_produktu: product.kategoria_produktu,
              status_weryfikacji: "nowy",
            },
            { transaction },
          ),
        ),
      );

      console.log("✅ [DeliveryService]: Dodano produkty do bazy danych");
      console.log("🔒 [DeliveryService]: Commituję transakcję...");
      await transaction.commit();
      console.log("✅ [DeliveryService]: Transakcja zatwierdzona");

      console.log(
        `🎉 [DeliveryService]: Przesłano i przetworzono plik ${file.originalname} dla dostawy ${dostawa.id_dostawy}`,
      );

      return {
        id_dostawy: dostawa.id_dostawy,
        id_dostawcy: dostawa.id_dostawcy,
        nazwa_pliku: dostawa.nazwa_pliku,
        nr_palet_dostawy: dostawa.nr_palet_dostawy || undefined,
        status_weryfikacji: dostawa.status_weryfikacji,
        liczba_produktow: products.length,
        wartosc_calkowita: processedData.totalValue,
        url_pliku_S3: dostawa.url_pliku_S3,
        data_utworzenia: dostawa.data_utworzenia.toISOString(),
      };
    } catch (error) {
      await transaction.rollback();
      console.error(
        "❌ [DeliveryService]: Błąd podczas przesyłania pliku:",
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas przesyłania pliku", 500);
    }
  }

  /**
   * 📤 Tworzy dostawę z pliku (dla testów jednostkowych)
   */
  async createDeliveryFromFile(
    file: Express.Multer.File,
    id_dostawcy: string,
  ): Promise<FileUploadResponse> {
    const transaction = await sequelize.transaction();

    try {
      // 1. Walidacja pliku
      this.validateFileFormat(file);

      // 2. Przetwórz plik Excel
      const processedData = this.processExcelFile(file);
      if (!processedData.deliveryNumber) {
        throw new AppError(
          "Nie można wyodrębnić numeru dostawy z nazwy pliku.",
          400,
        );
      }

      // 3. Sprawdź czy dostawa już istnieje
      const deliveryId = DostNowaDostawa.generateDeliveryId(
        processedData.deliveryNumber,
      );
      const existingDelivery = await DostNowaDostawa.findByPk(deliveryId);
      if (existingDelivery) {
        throw new AppError(`Dostawa o numerze ${deliveryId} już istnieje`, 409);
      }

      // 4. Mock S3 URL dla testów
      const mockS3Url = `https://test-bucket.s3.amazonaws.com/${file.originalname}`;

      // 5. Utwórz dostawę w bazie danych
      const dostawa = await DostNowaDostawa.create(
        {
          id_dostawy: deliveryId,
          id_dostawcy,
          id_pliku: "", // Zostanie wygenerowane
          nazwa_pliku: file.originalname,
          url_pliku_S3: mockS3Url,
          nr_palet_dostawy: this.formatPaletteNumbers(
            processedData.paletteNumbers,
          ),
          status_weryfikacji: "nowa",
        },
        { transaction },
      );

      // 6. Wygeneruj i zaktualizuj ID pliku
      const liczba_plikow = await DostNowaDostawa.count({
        where: { id_dostawcy },
        transaction,
      });

      const id_pliku = DostNowaDostawa.generateIdPliku(
        liczba_plikow,
        dostawa.id_dostawy,
      );
      await dostawa.update({ id_pliku }, { transaction });

      // 7. Dodaj produkty
      const products = await Promise.all(
        processedData.products.map((product) =>
          DostDostawyProdukty.create(
            {
              id_dostawy: dostawa.id_dostawy,
              nr_palety: product.nr_palety,
              nazwa_produktu: product.nazwa_produktu,
              kod_ean: product.kod_ean,
              kod_asin: product.kod_asin,
              LPN: product.lpn,
              ilosc: product.ilosc,
              cena_produktu_spec: product.cena_produktu_spec,
              stan_produktu: product.stan_produktu,
              kraj_pochodzenia: product.kraj_pochodzenia,
              kategoria_produktu: product.kategoria_produktu,
              status_weryfikacji: "nowy",
            },
            { transaction },
          ),
        ),
      );

      await transaction.commit();

      console.log(
        `✅ [DeliveryService]: Utworzono dostawę ${dostawa.id_dostawy} z pliku ${file.originalname}`,
      );

      return {
        id_dostawy: dostawa.id_dostawy,
        id_dostawcy: dostawa.id_dostawcy,
        nazwa_pliku: dostawa.nazwa_pliku,
        nr_palet_dostawy: dostawa.nr_palet_dostawy || undefined,
        status_weryfikacji: dostawa.status_weryfikacji,
        liczba_produktow: products.length,
        wartosc_calkowita: processedData.totalValue,
        url_pliku_S3: dostawa.url_pliku_S3,
        data_utworzenia: dostawa.data_utworzenia.toISOString(),
      };
    } catch (error) {
      await transaction.rollback();
      console.error(
        "❌ [DeliveryService]: Błąd podczas tworzenia dostawy z pliku:",
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas tworzenia dostawy z pliku", 500);
    }
  }

  /**
   * 👁️ Podgląd pliku bez zapisywania do bazy
   */
  async previewFile(file: Express.Multer.File): Promise<FilePreviewResponse> {
    try {
      const processedData = this.processExcelFile(file);
      const { deliveryNumber, paletteNumbers, products, totalValue } =
        processedData;

      const missingFields: ("deliveryNumber" | "paletteNumber")[] = [];
      if (!deliveryNumber) {
        missingFields.push("deliveryNumber");
      }
      // Prosta logika sprawdzająca, czy udało się wykryć jakiekolwiek numery palet
      if (paletteNumbers.length === 0) {
        missingFields.push("paletteNumber");
      }

      const status: PreviewStatus =
        missingFields.length > 0 ? "requires_manual_input" : "success";

      return {
        status,
        missingFields: missingFields.length > 0 ? missingFields : undefined,
        detectedDeliveryNumber: deliveryNumber,
        detectedPaletteNumbers: paletteNumbers,
        fileName: file.originalname,
        totalProducts: products.length,
        estimatedValue: totalValue,
        productSample: products.slice(0, 10),
        columnMapping: processedData.columnMapping,
        validationWarnings: this.validateProductData(products),
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error(
        `❌ [DeliveryService]: Błąd podczas tworzenia podglądu pliku:`,
        error,
      );
      throw new AppError("Błąd podczas przetwarzania pliku", 500);
    }
  }

  /**
   * 📊 Przetwarza plik Excel i wyciąga dane
   */
  private processExcelFile(file: Express.Multer.File): ProcessedExcelData {
    try {
      this.validateFileFormat(file);

      // 1. Wczytaj plik Excela
      const workbook = XLSX.read(file.buffer, {
        type: "buffer",
        cellNF: true, // Zachowaj formatowanie liczbowe komórek
        cellDates: true,
        raw: true,
      });

      // 2. Pobierz pierwszy arkusz
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new AppError("Plik Excel jest pusty lub nie zawiera danych", 400);
      }

      // 2. Konwertuj do JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      }) as any[][];

      if (jsonData.length < 2) {
        throw new AppError(
          "Plik Excel nie zawiera wystarczających danych",
          400,
        );
      }

      // 3. Wykryj mapowanie kolumn
      const rawHeaders = jsonData[0] || [];
      console.log("🔍 Raw headers z Excel:", rawHeaders);
      console.log(
        "🔍 Types of headers:",
        rawHeaders.map((h: any) => typeof h),
      );

      const headers: string[] = rawHeaders.map((header: any) =>
        header && typeof header === "string" ? header : String(header || ""),
      );
      console.log("🔍 Processed headers:", headers);

      const columnMapping = this.detectColumnMapping(headers);
      console.log("🔍 Column mapping:", columnMapping);

      // 4. Wyodrębnij numer dostawy z nazwy pliku
      const deliveryNumber = DostNowaDostawa.extractDeliveryNumberFromFilename(
        file.originalname,
      );

      // 5. Przetwórz produkty i palety
      const products: PreviewProduct[] = [];
      const paletteNumbers = new Set<string>();
      let totalValue = 0;

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        const product = this.mapRowToProduct(row, headers, columnMapping);
        if (product) {
          products.push(product);
          if (product.nr_palety) {
            paletteNumbers.add(product.nr_palety);
          }
          if (product.cena_produktu_spec && product.ilosc) {
            totalValue += product.cena_produktu_spec * product.ilosc;
          }
        }
      }

      // 6. Walidacja krytycznych błędów danych
      this.validateCriticalProductData(products);

      return {
        deliveryNumber,
        products,
        paletteNumbers: Array.from(paletteNumbers),
        totalValue,
        columnMapping,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Błąd przetwarzania pliku Excel:", error);
      throw new AppError("Nie można przetworzyć pliku Excel", 500);
    }
  }

  /**
   * 🔎 Wykrywa mapowanie kolumn na podstawie nagłówków
   */
  public detectColumnMapping(headers: string[]): ColumnMapping {
    const mapping: ColumnMapping = {};

    const headerMap: Record<string, keyof ColumnMapping> = {
      // Numer palety
      "nr palety": "paletteNumber",
      "numer palety": "paletteNumber",
      pallet: "paletteNumber",
      palette: "paletteNumber",

      // Nazwa produktu
      "item desc": "productName",
      "nazwa produktu": "productName",
      "product name": "productName",
      description: "productName",

      // EAN
      ean: "ean",
      "kod ean": "ean",
      "ean code": "ean",

      // ASIN
      asin: "asin",
      "kod asin": "asin",
      "asin code": "asin",

      // Ilość
      ilosc: "quantity",
      ilość: "quantity",
      quantity: "quantity",
      qty: "quantity",

      // Cena
      wartość: "price",
      wartosc: "price",
      "unit retail": "price",
      price: "price",
      cena: "price",

      // LPN
      lpn: "lpn",

      // Stan
      stan: "condition",
      condition: "condition",

      // Kraj
      kraj: "country",
      country: "country",
      origin: "country",

      // Dział/Kategoria
      department: "department",
      dzial: "department",
      category: "category",
      kategoria: "category",
      subcategory: "subcategory",
      podkategoria: "subcategory",
    };

    // Mapuj nagłówki (case-insensitive) z priorytetami
    headers.forEach((header, index) => {
      // Sprawdź czy header jest stringiem
      if (typeof header !== "string" || !header) {
        return; // Pomiń null, undefined, liczby itp.
      }

      const normalizedHeader = header.toLowerCase().trim();
      const mappedField = headerMap[normalizedHeader];
      if (mappedField) {
        // Jeśli to pole już istnieje, sprawdź priorytet
        if (mapping[mappedField]) {
          // Priorytet dla ceny: "unit retail" > "price" > "cena" > "wartość"
          if (mappedField === "price") {
            const currentHeader = mapping[mappedField]?.toLowerCase();
            if (
              normalizedHeader === "unit retail" ||
              (normalizedHeader === "price" && currentHeader === "wartość") ||
              (normalizedHeader === "cena" && currentHeader === "wartość")
            ) {
              mapping[mappedField] = header;
            }
          } else {
            // Dla innych pól - zachowaj pierwszy znaleziony
            // mapping[mappedField] = header; // Nie nadpisuj
          }
        } else {
          // Pierwsze mapowanie tego pola
          mapping[mappedField] = header;
        }
      }
    });

    console.log("🔧 Final mapping after priorities:", mapping);
    return mapping;
  }

  /**
   * 🔄 Mapuje wiersz danych na obiekt produktu
   */
  private mapRowToProduct(
    row: any[],
    headers: string[],
    columnMapping: ColumnMapping,
  ): PreviewProduct | null {
    try {
      const getColumnValue = (field: keyof ColumnMapping): any => {
        const columnName = columnMapping[field as keyof typeof columnMapping];
        if (!columnName) return undefined;
        const columnIndex = headers.indexOf(columnName as string);
        return columnIndex >= 0 ? row[columnIndex] : undefined;
      };

      const productName = getColumnValue("productName");
      if (!productName || productName.toString().trim() === "") {
        return null; // Pomiń wiersze bez nazwy produktu
      }

      // Inteligentne fallback dla brakujących danych
      const eanValue =
        getColumnValue("ean") ||
        row.find((cell) => cell && this.looksLikeEAN(cell)) || // Szukaj EAN-podobnych wartości
        getColumnValue("productName")
          ?.toString()
          .match(/\b\d{8,13}\b/)?.[0]; // Numer w nazwie

      // Inteligentne wyszukiwanie ceny z priorytetami
      let priceValue = getColumnValue("price");

      // Jeśli zmapowana kolumna jest pusta, szukaj w innych kolumnach cenowych
      if (!priceValue || priceValue === "") {
        // Szukaj w znanych kolumnach cenowych w kolejności priorytetów
        const priceHeaders = [
          "Unit Retail",
          "unit retail",
          "Price",
          "price",
          "Cena",
          "cena",
        ];
        for (const priceHeader of priceHeaders) {
          const priceIndex = headers.findIndex(
            (h) =>
              typeof h === "string" &&
              h.toLowerCase().trim() === priceHeader.toLowerCase(),
          );
          if (priceIndex >= 0 && row[priceIndex] && row[priceIndex] !== "") {
            priceValue = row[priceIndex];
            console.log(
              `💰 Found price in column '${headers[priceIndex]}':`,
              priceValue,
            );
            break;
          }
        }
      }

      // Jeśli nadal nie ma, szukaj w całym wierszu
      if (!priceValue || priceValue === "") {
        priceValue = row.find((cell) => cell && this.looksLikePrice(cell)); // Szukaj wartości podobnych do ceny
      }

      return {
        nr_palety: getColumnValue("paletteNumber")?.toString(),
        nazwa_produktu: productName.toString().trim(),
        kod_ean: this.normalizeEAN(eanValue),
        kod_asin: getColumnValue("asin")?.toString(),
        lpn: getColumnValue("lpn")?.toString(),
        ilosc: this.parseNumber(getColumnValue("quantity")) ?? 1,
        cena_produktu_spec: this.parseNumber(priceValue) ?? undefined,
        stan_produktu: getColumnValue("condition")?.toString(),
        kraj_pochodzenia: getColumnValue("country")?.toString(),
        kategoria_produktu:
          getColumnValue("category")?.toString() ||
          getColumnValue("department")?.toString(),
      };
    } catch (error) {
      console.error("Błąd mapowania wiersza na produkt:", error);
      return null;
    }
  }

  /**
   * 🔍 Sprawdza czy wartość wygląda jak EAN/UPC/SKU
   */
  private looksLikeEAN(value: any): boolean {
    if (!value) return false;
    const str = value.toString().trim();

    // Cyfry o długości 8-13 znaków (EAN-8, EAN-13, UPC)
    if (/^\d{8,13}$/.test(str)) return true;

    // Kod alfanumeryczny (SKU)
    if (/^[A-Z0-9]{5,20}$/i.test(str)) return true;

    // ISBN format
    if (/^\d{3}-?\d{1,5}-?\d{1,7}-?\d{1,7}-?\d{1}$/.test(str)) return true;

    return false;
  }

  /**
   * 💰 Sprawdza czy wartość wygląda jak cena
   */
  private looksLikePrice(value: any): boolean {
    if (!value) return false;
    const str = value.toString().trim();

    // Liczba z możliwymi separatorami (1234.56, 1,234.56, 1234,56)
    if (/^\d{1,8}[.,]?\d{0,2}$/.test(str.replace(/[\s,]/g, ""))) {
      const num = parseFloat(str.replace(/[,\s]/g, "."));
      return !isNaN(num) && num > 0 && num < 100000; // Rozsądny zakres cen
    }

    return false;
  }

  /**
   * 🏷️ Formatuje numery palet z ograniczeniem długości
   */
  private formatPaletteNumbers(paletteNumbers: string[]): string {
    const maxLength = 500; // MySQL TEXT limit safety
    const joined = paletteNumbers.join(", ");

    if (joined.length <= maxLength) {
      return joined;
    }

    // Jeśli za długie, pokaż pierwsze kilka i dodaj informację o liczbie
    const truncated = paletteNumbers.slice(0, 10).join(", ");
    const remaining = paletteNumbers.length - 10;
    return `${truncated}... (+${remaining} więcej)`;
  }

  /**
   * 🔢 Parsuje liczby z różnych formatów
   */
  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    // Jeśli już jest liczbą
    if (typeof value === "number") {
      return isNaN(value) ? null : value;
    }

    // Konwertuj string
    const stringValue = value.toString().trim();
    if (stringValue === "") return null;

    // Ujednolić separator dziesiętny do kropki i usunąć wszystko co nie jest cyfrą lub kropką
    const cleaned = stringValue.replace(/,/g, ".").replace(/[^\d.]/g, "");
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? null : parsed;
  }

  /**
   * 📊 Normalizuje kod EAN
   */
  private normalizeEAN(value: any): string | undefined {
    if (!value) return undefined;

    let ean = value.toString().trim();

    // Obsługa notacji naukowej dla EAN
    if (ean.includes("E") || ean.includes("e")) {
      const parsed = parseFloat(ean);
      if (!isNaN(parsed)) {
        ean = Math.round(parsed).toString();
      }
    }

    // Usuń wszystkie znaki niebędące cyframi
    ean = ean.replace(/\D/g, "");

    // Sprawdź długość (EAN-13 lub EAN-8)
    if (ean.length === 13 || ean.length === 8) {
      return ean;
    }

    // Jeśli za krótki, dopełnij zerami z lewej strony do 13 znaków
    if (ean.length < 13 && ean.length > 0) {
      return ean.padStart(13, "0");
    }

    return ean.length > 0 ? ean : undefined;
  }

  /**
   * ✅ Waliduje format pliku
   */
  private validateFileFormat(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "application/vnd.ms-excel.sheet.macroEnabled.12", // .xlsm (stara wersja)
      "application/vnd.ms-excel.sheet.macroenabled.12", // .xlsm (nowa wersja - mała litera)
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new AppError(
        "Nieprawidłowy format pliku. Obsługiwane formaty: .xlsx, .xls, .xlsm",
        400,
      );
    }

    // Sprawdź rozmiar pliku (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new AppError(
        "Plik jest zbyt duży. Maksymalny rozmiar to 10MB",
        413,
      );
    }
  }

  /**
   * 🚨 Waliduje krytyczne błędy danych produktów - rzuca błąd przy poważnych problemach
   */
  private validateCriticalProductData(products: PreviewProduct[]): void {
    if (products.length === 0) {
      throw new AppError(
        "Nieprawidłowe dane produktu: Brak produktów w pliku",
        400,
      );
    }

    const criticalIssues: string[] = [];
    let emptyProducts = 0;
    let invalidQuantities = 0;

    products.forEach((product, index) => {
      // Sprawdź pusty produkty (bez nazwy)
      if (!product.nazwa_produktu || product.nazwa_produktu.trim() === "") {
        emptyProducts++;
      }

      // Sprawdź ujemne lub zerowe ilości
      if (product.ilosc !== null && product.ilosc <= 0) {
        invalidQuantities++;
      }
    });

    // Jeśli więcej niż 50% produktów ma pusté nazwy
    if (emptyProducts > products.length * 0.5) {
      criticalIssues.push(`${emptyProducts} produktów bez nazwy`);
    }

    // Jeśli więcej niż 50% produktów ma nieprawidłowe ilości
    if (invalidQuantities > products.length * 0.5) {
      criticalIssues.push(
        `${invalidQuantities} produktów z nieprawidłową ilością`,
      );
    }

    if (criticalIssues.length > 0) {
      throw new AppError(
        `Nieprawidłowe dane produktu: ${criticalIssues.join(", ")}`,
        400,
      );
    }
  }

  /**
   * ⚠️ Waliduje dane produktów i zwraca ostrzeżenia (bardzo liberalne podejście)
   */
  private validateProductData(products: PreviewProduct[]): string[] {
    const warnings: string[] = [];

    if (products.length === 0) {
      warnings.push("Brak produktów w pliku");
      return warnings;
    }

    let missingEAN = 0;
    let missingASIN = 0;
    let missingPrice = 0;
    let invalidQuantity = 0;
    let totalProducts = products.length;

    products.forEach((product) => {
      if (!product.kod_ean) missingEAN++;
      if (!product.kod_asin) missingASIN++;
      if (!product.cena_produktu_spec || product.cena_produktu_spec <= 0)
        missingPrice++;
      if (!product.ilosc || product.ilosc <= 0) invalidQuantity++;
    });

    // Bardzo wysokie progi - ostrzeżenia tylko przy masowych problemach

    // EAN/UPC/SKU - ostrzeżenie dopiero gdy >95% produktów bez kodu
    if (missingEAN > totalProducts * 0.95) {
      warnings.push(
        `${missingEAN}/${totalProducts} produktów bez kodu identyfikacyjnego (EAN/UPC/SKU) - sprawdź mapowanie kolumn`,
      );
    } else if (missingEAN > totalProducts * 0.8) {
      warnings.push(
        `${missingEAN} produktów bez kodu identyfikacyjnego - możliwe problemy z mapowaniem`,
      );
    }

    // ASIN - ostrzeżenie dopiero gdy >90% (nie każdy sprzedaje na Amazon)
    if (missingASIN > totalProducts * 0.9) {
      warnings.push(
        `${missingASIN} produktów bez kodu ASIN - sprawdź czy kolumna istnieje (opcjonalne dla sprzedaży poza Amazon)`,
      );
    }

    // Cena - ostrzeżenie dopiero gdy >70% bez ceny
    if (missingPrice > totalProducts * 0.7) {
      warnings.push(
        `${missingPrice} produktów bez ceny - wymagana aktualizacja przed importem`,
      );
    }

    // Ilość - ostrzeżenie dopiero gdy >20% nieprawidłowych ilości
    if (invalidQuantity > totalProducts * 0.2) {
      warnings.push(
        `${invalidQuantity} produktów z nieprawidłową ilością - wymaga korekty przed importem`,
      );
    }

    return warnings;
  }

  /**
   * 🔧 Pomocnicze metody formatowania
   */
  private formatDeliveryResponse(dostawa: DostNowaDostawa): DeliveryResponse {
    return {
      id_dostawy: dostawa.id_dostawy,
      id_dostawcy: dostawa.id_dostawcy,
      id_pliku: dostawa.id_pliku,
      nazwa_pliku: dostawa.nazwa_pliku,
      url_pliku_S3: dostawa.url_pliku_S3,
      nr_palet_dostawy: dostawa.nr_palet_dostawy || undefined,
      status_weryfikacji: dostawa.status_weryfikacji,
      data_utworzenia: dostawa.data_utworzenia.toISOString(),
      data_aktualizacji: dostawa.data_aktualizacji.toISOString(),
    };
  }

  private formatProductResponse(product: DostDostawyProdukty): ProductResponse {
    return {
      id_produktu_dostawy: product.id_produktu_dostawy,
      id_dostawy: product.id_dostawy ?? undefined,
      nr_palety: product.nr_palety ?? undefined,
      LPN: product.LPN ?? undefined,
      kod_ean: product.kod_ean ?? undefined,
      kod_asin: product.kod_asin ?? undefined,
      nazwa_produktu: product.nazwa_produktu,
      ilosc: product.ilosc,
      cena_produktu_spec: product.cena_produktu_spec ?? undefined,
      stan_produktu: product.stan_produktu ?? undefined,
      kraj_pochodzenia: product.kraj_pochodzenia ?? undefined,
      kategoria_produktu: product.kategoria_produktu ?? undefined,
      status_weryfikacji: product.status_weryfikacji,
      uwagi_weryfikacji: product.uwagi_weryfikacji ?? undefined,
      data_utworzenia: product.data_utworzenia.toISOString(),
      data_aktualizacji: product.data_aktualizacji.toISOString(),
    };
  }

  private formatInvoiceResponse(
    invoice: DostFakturyDostawcow,
  ): InvoiceResponse {
    return {
      id_faktury: invoice.id_faktury,
      id_dostawcy: invoice.id_dostawcy,
      id_dostawy: invoice.id_dostawy || undefined,
      numer_faktury: invoice.numer_faktury,
      data_faktury: invoice.data_faktury.toISOString().split("T")[0],
      data_platnosci: invoice.data_platnosci.toISOString().split("T")[0],
      kwota_brutto_razem: Number(invoice.kwota_brutto_razem),
      kwota_netto_razem: Number(invoice.kwota_netto_razem),
      waluta: invoice.waluta,
      status_platnosci: invoice.status_platnosci,
      data_platnosci_faktycznej: invoice.data_platnosci_faktycznej
        ?.toISOString()
        .split("T")[0],
      data_utworzenia: invoice.data_utworzenia.toISOString(),
      data_aktualizacji: invoice.data_aktualizacji.toISOString(),
    };
  }

  private formatFinancesResponse(
    finances: DostFinanseDostaw,
  ): FinancesResponse {
    return {
      id_finanse_dostawy: finances.id_finanse_dostawy,
      id_dostawy: finances.id_dostawy,
      suma_produktow: finances.suma_produktow,
      wartosc_produktow_spec: Number(finances.wartosc_produktow_spec),
      stawka_vat: Number(finances.stawka_vat),
      procent_wartosci: Number(finances.procent_wartosci),
      wartosc_brutto: Number(finances.wartosc_brutto),
      koszt_pln_brutto: Number(finances.koszt_pln_brutto),
      koszt_pln_netto: Number(finances.koszt_pln_netto),
      waluta: finances.waluta,
      kurs_wymiany: finances.kurs_wymiany
        ? Number(finances.kurs_wymiany)
        : undefined,
      data_utworzenia: finances.data_utworzenia.toISOString(),
      data_aktualizacji: finances.data_aktualizacji.toISOString(),
      margin: finances.getMargin(),
      profit_pln: finances.getProfitPLN(),
    };
  }
}
