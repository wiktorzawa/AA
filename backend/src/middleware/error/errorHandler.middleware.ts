import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Domyślny status i wiadomość błędu
  let statusCode = 500;
  let message = "Wystąpił nieoczekiwany błąd serwera.";

  // Jeśli błąd jest instancją AppError (błąd operacyjny)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Obsługa błędów Multer (upload plików)
  else if (err.name === "MulterError") {
    const multerError = err as any;
    switch (multerError.code) {
      case "LIMIT_FILE_SIZE":
        statusCode = 413; // Payload Too Large
        message = "Plik jest zbyt duży. Maksymalny rozmiar to 10MB";
        break;
      case "LIMIT_FILE_COUNT":
        statusCode = 400;
        message = "Zbyt wiele plików";
        break;
      case "LIMIT_FIELD_KEY":
        statusCode = 400;
        message = "Nazwa pola jest zbyt długa";
        break;
      case "LIMIT_FIELD_VALUE":
        statusCode = 400;
        message = "Wartość pola jest zbyt długa";
        break;
      case "LIMIT_FIELD_COUNT":
        statusCode = 400;
        message = "Zbyt wiele pól";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        statusCode = 400;
        message = "Nieoczekiwany plik";
        break;
      default:
        statusCode = 400;
        message = "Błąd przesyłania pliku";
    }
  } else {
    // Loguj nieznane błędy serwera
    console.error("❌ Nieoczekiwany błąd serwera:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    // W trybie deweloperskim możesz dodać stack trace
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
