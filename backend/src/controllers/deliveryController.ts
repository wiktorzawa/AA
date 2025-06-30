import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { DeliveryService } from "../services/deliveryService";
import {
  CreateDeliveryRequest,
  UpdateDeliveryStatusRequest,
  DeliveryFilters,
  PaginationParams,
} from "../types/delivery.types";
import { AuthenticatedRequest } from "../types/auth.types";

export class DeliveryController {
  private deliveryService = new DeliveryService();

  /**
   * Pobiera wszystkie dostawy z filtrami i paginacją
   */
  public getAllDeliveries = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // Parsuj filtry z query params
        const filters: DeliveryFilters = {
          id_dostawcy: req.query.id_dostawcy as string,
          status_weryfikacji: req.query.status_weryfikacji as any,
          data_od: req.query.data_od as string,
          data_do: req.query.data_do as string,
          nazwa_pliku: req.query.nazwa_pliku as string,
        };

        // Parsuj parametry paginacji
        const pagination: PaginationParams = {
          page: req.query.page ? parseInt(req.query.page as string) : undefined,
          limit: req.query.limit
            ? parseInt(req.query.limit as string)
            : undefined,
          sortBy: req.query.sortBy as string,
          sortOrder: req.query.sortOrder as "ASC" | "DESC",
        };

        const result = await this.deliveryService.getDeliveries(
          filters,
          pagination,
        );

        res.json({
          success: true,
          ...result,
        });
      } catch (error) {
        console.error("Błąd podczas pobierania dostaw:", error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Pobiera dostawę po ID
   */
  public getDeliveryById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const includeRelations = req.query.include !== "false";

      try {
        const delivery = await this.deliveryService.getDeliveryById(
          id,
          includeRelations,
        );

        res.json({
          success: true,
          data: delivery,
        });
      } catch (error: unknown) {
        console.error(`Błąd podczas pobierania dostawy o ID ${id}:`, error);

        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          "message" in error
        ) {
          res.status(error.statusCode as number).json({
            success: false,
            error: error.message as string,
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Błąd serwera",
          });
        }
      }
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
        res.status(400).json({
          success: false,
          error: "Wszystkie wymagane pola muszą być wypełnione",
        });
        return;
      }

      try {
        const delivery =
          await this.deliveryService.createDelivery(deliveryData);

        res.status(201).json({
          success: true,
          data: delivery,
        });
      } catch (error: unknown) {
        console.error("Błąd podczas tworzenia dostawy:", error);

        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          "message" in error
        ) {
          res.status(error.statusCode as number).json({
            success: false,
            error: error.message as string,
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Błąd serwera",
          });
        }
      }
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
        res.status(400).json({
          success: false,
          error: "Status weryfikacji jest wymagany",
        });
        return;
      }

      try {
        const delivery = await this.deliveryService.updateDeliveryStatus(
          id,
          statusData,
        );

        res.json({
          success: true,
          data: delivery,
        });
      } catch (error: unknown) {
        console.error(
          `Błąd podczas aktualizacji statusu dostawy o ID ${id}:`,
          error,
        );

        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          "message" in error
        ) {
          res.status(error.statusCode as number).json({
            success: false,
            error: error.message as string,
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Błąd serwera",
          });
        }
      }
    },
  );

  /**
   * Usuwa dostawę
   */
  public deleteDelivery = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      try {
        await this.deliveryService.deleteDelivery(id);

        res.json({
          success: true,
          message: "Dostawa została usunięta",
        });
      } catch (error: unknown) {
        console.error(`Błąd podczas usuwania dostawy o ID ${id}:`, error);

        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          "message" in error
        ) {
          res.status(error.statusCode as number).json({
            success: false,
            error: error.message as string,
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Błąd serwera",
          });
        }
      }
    },
  );

  /**
   * Pobiera statystyki dostaw
   */
  public getDeliveryStats = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const stats = await this.deliveryService.getDeliveryStats();

        res.json({
          success: true,
          data: stats,
        });
      } catch (error) {
        console.error("Błąd podczas pobierania statystyk dostaw:", error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Pobiera dostawy dla konkretnego dostawcy
   */
  public getDeliveriesBySupplier = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { supplierId } = req.params;

      try {
        const filters: DeliveryFilters = { id_dostawcy: supplierId };
        const pagination: PaginationParams = {
          page: req.query.page ? parseInt(req.query.page as string) : 1,
          limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        };

        const result = await this.deliveryService.getDeliveries(
          filters,
          pagination,
        );

        res.json({
          success: true,
          ...result,
        });
      } catch (error) {
        console.error(
          `Błąd podczas pobierania dostaw dla dostawcy ${supplierId}:`,
          error,
        );
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Pobiera dostawy według statusu
   */
  public getDeliveriesByStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { status } = req.params;

      try {
        const filters: DeliveryFilters = { status_weryfikacji: status as any };
        const pagination: PaginationParams = {
          page: req.query.page ? parseInt(req.query.page as string) : 1,
          limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        };

        const result = await this.deliveryService.getDeliveries(
          filters,
          pagination,
        );

        res.json({
          success: true,
          ...result,
        });
      } catch (error) {
        console.error(
          `Błąd podczas pobierania dostaw o statusie ${status}:`,
          error,
        );
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Przesyła i przetwarza plik dostawy
   */
  public uploadDeliveryFile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      console.log("🚀 [DeliveryController]: uploadDeliveryFile wywołane");
      console.log("📝 [DeliveryController]: Body:", Object.keys(req.body));
      console.log(
        "📎 [DeliveryController]: Files:",
        req.files ? Object.keys(req.files) : "brak",
      );

      try {
        // Obsługa zarówno 'deliveryFile' jak i 'file' dla kompatybilności
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
        const file = files?.deliveryFile?.[0] || files?.file?.[0];

        if (!file) {
          res.status(400).json({
            success: false,
            error: "Brak pliku do przesłania",
          });
          return;
        }

        // Określ ID dostawcy - obsługa różnych nazw pól dla kompatybilności
        let supplierId = req.body.id_dostawcy || req.body.supplierId;
        if (!supplierId && req.user?.rola_uzytkownika === "supplier") {
          supplierId = req.user.id_uzytkownika;
        }

        if (!supplierId) {
          res.status(400).json({
            success: false,
            error: "ID dostawcy jest wymagane",
          });
          return;
        }

        // Sprawdź potwierdzenie numeru dostawy (opcjonalne dla kompatybilności wstecznej)
        const confirmDeliveryNumber = req.body.confirmDeliveryNumber;

        const result = await this.deliveryService.uploadAndProcessFile(
          file,
          supplierId,
          confirmDeliveryNumber,
        );

        console.log("✅ [DeliveryController]: Wysyłam response 201");
        res.status(201).json({
          success: true,
          message: "Plik został pomyślnie przesłany i przetworzony",
          data: result,
        });
        console.log("🎉 [DeliveryController]: Response wysłany");
      } catch (error: unknown) {
        console.error(
          "❌ [DeliveryController]: Błąd podczas przesyłania pliku:",
          error,
        );

        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          "message" in error
        ) {
          console.log(
            "🔴 [DeliveryController]: Wysyłam error response",
            error.statusCode,
            error.message,
          );
          res.status(error.statusCode as number).json({
            success: false,
            error: error.message as string,
          });
        } else {
          console.log("🔴 [DeliveryController]: Wysyłam error response 500");
          res.status(500).json({
            success: false,
            error: "Błąd serwera podczas przesyłania pliku",
          });
        }
        console.log("💥 [DeliveryController]: Error response wysłany");
      }
    },
  );

  /**
   * 🆕 Generuje podgląd pliku dostawy
   */
  public previewDeliveryFile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Obsługa zarówno 'deliveryFile' jak i 'file' dla kompatybilności
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const file = files?.deliveryFile?.[0] || files?.file?.[0] || req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          error: "Brak pliku do przetworzenia",
        });
        return;
      }

      try {
        const preview = await this.deliveryService.previewFile(file);

        res.json({
          success: true,
          data: {
            detectedDeliveryNumber: preview.detectedDeliveryNumber,
            fileName: preview.fileName,
            totalProducts: preview.totalProducts,
            estimatedValue: preview.estimatedValue,
            productSample: preview.productSample,
          },
        });
      } catch (error: unknown) {
        console.error("Błąd podczas generowania podglądu:", error);
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          "message" in error
        ) {
          res.status(error.statusCode as number).json({
            success: false,
            error: error.message as string,
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Błąd serwera podczas generowania podglądu",
          });
        }
      }
    },
  );
}

export default new DeliveryController();
