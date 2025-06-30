import axiosInstance from "./axios";

// Interfejs dla modelu danych pracownika bazujący na nowych modelach Sequelize
export interface Pracownik {
  id_pracownika: string;
  imie: string;
  nazwisko: string;
  rola: "admin" | "staff";
  adres_email: string;
  telefon?: string | null;
  data_utworzenia: string;
  data_aktualizacji: string;
}

// Typ dla nowego pracownika (bez dat)
export type NowyPracownik = Omit<
  Pracownik,
  "data_utworzenia" | "data_aktualizacji"
>;

// Typ dla aktualizacji pracownika (częściowe dane, bez ID i dat)
export type AktualizacjaPracownika = Partial<
  Omit<Pracownik, "id_pracownika" | "data_utworzenia" | "data_aktualizacji">
>;

// Typ dla nowego pracownika bez ID (generowane automatycznie)
export type NowyPracownikBezId = Omit<NowyPracownik, "id_pracownika">;

// Interfejs dla odpowiedzi z hasłem
export interface PracownikZHaslem {
  staff: Pracownik;
  password: string;
}

/**
 * Pobiera wszystkich pracowników
 * @returns Lista pracowników
 */
export const pobierzPracownikow = async (): Promise<Pracownik[]> => {
  try {
    const response = await axiosInstance.get("/staff");
    return response.data.success ? response.data.data : [];
  } catch (error) {
    console.error("Błąd podczas pobierania pracowników:", error);
    return [];
  }
};

/**
 * Pobiera pracownika po ID
 * @param id Identyfikator pracownika
 * @returns Dane pracownika lub null w przypadku błędu
 */
export const pobierzPracownika = async (
  id: string,
): Promise<Pracownik | null> => {
  try {
    const response = await axiosInstance.get(
      `/staff/${encodeURIComponent(id)}`,
    );
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Błąd podczas pobierania pracownika o ID ${id}:`, error);
    return null;
  }
};

/**
 * Dodaje nowego pracownika z automatycznie wygenerowanym hasłem
 * @param pracownik Dane nowego pracownika (bez ID)
 * @returns Dane utworzonego pracownika z hasłem lub null w przypadku błędu
 */
export const dodajPracownikaZHaslem = async (
  pracownik: NowyPracownikBezId,
): Promise<PracownikZHaslem | null> => {
  try {
    const response = await axiosInstance.post(
      "/staff/with-password",
      pracownik,
    );
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error("Błąd podczas dodawania pracownika z hasłem:", error);
    return null;
  }
};

/**
 * Dodaje nowego pracownika (bez konta logowania)
 * @param pracownik Dane nowego pracownika
 * @returns Dane utworzonego pracownika lub null w przypadku błędu
 */
export const dodajPracownika = async (
  pracownik: NowyPracownik,
): Promise<Pracownik | null> => {
  try {
    const response = await axiosInstance.post("/staff", pracownik);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error("Błąd podczas dodawania pracownika:", error);
    return null;
  }
};

/**
 * Aktualizuje dane pracownika
 * @param id Identyfikator pracownika
 * @param dane Dane do aktualizacji
 * @returns Zaktualizowane dane pracownika lub null w przypadku błędu
 */
export const aktualizujPracownika = async (
  id: string,
  dane: AktualizacjaPracownika,
): Promise<Pracownik | null> => {
  try {
    const response = await axiosInstance.put(
      `/staff/${encodeURIComponent(id)}`,
      dane,
    );
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error(`Błąd podczas aktualizacji pracownika o ID ${id}:`, error);
    return null;
  }
};

/**
 * Usuwa pracownika
 * @param id Identyfikator pracownika
 * @returns True jeśli usunięto, false w przypadku błędu
 */
export const usunPracownika = async (id: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(
      `/staff/${encodeURIComponent(id)}`,
    );
    return response.data.success || false;
  } catch (error) {
    console.error(`Błąd podczas usuwania pracownika o ID ${id}:`, error);
    return false;
  }
};
