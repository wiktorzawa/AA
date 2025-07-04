import { z } from "zod";
import { validateBody } from "../validation/zodValidation";

// Schemat walidacji nowej dostawy
const newDeliverySchema = z
  .object({
    id_dostawcy: z
      .string()
      .min(3, "ID dostawcy musi mieć co najmniej 3 znaki")
      .max(20, "ID dostawcy nie może przekraczać 20 znaków")
      .nonempty("ID dostawcy jest wymagane"),

    nazwa_pliku: z
      .string()
      .max(255, "Nazwa pliku nie może przekraczać 255 znaków")
      .nonempty("Nazwa pliku jest wymagana"),

    url_pliku_S3: z
      .string()
      .url("URL pliku S3 musi być poprawnym adresem URL")
      .nonempty("URL pliku S3 jest wymagany"),

    nr_palet_dostawy: z.string().optional(),

    status_weryfikacji: z
      .enum([
        "nowa",
        "trwa weryfikacja",
        "zweryfikowano",
        "raport",
        "zakończono",
      ])
      .optional(),
  })
  .strict("Nieznane pola w danych dostawy");

// Schemat walidacji aktualizacji statusu dostawy
const deliveryStatusUpdateSchema = z
  .object({
    status_weryfikacji: z
      .enum(
        ["nowa", "trwa weryfikacja", "zweryfikowano", "raport", "zakończono"],
        {
          errorMap: () => ({ message: "Nieprawidłowy status weryfikacji" }),
        },
      )
      .refine((val) => val !== undefined, "Status weryfikacji jest wymagany"),
  })
  .strict("Nieznane pola w aktualizacji statusu");

// Schemat walidacji ID dostawy
const deliveryIdSchema = z
  .object({
    id_dostawy: z
      .string()
      .regex(/^DST\/[A-Z0-9]+$/, "ID dostawy musi mieć format DST/XXXXXXX")
      .optional(),
  })
  .strict("Nieznane pola w ID dostawy");

// Eksportowane middleware walidacyjne
export const validateNewDeliveryData = validateBody(
  newDeliverySchema,
  "Błędy walidacji nowej dostawy:",
);

export const validateDeliveryStatusUpdate = validateBody(
  deliveryStatusUpdateSchema,
  "Błędy walidacji aktualizacji statusu:",
);

export const validateDeliveryId = validateBody(
  deliveryIdSchema,
  "Błędy walidacji ID dostawy:",
);

// Eksport schematów dla użycia w innych miejscach
export { newDeliverySchema, deliveryStatusUpdateSchema, deliveryIdSchema };

// 🆕 Schemat walidacji danych potwierdzenia dostawy
const confirmDeliverySchema = z
  .object({
    fileName: z
      .string()
      .min(1, "Nazwa pliku jest wymagana")
      .max(255, "Nazwa pliku jest za długa"),

    detectedDeliveryNumber: z.string().nullable().optional(),

    confirmedDeliveryNumber: z
      .string()
      .min(1, "Potwierdzony numer dostawy nie może być pusty")
      .optional(),

    detectedPaletteNumbers: z.array(z.string()).optional(),

    confirmedPaletteNumbers: z
      .array(z.string().min(1, "Numer palety nie może być pusty"))
      .optional(),

    productCorrections: z
      .array(
        z
          .object({
            index: z.number().min(0, "Indeks produktu musi być nieujemny"),
            corrections: z
              .object({
                nr_palety: z.string().optional(),
                nazwa_produktu: z.string().optional(),
                kod_ean: z.string().optional(),
                kod_asin: z.string().optional(),
                ilosc: z
                  .number()
                  .positive("Ilość musi być dodatnia")
                  .optional(),
                cena_produktu_spec: z
                  .number()
                  .positive("Cena musi być dodatnia")
                  .optional(),
                lpn: z.string().optional(),
                stan_produktu: z.string().optional(),
                kraj_pochodzenia: z.string().optional(),
                kategoria_produktu: z.string().optional(),
              })
              .strict("Nieznane pola w poprawkach produktu"),
          })
          .strict("Nieznane pola w korekcji produktu"),
      )
      .optional(),

    bypassValidation: z.boolean().optional().default(false),
  })
  .strict("Nieznane pola w danych potwierdzenia")
  .refine(
    (data) => data.confirmedDeliveryNumber || data.detectedDeliveryNumber,
    {
      message: "Musi być podany numer dostawy (wykryty lub potwierdzony)",
      path: ["confirmedDeliveryNumber"],
    },
  );

// 🆕 Middleware walidacji potwierdzenia dostawy
export const validateConfirmDeliveryData = validateBody(
  confirmDeliverySchema,
  "Błędy walidacji potwierdzenia dostawy:",
);

// 🆕 Eksport nowego schematu
export { confirmDeliverySchema };
