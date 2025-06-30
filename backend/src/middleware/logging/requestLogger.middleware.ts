import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startHrTime = process.hrtime.bigint();

  res.on('finish', () => {
    const endHrTime = process.hrtime.bigint();
    const durationInMs = Number(endHrTime - startHrTime) / 1_000_000; // Konwersja na milisekundy

    logger.info(`[HTTP] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Czas: ${durationInMs.toFixed(2)}ms`);
  });

  next();
};
