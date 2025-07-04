import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";

/**
 * 📁 Middleware walidacji pliku dostawy
 */
export const validateDeliveryFile = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // Obsługa zarówno 'deliveryFile' jak i 'file' dla kompatybilności
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const file = files?.deliveryFile?.[0] || files?.file?.[0] || req.file;

    if (!file) {
      throw new AppError("Brak pliku do przesłania", 400);
    }

    // Walidacja typu pliku
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "application/vnd.ms-excel.sheet.macroEnabled.12", // .xlsm
      "application/vnd.ms-excel.sheet.macroenabled.12", // .xlsm (alternative)
      "application/zip", // .xlsm może być wykrywany jako ZIP
    ];

    const allowedExtensions = [".xlsx", ".xls", ".xlsm"];
    const fileExtension = file.originalname
      .toLowerCase()
      .slice(file.originalname.lastIndexOf("."));

    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.includes(fileExtension);

    if (!isValidMimeType && !isValidExtension) {
      throw new AppError(
        "Nieprawidłowy format pliku. Obsługiwane formaty: .xlsx, .xls, .xlsm",
        400,
      );
    }

    // Walidacja rozmiaru pliku (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new AppError(
        "Plik jest zbyt duży. Maksymalny rozmiar to 10MB",
        413,
      );
    }

    // Walidacja nazwy pliku
    if (!file.originalname || file.originalname.trim() === "") {
      throw new AppError("Nazwa pliku nie może być pusta", 400);
    }

    // Sprawdź czy nazwa pliku zawiera niebezpieczne znaki
    // eslint-disable-next-line no-control-regex
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (dangerousChars.test(file.originalname)) {
      throw new AppError("Nazwa pliku zawiera niedozwolone znaki", 400);
    }

    logger.info("Plik przeszedł walidację", {
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 🔍 Middleware sprawdzający spójność danych między preview a confirm
 */
export const validateConfirmConsistency = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const file = req.files as { [fieldname: string]: Express.Multer.File[] };
    const actualFile = file?.deliveryFile?.[0] || file?.file?.[0] || req.file;

    if (!actualFile) {
      throw new AppError("Brak pliku do potwierdzenia", 400);
    }

    // Sprawdź czy nazwa pliku się zgadza z tym co było w preview
    const providedFileName = req.body.fileName;
    if (providedFileName && providedFileName !== actualFile.originalname) {
      logger.warn("Niezgodność nazwy pliku między preview a confirm", {
        previewFileName: providedFileName,
        confirmFileName: actualFile.originalname,
      });

      // Ostrzeżenie, ale nie blokuj - może być przypadek gdzie użytkownik zmienił plik
      logger.info("Proceduję z nową nazwą pliku", {
        newFileName: actualFile.originalname,
      });
    }

    // Sprawdź czy są podane jakieś dane potwierdzenia
    const hasConfirmationData =
      req.body.confirmedDeliveryNumber ||
      req.body.detectedDeliveryNumber ||
      req.body.confirmedPaletteNumbers ||
      req.body.detectedPaletteNumbers;

    if (!hasConfirmationData) {
      throw new AppError(
        "Brak danych potwierdzenia. Najpierw wykonaj podgląd pliku.",
        400,
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
