import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../../utils/AppError";

type ValidationTarget = "body" | "query" | "params";

/**
 * Generyczne middleware do walidacji danych za pomocą Zod
 * @param schema - Schemat Zod do walidacji
 * @param target - Część request do walidacji ('body', 'query', 'params')
 * @param errorPrefix - Prefiks błędu (np. "Błąd walidacji danych logowania:")
 */
export const validateWithZod = <T>(
  schema: z.ZodSchema<T>,
  target: ValidationTarget = "body",
  errorPrefix: string = "Błąd walidacji:",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[target];
      schema.parse(dataToValidate);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        return next(new AppError(`${errorPrefix} ${errorMessages}`, 400));
      }
      next(new AppError("Nieoczekiwany błąd walidacji.", 500));
    }
  };
};

/**
 * Middleware walidacji dla req.body
 */
export const validateBody = <T>(schema: z.ZodSchema<T>, errorPrefix?: string) =>
  validateWithZod(schema, "body", errorPrefix);

/**
 * Middleware walidacji dla req.query
 */
export const validateQuery = <T>(
  schema: z.ZodSchema<T>,
  errorPrefix?: string,
) => validateWithZod(schema, "query", errorPrefix);

/**
 * Middleware walidacji dla req.params
 */
export const validateParams = <T>(
  schema: z.ZodSchema<T>,
  errorPrefix?: string,
) => validateWithZod(schema, "params", errorPrefix);
