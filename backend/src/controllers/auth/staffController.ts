import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthPracownicy } from "../../models/auth/AuthPracownicy";
import { AuthService } from "../../services/auth/authService";

// Interfejsy
export interface StaffCreationData {
  imie: string;
  nazwisko: string;
  rola: "admin" | "staff";
  adres_email: string;
  telefon?: string | null;
}

export interface StaffWithPassword {
  staff: AuthPracownicy;
  password: string;
}

export class StaffController {
  private authService = new AuthService();

  /**
   * Pobiera wszystkich pracowników
   */
  public getAllStaff = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const staffList = await AuthPracownicy.findAll({
          order: [["data_utworzenia", "DESC"]],
        });

        res.json({
          success: true,
          data: staffList,
        });
      } catch (error) {
        console.error("Błąd podczas pobierania pracowników:", error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Pobiera pracownika po ID
   */
  public getStaffById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      try {
        const staff = await AuthPracownicy.findByPk(id);

        if (!staff) {
          res.status(404).json({
            success: false,
            error: "Pracownik nie został znaleziony",
          });
          return;
        }

        res.json({
          success: true,
          data: staff,
        });
      } catch (error) {
        console.error(`Błąd podczas pobierania pracownika o ID ${id}:`, error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Tworzy nowego pracownika z automatycznie wygenerowanym hasłem
   */
  public createStaffWithPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { imie, nazwisko, rola, adres_email, telefon } =
        req.body as StaffCreationData;

      // Walidacja danych wejściowych
      if (!imie || !nazwisko || !rola || !adres_email) {
        res.status(400).json({
          success: false,
          error: "Wszystkie wymagane pola muszą być wypełnione",
        });
        return;
      }

      if (rola !== "admin" && rola !== "staff") {
        res.status(400).json({
          success: false,
          error:
            'Nieprawidłowa rola. Dozwolone wartości to "admin" lub "staff"',
        });
        return;
      }

      try {
        // ✅ NOWY SPOSÓB - używamy AuthService
        const result = await this.authService.utworzPracownika({
          imie,
          nazwisko,
          rola,
          adres_email,
          telefon,
          // haslo nie podajemy - zostanie wygenerowane automatycznie
        });

        res.status(201).json({
          success: true,
          data: {
            staff: result.pracownik,
            password: result.wygenerowane_haslo, // Zwracamy wygenerowane hasło
          },
        });
      } catch (error: unknown) {
        console.error("Błąd podczas tworzenia pracownika:", error);

        // Obsługa błędów z AuthService
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          "message" in error
        ) {
          res.status(error.statusCode as number).json({
            success: false,
            error: error.message as string,
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Błąd serwera",
          });
        }
      }
    },
  );

  /**
   * Tworzy nowego pracownika (bez konta logowania)
   */
  public createStaff = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { imie, nazwisko, rola, adres_email, telefon } =
        req.body as StaffCreationData;

      // Walidacja danych wejściowych
      if (!imie || !nazwisko || !rola || !adres_email) {
        res.status(400).json({
          success: false,
          error: "Wszystkie wymagane pola muszą być wypełnione",
        });
        return;
      }

      try {
        // Sprawdź, czy pracownik o tym adresie email już istnieje
        const existingStaffByEmail = await AuthPracownicy.findOne({
          where: { adres_email },
        });

        if (existingStaffByEmail) {
          res.status(409).json({
            success: false,
            error: "Pracownik o podanym adresie email już istnieje",
          });
          return;
        }

        // ⚠️ UWAGA: Ta metoda tworzy TYLKO pracownika bez konta logowania
        // Używamy bezpośrednio modelu, bo AuthService zawsze tworzy konto
        const id_pracownika = await AuthPracownicy.generateUniqueId(rola);

        const newStaff = await AuthPracownicy.create({
          id_pracownika,
          imie,
          nazwisko,
          rola,
          adres_email,
          telefon,
        });

        res.status(201).json({
          success: true,
          data: newStaff,
        });
      } catch (error) {
        console.error("Błąd podczas tworzenia pracownika:", error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Aktualizuje dane pracownika
   */
  public updateStaff = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { imie, nazwisko, rola, adres_email, telefon } = req.body;

      try {
        // ✅ NOWY SPOSÓB - używamy AuthService
        const updatedStaff = await this.authService.aktualizujPracownika(id, {
          imie,
          nazwisko,
          rola,
          adres_email,
          telefon,
        });

        res.json({
          success: true,
          data: updatedStaff,
        });
      } catch (error: unknown) {
        console.error(
          `Błąd podczas aktualizacji pracownika o ID ${id}:`,
          error,
        );

        // Obsługa błędów z AuthService
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          "message" in error
        ) {
          res.status(error.statusCode as number).json({
            success: false,
            error: error.message as string,
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Błąd serwera",
          });
        }
      }
    },
  );

  /**
   * Usuwa pracownika
   */
  public deleteStaff = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      try {
        // ✅ NOWY SPOSÓB - używamy AuthService
        await this.authService.usunPracownika(id);

        res.json({
          success: true,
          message: "Pracownik został usunięty",
        });
      } catch (error: unknown) {
        console.error(`Błąd podczas usuwania pracownika o ID ${id}:`, error);

        // Obsługa błędów z AuthService
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          "message" in error
        ) {
          res.status(error.statusCode as number).json({
            success: false,
            error: error.message as string,
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Błąd serwera",
          });
        }
      }
    },
  );

  /**
   * Generuje hasło dla istniejącego pracownika
   */
  private generatePassword(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

export default new StaffController();
