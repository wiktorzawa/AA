import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";

// Middleware sprawdzający czy supplier może dostać się do swojej dostawy
export const checkSupplierDeliveryAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { user } = req;

    if (!user) {
      throw new AppError("Brak danych użytkownika", 401);
    }

    // Admin ma pełny dostęp
    if (user.rola_uzytkownika === "admin") {
      return next();
    }

    // Staff może czytać wszystko, ale nie może tworzyć/aktualizować w imieniu dostawcy
    if (user.rola_uzytkownika === "staff") {
      const isWriteRequest = req.method === "POST" || req.method === "PATCH";
      if (isWriteRequest && req.body.id_dostawcy) {
        throw new AppError("Brak uprawnień do tej dostawy", 403);
      }
      return next();
    }

    // Supplier może dostać się tylko do swoich dostaw
    if (user.rola_uzytkownika === "supplier") {
      const supplierIdFromQuery = req.query.id_dostawcy as string;
      const supplierIdFromBody = req.body.id_dostawcy || req.body.supplierId;

      // Sprawdź ID dostawcy z różnych źródeł
      const targetSupplierId = supplierIdFromQuery || supplierIdFromBody;

      if (targetSupplierId && targetSupplierId !== user.id_uzytkownika) {
        throw new AppError("Brak uprawnień do tej dostawy", 403);
      }

      // 🆕 Jeśli supplier nie podał ID lub tworzy dostawę, ustaw jego ID automatycznie
      if (!supplierIdFromBody && req.method === "POST") {
        req.body.id_dostawcy = user.id_uzytkownika;
        logger.info("Automatycznie ustawiono ID dostawcy", {
          userId: user.id_uzytkownika,
          method: req.method,
          path: req.path,
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware sprawdzający czy użytkownik może modyfikować dostawę
export const checkDeliveryModifyPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { user } = req;

    if (!user) {
      throw new AppError("Brak danych użytkownika", 401);
    }

    // Tylko Admin i Staff mogą modyfikować statusy dostaw
    if (
      user.rola_uzytkownika !== "admin" &&
      user.rola_uzytkownika !== "staff"
    ) {
      throw new AppError("Brak uprawnień do modyfikacji dostaw", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware sprawdzający czy użytkownik może usuwać dostawy
export const checkDeliveryDeletePermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { user } = req;

    if (!user) {
      throw new AppError("Brak danych użytkownika", 401);
    }

    // Tylko Admin może usuwać dostawy
    if (user.rola_uzytkownika !== "admin") {
      throw new AppError("Brak uprawnień do usuwania dostaw", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware sprawdzający czy użytkownik może przeglądać konkretną dostawę
export const checkDeliveryViewAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { user } = req;

    if (!user) {
      throw new AppError("Brak danych użytkownika", 401);
    }

    // Admin i Staff mają pełny dostęp
    if (
      user.rola_uzytkownika === "admin" ||
      user.rola_uzytkownika === "staff"
    ) {
      return next();
    }

    // Supplier może przeglądać tylko swoje dostawy
    if (user.rola_uzytkownika === "supplier") {
      const deliveryId = req.params.deliveryId || req.params.id;

      if (!deliveryId) {
        throw new AppError("Brak ID dostawy", 400);
      }

      // Sprawdź czy dostawa należy do tego dostawcy
      // ID dostawy ma format: DostawcaID_NumerDostawy
      const supplierIdFromDelivery = deliveryId.split("_")[0];

      if (supplierIdFromDelivery !== user.id_uzytkownika) {
        throw new AppError("Brak uprawnień do tej dostawy", 403);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
