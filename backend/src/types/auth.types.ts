// backend/src/types/auth.types.ts
import { Request } from "express";

export type UserRole = "admin" | "staff" | "supplier";

// 🔄 ZUNIFIKOWANE INTERFEJSY LOGOWANIA
export interface LoginRequest {
  adres_email: string; // Zunifikowana nazwa
  haslo: string; // Zunifikowana nazwa
  adres_ip?: string; // Dodatkowe pola
  user_agent?: string; // Dodatkowe pola
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  uzytkownik: {
    id_logowania: string;
    id_uzytkownika: string;
    adres_email: string;
    rola_uzytkownika: UserRole;
    ostatnie_logowanie: Date | null;
  };
}

export interface TokenPayload {
  id_logowania: string;
  id_uzytkownika: string;
  adres_email: string;
  rola_uzytkownika: UserRole;
}

// Rozszerzenie Request o dane użytkownika
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// 🆕 NOWE INTERFEJSY DLA SERVICE LAYER
export interface CreatePracownikData {
  imie: string;
  nazwisko: string;
  rola: "admin" | "staff";
  adres_email: string;
  telefon?: string | null;
  haslo?: string; // Opcjonalne - jeśli nie podane, wygeneruje domyślne
}

export interface CreateDostawcaData {
  nazwa_firmy: string;
  imie_kontaktu: string;
  nazwisko_kontaktu: string;
  numer_nip: string;
  adres_email: string;
  telefon: string;
  strona_www?: string | null;
  adres_ulica: string;
  adres_numer_budynku: string;
  adres_numer_lokalu?: string | null;
  adres_miasto: string;
  adres_kod_pocztowy: string;
  adres_kraj: string;
  haslo?: string; // Opcjonalne - jeśli nie podane, wygeneruje domyślne
}

export interface CreatePracownikResponse {
  pracownik: any; // Will be typed properly when we import model types
  daneAutoryzacji: any; // Will be typed properly when we import model types
  wygenerowane_haslo?: string; // Jeśli hasło zostało wygenerowane
}

export interface CreateDostawcaResponse {
  dostawca: any; // Will be typed properly when we import model types
  daneAutoryzacji: any; // Will be typed properly when we import model types
  wygenerowane_haslo?: string; // Jeśli hasło zostało wygenerowane
}

// 🔄 LEGACY INTERFACES (dla kompatybilności z istniejącym kodem)
export interface LegacyLoginRequest {
  username: string;
  password: string;
}

export interface LegacyLoginResponse {
  success: boolean;
  userRole?: UserRole;
  userId?: string;
  token?: string;
  refresh_token?: string;
  error?: string;
}
