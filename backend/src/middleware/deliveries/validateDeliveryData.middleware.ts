import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { AppError } from "../../utils/AppError";

// Walidacja danych nowej dostawy
export const validateNewDeliveryData = [
  body("id_dostawcy")
    .notEmpty()
    .withMessage("ID dostawcy jest wymagane")
    .isString()
    .withMessage("ID dostawcy musi być tekstem")
    .isLength({ min: 3, max: 20 })
    .withMessage("ID dostawcy musi mieć od 3 do 20 znaków"),

  body("nazwa_pliku")
    .notEmpty()
    .withMessage("Nazwa pliku jest wymagana")
    .isString()
    .withMessage("Nazwa pliku musi być tekstem")
    .isLength({ max: 255 })
    .withMessage("Nazwa pliku nie może przekraczać 255 znaków"),

  body("url_pliku_S3")
    .notEmpty()
    .withMessage("URL pliku S3 jest wymagany")
    .isURL()
    .withMessage("URL pliku S3 musi być poprawnym adresem URL"),

  body("nr_palet_dostawy")
    .optional()
    .isString()
    .withMessage("Numer palet musi być tekstem"),

  body("status_weryfikacji")
    .optional()
    .isIn(["nowa", "trwa weryfikacja", "zweryfikowano", "raport", "zakończono"])
    .withMessage("Nieprawidłowy status weryfikacji"),

  // Middleware sprawdzający wyniki walidacji
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new AppError(`Błędy walidacji: ${errorMessages.join(", ")}`, 400);
    }
    next();
  },
];

// Walidacja aktualizacji statusu dostawy
export const validateDeliveryStatusUpdate = [
  body("status_weryfikacji")
    .notEmpty()
    .withMessage("Status weryfikacji jest wymagany")
    .isIn(["nowa", "trwa weryfikacja", "zweryfikowano", "raport", "zakończono"])
    .withMessage("Nieprawidłowy status weryfikacji"),

  // Middleware sprawdzający wyniki walidacji
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new AppError(`Błędy walidacji: ${errorMessages.join(", ")}`, 400);
    }
    next();
  },
];

// Walidacja ID dostawy w parametrach
export const validateDeliveryId = [
  body("id_dostawy")
    .optional()
    .isString()
    .withMessage("ID dostawy musi być tekstem")
    .matches(/^DST\/[A-Z0-9]+$/)
    .withMessage("ID dostawy musi mieć format DST/XXXXXXX"),

  // Middleware sprawdzający wyniki walidacji
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new AppError(`Błędy walidacji: ${errorMessages.join(", ")}`, 400);
    }
    next();
  },
];
