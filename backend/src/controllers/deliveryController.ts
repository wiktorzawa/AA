import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { DeliveryService } from "../services/deliveryService";
import {
  CreateDeliveryRequest,
  UpdateDeliveryStatusRequest,
  DeliveryFilters,
  PaginationParams,
} from "../types/delivery.types";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";
import { DELIVERY_STATUS, DeliveryStatus } from "../constants";

const isValidDeliveryStatus = (status: unknown): status is DeliveryStatus => {
  return Object.values(DELIVERY_STATUS).includes(status as DeliveryStatus);
};

const parseDeliveryQueryParams = (
  query: Record<string, unknown>,
): Partial<DeliveryFilters & PaginationParams> => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    id_dostawcy,
    status_weryfikacji,
    data_od,
    data_do,
    nazwa_pliku,
  } = query;

  return {
    page: page ? parseInt(String(page), 10) : undefined,
    limit: limit ? parseInt(String(limit), 10) : undefined,
    sortBy: sortBy ? String(sortBy) : undefined,
    sortOrder: sortOrder === "ASC" || sortOrder === "DESC" ? sortOrder : "DESC",
    id_dostawcy: id_dostawcy ? String(id_dostawcy) : undefined,
    status_weryfikacji: isValidDeliveryStatus(status_weryfikacji)
      ? status_weryfikacji
      : undefined,
    data_od: data_od ? String(data_od) : undefined,
    data_do: data_do ? String(data_do) : undefined,
    nazwa_pliku: nazwa_pliku ? String(nazwa_pliku) : undefined,
  };
};

export class DeliveryController {
  private deliveryService = new DeliveryService();

  /**
   * Pobiera wszystkie dostawy z filtrami i paginacją
   */
  public getAllDeliveries = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const queryParams = parseDeliveryQueryParams(req.query);
      const result = await this.deliveryService.getDeliveries(queryParams);

      res.json({
        success: true,
        ...result,
      });
    },
  );

  /**
   * Pobiera dostawę po ID
   */
  public getDeliveryById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const includeRelations = req.query.include !== "false";

      const delivery = await this.deliveryService.getDeliveryById(
        id,
        includeRelations,
      );

      res.json({
        success: true,
        data: delivery,
      });
    },
  );

  /**
   * Pobiera produkty dla konkretnej dostawy
   */
  public getProductsByDeliveryId = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { deliveryId } = req.params;

      const products =
        await this.deliveryService.getProductsByDeliveryId(deliveryId);

      res.json({
        success: true,
        data: products,
      });
    },
  );

  /**
   * Tworzy nową dostawę
   */
  public createDelivery = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const deliveryData = req.body as CreateDeliveryRequest;

      // Walidacja danych wejściowych
      if (
        !deliveryData.id_dostawcy ||
        !deliveryData.nazwa_pliku ||
        !deliveryData.url_pliku_S3
      ) {
        throw new AppError("Wszystkie wymagane pola muszą być wypełnione", 400);
      }

      const delivery = await this.deliveryService.createDelivery(deliveryData);

      res.status(201).json({
        success: true,
        data: delivery,
      });
    },
  );

  /**
   * Aktualizuje status dostawy
   */
  public updateDeliveryStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const statusData = req.body as UpdateDeliveryStatusRequest;

      if (!statusData.status_weryfikacji) {
        throw new AppError("Status weryfikacji jest wymagany", 400);
      }

      const delivery = await this.deliveryService.updateDeliveryStatus(
        id,
        statusData,
      );

      res.json({
        success: true,
        data: delivery,
      });
    },
  );

  /**
   * Usuwa dostawę
   */
  public deleteDelivery = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      await this.deliveryService.deleteDelivery(id);

      res.json({
        success: true,
        message: "Dostawa została usunięta",
      });
    },
  );

  /**
   * Pobiera statystyki dostaw
   */
  public getDeliveryStats = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const stats = await this.deliveryService.getDeliveryStats();

      res.json({
        success: true,
        data: stats,
      });
    },
  );

  /**
   * Pobiera dostawy dla konkretnego dostawcy
   */
  public getDeliveriesBySupplier = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { supplierId } = req.params;

      const queryParams = parseDeliveryQueryParams({
        ...req.query,
        id_dostawcy: supplierId,
      });

      const result = await this.deliveryService.getDeliveries(queryParams);

      res.json({
        success: true,
        ...result,
      });
    },
  );

  /**
   * Pobiera dostawy według statusu
   */
  public getDeliveriesByStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { status } = req.params;

      const queryParams = parseDeliveryQueryParams({
        ...req.query,
        status_weryfikacji: status,
      });

      const result = await this.deliveryService.getDeliveries(queryParams);

      res.json({
        success: true,
        ...result,
      });
    },
  );

  /**
   * Przesyła i przetwarza plik dostawy
   */
  public uploadDeliveryFile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      logger.info("DeliveryController uploadDeliveryFile called", {
        bodyKeys: Object.keys(req.body),
        filesKeys: req.files ? Object.keys(req.files) : "none",
      });

      // Plik, dane i uprawnienia są już zwalidowane przez middleware
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const file = files?.deliveryFile?.[0] || files?.file?.[0];

      // ID dostawcy jest już zwalidowane i ustawione przez middleware
      const supplierId = req.body.id_dostawcy;

      // Sprawdź potwierdzenie numeru dostawy (opcjonalne dla kompatybilności wstecznej)
      const confirmDeliveryNumber = req.body.confirmDeliveryNumber;

      // Odczytaj i sparsuj mapowanie kolumn, jeśli zostało przesłane
      let columnMapping;
      if (req.body.columnMapping) {
        try {
          columnMapping = JSON.parse(req.body.columnMapping);
        } catch (error) {
          throw new AppError("Nieprawidłowy format mapowania kolumn.", 400);
        }
      }

      const result = await this.deliveryService.uploadAndProcessFile(
        file!,
        supplierId,
        confirmDeliveryNumber,
        columnMapping,
      );

      logger.info("DeliveryController sending response", { statusCode: 201 });
      res.status(201).json({
        success: true,
        message: "Plik został pomyślnie przesłany i przetworzony",
        data: result,
      });
      logger.info("DeliveryController response sent successfully");
    },
  );

  /**
   * 🆕 Generuje podgląd pliku dostawy
   */
  public previewDeliveryFile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Plik i uprawnienia są już zwalidowane przez middleware
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const file = files?.deliveryFile?.[0] || files?.file?.[0] || req.file;

      const preview = await this.deliveryService.previewFile(file!);

      res.json({
        success: true,
        data: preview,
      });
    },
  );

  /**
   * ✅ Potwierdza i zapisuje dostawę po weryfikacji
   */
  public confirmDelivery = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      logger.info("DeliveryController confirmDelivery called", {
        bodyKeys: Object.keys(req.body),
        filesKeys: req.files ? Object.keys(req.files) : "none",
      });

      // Plik, dane i uprawnienia są już zwalidowane przez middleware
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const file = files?.deliveryFile?.[0] || files?.file?.[0];

      // ID dostawcy jest już zwalidowane i ustawione przez middleware
      const supplierId = req.body.id_dostawcy;

      // Dane potwierdzenia są już zwalidowane przez middleware
      const confirmationData = {
        fileName: req.body.fileName,
        detectedDeliveryNumber: req.body.detectedDeliveryNumber,
        confirmedDeliveryNumber: req.body.confirmedDeliveryNumber,
        detectedPaletteNumbers: req.body.detectedPaletteNumbers
          ? JSON.parse(req.body.detectedPaletteNumbers)
          : undefined,
        confirmedPaletteNumbers: req.body.confirmedPaletteNumbers
          ? JSON.parse(req.body.confirmedPaletteNumbers)
          : undefined,
        productCorrections: req.body.productCorrections
          ? JSON.parse(req.body.productCorrections)
          : undefined,
        bypassValidation: req.body.bypassValidation === "true",
      };

      const result = await this.deliveryService.confirmAndSaveDelivery(
        file!,
        supplierId,
        confirmationData,
      );

      logger.info("DeliveryController confirmDelivery sending response", {
        statusCode: 201,
      });
      res.status(201).json({
        success: true,
        message: "Dostawa została pomyślnie potwierdzona i zapisana",
        data: result,
      });
      logger.info(
        "DeliveryController confirmDelivery response sent successfully",
      );
    },
  );
}

export default new DeliveryController();
