import { Request, Response, NextFunction } from "express";
import { AuthHistoriaLogowan } from "../../models/auth/AuthHistoriaLogowan";
import { logger } from "../../utils/logger";

// Zmienna statyczna w zasięgu modułu do śledzenia ostatniego czyszczenia
let lastCleanup = new Date();
const CLEANUP_INTERVAL_MINUTES = 15; // Co 15 minut
const SESSION_TIMEOUT_MINUTES = 30; // Sesje starsze niż 30 minut

/**
 * Middleware do automatycznego zamykania wygasłych sesji logowania.
 * Jest to związane z modelem AuthHistoriaLogowan.
 */
export const sessionCleaner = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const now = new Date();
    const timeSinceLastCleanup = now.getTime() - lastCleanup.getTime();
    const cleanupIntervalMs = CLEANUP_INTERVAL_MINUTES * 60 * 1000;

    // Sprawdź czy minął czas od ostatniego czyszczenia
    if (timeSinceLastCleanup > cleanupIntervalMs) {
      logger.info("Automatyczne zamykanie wygasłych sesji");

      const zamknieteSesjе = await AuthHistoriaLogowan.zamknijWygasleSesjе(
        SESSION_TIMEOUT_MINUTES,
      );

      if (zamknieteSesjе > 0) {
        logger.info("Zamknięto wygasłe sesje", { count: zamknieteSesjе });
      }

      lastCleanup = now; // Zaktualizuj czas ostatniego czyszczenia
    }
  } catch (error) {
    logger.error("Błąd podczas automatycznego zamykania sesji", { error });
    // Nie przerywamy żądania z powodu błędu w zarządzaniu sesjami
  }

  next();
};
