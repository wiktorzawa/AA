import { Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import { AuthenticatedRequest } from "../../types/auth.types";

// Middleware sprawdzający czy supplier może dostać się do swojej dostawy
export const checkSupplierDeliveryAccess = async (
  req: AuthenticatedRequest,
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
      const { id_dostawcy } = req.params;
      const supplierIdFromQuery = req.query.id_dostawcy as string;
      const supplierIdFromBody = req.body.id_dostawcy;

      // Sprawdź ID dostawcy z różnych źródeł
      const targetSupplierId =
        id_dostawcy || supplierIdFromQuery || supplierIdFromBody;

      if (targetSupplierId && targetSupplierId !== user.id_uzytkownika) {
        throw new AppError("Brak uprawnień do tej dostawy", 403);
      }

      // Jeśli supplier tworzy dostawę, ustaw jego ID
      if (req.method === "POST" && !req.body.id_dostawcy) {
        req.body.id_dostawcy = user.id_uzytkownika;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware sprawdzający czy użytkownik może modyfikować dostawę
export const checkDeliveryModifyPermissions = async (
  req: AuthenticatedRequest,
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
  req: AuthenticatedRequest,
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
