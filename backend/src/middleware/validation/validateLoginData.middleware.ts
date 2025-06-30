import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../../utils/AppError";

const loginSchema = z
  .object({
    adres_email: z
      .string()
      .email("Nieprawidłowy format adresu email.")
      .min(1, "Email jest wymagany."),
    haslo: z
      .string()
      .min(3, "Hasło musi mieć co najmniej 3 znaki.")
      .max(100, "Hasło jest za długie."),
  })
  .strict("Nieznane pola w danych logowania.");

export const validateLoginData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => err.message).join(", ");
      return next(
        new AppError(`Błąd walidacji danych logowania: ${errorMessages}`, 400),
      );
    }
    next(new AppError("Nieoczekiwany błąd walidacji danych logowania.", 500));
  }
};
