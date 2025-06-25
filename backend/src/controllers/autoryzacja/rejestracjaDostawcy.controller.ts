import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

// Interfaces dla rejestracji dostawcy
export interface DaneRejestracjiDostawcy {
  // Dane firmy
  nazwa_firmy: string;
  numer_nip: string;

  // Dane kontaktowe
  imie_kontaktu: string;
  nazwisko_kontaktu: string;
  adres_email: string;
  telefon: string;
  strona_www?: string;

  // Adres
  adres_ulica: string;
  adres_numer_budynku: string;
  adres_numer_lokalu?: string;
  adres_miasto: string;
  adres_kod_pocztowy: string;
  adres_kraj: string;

  // Warunki handlowe
  typ_dostawcy: "krajowy" | "zagraniczny" | "dropshipping" | "hurtowy";
  warunki_platnosci?: string;
  domyslna_waluta: "PLN" | "EUR" | "USD";

  // Zgody
  akceptacja_regulaminu: boolean;
  zgoda_marketing?: boolean;
}

export interface OdpowiedzRejestracji {
  success: boolean;
  message: string;
  id_dostawcy?: string;
  tymczasowe_haslo?: string;
  error?: string;
}

/**
 * Walidacja danych rejestracji dostawcy
 */
const walidujDaneRejestracji = (dane: DaneRejestracjiDostawcy): string[] => {
  const bledy: string[] = [];

  // Walidacja danych firmy
  if (!dane.nazwa_firmy || dane.nazwa_firmy.trim().length < 2) {
    bledy.push("Nazwa firmy musi mieć co najmniej 2 znaki");
  }

  if (!dane.numer_nip || !/^[0-9]{10}$/.test(dane.numer_nip)) {
    bledy.push("NIP musi składać się z 10 cyfr");
  }

  // Walidacja danych kontaktowych
  if (!dane.imie_kontaktu || dane.imie_kontaktu.trim().length < 2) {
    bledy.push("Imię musi mieć co najmniej 2 znaki");
  }

  if (!dane.nazwisko_kontaktu || dane.nazwisko_kontaktu.trim().length < 2) {
    bledy.push("Nazwisko musi mieć co najmniej 2 znaki");
  }

  if (
    !dane.adres_email ||
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(dane.adres_email)
  ) {
    bledy.push("Nieprawidłowy format adresu email");
  }

  if (!dane.telefon || !/^[0-9+\-\s()]{9,20}$/.test(dane.telefon)) {
    bledy.push("Nieprawidłowy format numeru telefonu");
  }

  // Walidacja adresu
  if (!dane.adres_ulica || dane.adres_ulica.trim().length < 2) {
    bledy.push("Ulica musi mieć co najmniej 2 znaki");
  }

  if (!dane.adres_numer_budynku || dane.adres_numer_budynku.trim().length < 1) {
    bledy.push("Numer budynku jest wymagany");
  }

  if (!dane.adres_miasto || dane.adres_miasto.trim().length < 2) {
    bledy.push("Miasto musi mieć co najmniej 2 znaki");
  }

  if (
    !dane.adres_kod_pocztowy ||
    !/^[0-9]{2}-[0-9]{3}$/.test(dane.adres_kod_pocztowy)
  ) {
    bledy.push("Kod pocztowy musi być w formacie XX-XXX");
  }

  if (!dane.adres_kraj || dane.adres_kraj.trim().length < 2) {
    bledy.push("Kraj jest wymagany");
  }

  // Walidacja zgód
  if (!dane.akceptacja_regulaminu) {
    bledy.push("Akceptacja regulaminu jest wymagana");
  }

  return bledy;
};

/**
 * Sprawdza czy NIP już istnieje w bazie
 */
const sprawdzCzyNipIstnieje = async (numer_nip: string): Promise<boolean> => {
  // TODO: Implementacja sprawdzenia w bazie danych
  // Tymczasowo zwracamy false
  return false;
};

/**
 * Sprawdza czy email już istnieje w bazie
 */
const sprawdzCzyEmailIstnieje = async (
  adres_email: string,
): Promise<boolean> => {
  // TODO: Implementacja sprawdzenia w bazie danych
  // Tymczasowo zwracamy false
  return false;
};

/**
 * Generuje tymczasowe hasło dla dostawcy
 */
const generujTymczasoweHaslo = (): string => {
  const znaki = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let haslo = "";
  for (let i = 0; i < 8; i++) {
    haslo += znaki.charAt(Math.floor(Math.random() * znaki.length));
  }
  return haslo;
};

/**
 * Wysyła email z danymi logowania do nowego dostawcy
 */
const wyslij_email_powitalny = async (
  adres_email: string,
  nazwa_firmy: string,
  id_dostawcy: string,
  tymczasowe_haslo: string,
): Promise<void> => {
  // TODO: Implementacja wysyłania emaila
  console.log(`
    === EMAIL POWITALNY ===
    Do: ${adres_email}
    Firma: ${nazwa_firmy}
    ID Dostawcy: ${id_dostawcy}
    Hasło: ${tymczasowe_haslo}
    
    Witamy w systemie MSBox!
    Twoje konto zostało utworzone i oczekuje na aktywację przez administratora.
    
    Dane logowania:
    - Email: ${adres_email}
    - Hasło: ${tymczasowe_haslo}
    
    Po aktywacji konta będziesz mógł się zalogować i zmienić hasło na własne.
  `);
};

/**
 * PUBLICZNY ENDPOINT - Rejestracja nowego dostawcy
 * POST /api/autoryzacja/dostawcy/rejestracja
 */
export const zarejestrujDostawce = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log("=== REJESTRACJA NOWEGO DOSTAWCY ===");

    const daneRejestracji = req.body as DaneRejestracjiDostawcy;

    // Tymczasowa implementacja - zwracamy sukces
    res.status(201).json({
      success: true,
      message:
        "Rejestracja przebiegła pomyślnie. Sprawdź email z danymi logowania.",
      id_dostawcy: "SUP00999",
    } as OdpowiedzRejestracji);
  },
);

/**
 * PUBLICZNY ENDPOINT - Sprawdzenie dostępności NIP
 * GET /api/autoryzacja/dostawcy/sprawdz-nip/:nip
 */
export const sprawdzDostepnoscNip = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { nip } = req.params;

    if (!/^[0-9]{10}$/.test(nip)) {
      res.status(400).json({
        dostepny: false,
        message: "Nieprawidłowy format NIP",
      });
      return;
    }

    try {
      const nipIstnieje = await sprawdzCzyNipIstnieje(nip);

      res.json({
        dostepny: !nipIstnieje,
        message: nipIstnieje ? "NIP już istnieje w bazie" : "NIP dostępny",
      });
    } catch (error) {
      console.error("Błąd podczas sprawdzania NIP:", error);
      res.status(500).json({
        dostepny: false,
        message: "Błąd podczas sprawdzania NIP",
      });
    }
  },
);

/**
 * PUBLICZNY ENDPOINT - Sprawdzenie dostępności email
 * GET /api/autoryzacja/dostawcy/sprawdz-email/:email
 */
export const sprawdzDostepnoscEmail = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;

    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      res.status(400).json({
        dostepny: false,
        message: "Nieprawidłowy format email",
      });
      return;
    }

    try {
      const emailIstnieje = await sprawdzCzyEmailIstnieje(email);

      res.json({
        dostepny: !emailIstnieje,
        message: emailIstnieje
          ? "Email już istnieje w bazie"
          : "Email dostępny",
      });
    } catch (error) {
      console.error("Błąd podczas sprawdzania email:", error);
      res.status(500).json({
        dostepny: false,
        message: "Błąd podczas sprawdzania email",
      });
    }
  },
);
