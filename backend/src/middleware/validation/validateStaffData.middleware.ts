import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../../utils/AppError";

const staffSchema = z
  .object({
    imie: z
      .string()
      .min(2, "Imię musi mieć co najmniej 2 znaki.")
      .max(50, "Imię jest za długie."),
    nazwisko: z
      .string()
      .min(2, "Nazwisko musi mieć co najmniej 2 znaki.")
      .max(50, "Nazwisko jest za długie."),
    rola: z.enum(["admin", "staff"], {
      errorMap: () => ({
        message:
          'Nieprawidłowa rola. Dozwolone wartości to "admin" lub "staff".',
      }),
    }),
    adres_email: z
      .string()
      .email("Nieprawidłowy format adresu email.")
      .max(255, "Adres email jest za długi."),
    telefon: z
      .string()
      .regex(/^[+]?[0-9\s\-()]{9,20}$/, "Nieprawidłowy format numeru telefonu.")
      .nullable()
      .optional(),
  })
  .strict("Nieznane pola w danych pracownika.");

export const validateStaffData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    staffSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => err.message).join(", ");
      return next(
        new AppError(`Błąd walidacji danych pracownika: ${errorMessages}`, 400),
      );
    }
    next(new AppError("Nieoczekiwany błąd walidacji danych pracownika.", 500));
  }
};
