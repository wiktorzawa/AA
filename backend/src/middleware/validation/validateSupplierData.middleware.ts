import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../../utils/AppError";
import { isValidCountry } from "../../utils/countryValidation";

const supplierSchema = z
  .object({
    nazwa_firmy: z
      .string()
      .min(2, "Nazwa firmy musi mieć co najmniej 2 znaki.")
      .max(255, "Nazwa firmy jest za długa."),
    imie_kontaktu: z
      .string()
      .min(2, "Imię kontaktu musi mieć co najmniej 2 znaki.")
      .max(50, "Imię kontaktu jest za długie."),
    nazwisko_kontaktu: z
      .string()
      .min(2, "Nazwisko kontaktu musi mieć co najmniej 2 znaki.")
      .max(50, "Nazwisko kontaktu jest za długie."),
    numer_nip: z.string().regex(/^\d{10}$/, "NIP musi składać się z 10 cyfr."),
    adres_email: z
      .string()
      .email("Nieprawidłowy format adresu email.")
      .max(255, "Adres email jest za długi."),
    telefon: z
      .string()
      .regex(
        /^[+]?[0-9\s\-()]{9,20}$/,
        "Nieprawidłowy format numeru telefonu.",
      ),
    strona_www: z
      .string()
      .url("Nieprawidłowy format URL strony WWW.")
      .max(255, "URL strony WWW jest za długi.")
      .nullable()
      .optional(),
    adres_ulica: z
      .string()
      .min(2, "Ulica musi mieć co najmniej 2 znaki.")
      .max(100, "Ulica jest za długa."),
    adres_numer_budynku: z
      .string()
      .min(1, "Numer budynku jest wymagany.")
      .max(10, "Numer budynku jest za długi."),
    adres_numer_lokalu: z
      .string()
      .max(10, "Numer lokalu jest za długi.")
      .nullable()
      .optional(),
    adres_miasto: z
      .string()
      .min(2, "Miasto musi mieć co najmniej 2 znaki.")
      .max(100, "Miasto jest za długie."),
    adres_kod_pocztowy: z
      .string()
      .regex(/^\d{2}-\d{3}$/, "Kod pocztowy musi być w formacie XX-XXX."),
    adres_kraj: z
      .string()
      .min(2, "Kraj jest wymagany.")
      .max(50, "Kraj jest za długi.")
      .refine(isValidCountry, {
        message: "Nieprawidłowy kod kraju (ISO 3166-1 alpha-2).",
      }),
  })
  .strict("Nieznane pola w danych dostawcy.");

export const validateSupplierData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    supplierSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => err.message).join(", ");
      return next(
        new AppError(`Błąd walidacji danych dostawcy: ${errorMessages}`, 400),
      );
    }
    next(new AppError("Nieoczekiwany błąd walidacji danych dostawcy.", 500));
  }
};
