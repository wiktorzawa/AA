import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../../types/auth.types";
import { AppError } from "../../utils/AppError";
import { AuthDaneAutoryzacji } from "../../models/auth/AuthDaneAutoryzacji"; // Nowy import
import { AuthHistoriaLogowan } from "../../models/auth/AuthHistoriaLogowan"; // Nowy import

const JWT_SECRET = process.env.JWT_SECRET || "msbox-secret-key";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Token uwierzytelnienia nie został podany.", 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // KRYTYCZNA POPRAWKA: Weryfikacja czy użytkownik istnieje w bazie danych
    const uzytkownik = await AuthDaneAutoryzacji.findByPk(decoded.id_logowania);
    if (!uzytkownik) {
      return next(
        new AppError("Użytkownik powiązany z tokenem nie istnieje.", 401),
      );
    }

    // KRYTYCZNA POPRAWKA: Sprawdzenie czy konto jest zablokowane
    if (uzytkownik.isAccountLocked()) {
      return next(new AppError("Konto zostało zablokowane", 423));
    }

    req.user = decoded; // Dołącz zdekodowany payload do obiektu Request
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Obsługa wygasłych tokenów z zamykaniem sesji
      try {
        const decoded = jwt.decode(token) as TokenPayload;
        if (decoded && decoded.id_logowania) {
          const ostatniaSesja = await AuthHistoriaLogowan.findOne({
            where: {
              id_logowania: decoded.id_logowania,
              status_logowania: "success",
              koniec_sesji: null,
            },
            order: [["data_proby_logowania", "DESC"]],
          });

          if (ostatniaSesja) {
            await ostatniaSesja.zakonczSesje();
          }
        }
      } catch (closeError) {
        console.error(
          "❌ [AuthMiddleware]: Błąd podczas zamykania sesji po wygaśnięciu tokenu:",
          closeError,
        );
      }
      return next(
        new AppError(
          "Token uwierzytelnienia wygasł. Sesja została zakończona.",
          403,
        ),
      );
    } else if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Nieprawidłowy token uwierzytelnienia.", 403));
    } else {
      console.error(
        "❌ [AuthMiddleware]: Nieoczekiwany błąd weryfikacji tokenu:",
        error,
      );
      return next(new AppError("Błąd weryfikacji tokenu.", 500));
    }
  }
};
