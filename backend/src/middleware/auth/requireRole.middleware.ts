import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import { UserRole } from "../../types/auth.types";

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError("Brak danych użytkownika. Dostęp zabroniony.", 401),
      );
    }

    const { rola_uzytkownika } = req.user;
    if (!roles.includes(rola_uzytkownika)) {
      return next(
        new AppError(
          "Brak wystarczających uprawnień do wykonania tej operacji.",
          403,
        ),
      );
    }
    next();
  };
};
