import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../types/auth.types';
import { AppError } from '../../utils/AppError';

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      // To powinno być obsłużone przez authenticateToken, ale jako zabezpieczenie
      return next(new AppError('Brak danych użytkownika w żądaniu. Upewnij się, że authenticateToken jest użyty.', 401));
    }

    if (!roles.includes(req.user.rola_uzytkownika)) {
      return next(new AppError('Brak wystarczających uprawnień do wykonania tej operacji.', 403));
    }

    next();
  };
};
