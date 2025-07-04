/// <reference path="../../types/express.d.ts" />

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/config";
import { TokenPayload } from "../../types/auth.types";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";

// Import rozszerzenia Express Request interfejsu jest już obsługiwany przez tsconfig.json

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Brak autoryzacji", 401);
    }

    if (!config.jwtSecret) {
      throw new AppError("Błąd konfiguracji serwera.", 500);
    }

    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn("Token JWT wygasł", { error: error.message });
      return next(new AppError("Token wygasł", 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      logger.error("Błąd weryfikacji tokenu JWT", { error: error.message });
      return next(new AppError("Nieprawidłowy token", 403));
    }
    // Dla innych, nieoczekiwanych błędów
    logger.error("Nieoczekiwany błąd weryfikacji tokenu.", { error });
    next(error);
  }
};
