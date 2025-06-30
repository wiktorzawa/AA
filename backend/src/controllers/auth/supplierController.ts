import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthDostawcy } from "../../models/auth/AuthDostawcy";
import { AuthDaneAutoryzacji } from "../../models/auth/AuthDaneAutoryzacji";
import { AuthService } from "../../services/auth/authService";

// Interfejsy
export interface SupplierCreationData {
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
}

export interface SupplierWithPassword {
  supplier: AuthDostawcy;
  password: string;
}

export class SupplierController {
  private authService = new AuthService();

  /**
   * Pobiera wszystkich dostawców
   */
  public getAllSuppliers = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const suppliersList = await AuthDostawcy.findAll({
          order: [["data_utworzenia", "DESC"]],
        });

        res.json({
          success: true,
          data: suppliersList,
        });
      } catch (error) {
        console.error("Błąd podczas pobierania dostawców:", error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Pobiera dostawcę po ID
   */
  public getSupplierById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      try {
        const supplier = await AuthDostawcy.findByPk(id);

        if (!supplier) {
          res.status(404).json({
            success: false,
            error: "Dostawca nie został znaleziony",
          });
          return;
        }

        res.json({
          success: true,
          data: supplier,
        });
      } catch (error) {
        console.error(`Błąd podczas pobierania dostawcy o ID ${id}:`, error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Pobiera dostawcę po NIP
   */
  public getSupplierByNip = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { nip } = req.params;

      try {
        const supplier = await AuthDostawcy.findByNip(nip);

        if (!supplier) {
          res.status(404).json({
            success: false,
            error: "Dostawca o podanym NIP nie został znaleziony",
          });
          return;
        }

        res.json({
          success: true,
          data: supplier,
        });
      } catch (error) {
        console.error(`Błąd podczas pobierania dostawcy o NIP ${nip}:`, error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Sprawdza dostępność NIP
   */
  public checkNipAvailability = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { nip } = req.params;

      try {
        const existingSupplier = await AuthDostawcy.findByNip(nip);

        res.json({
          success: true,
          available: !existingSupplier,
          message: existingSupplier
            ? "NIP jest już używany"
            : "NIP jest dostępny",
        });
      } catch (error) {
        console.error(`Błąd podczas sprawdzania NIP ${nip}:`, error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Sprawdza dostępność email
   */
  public checkEmailAvailability = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.params;

      try {
        const existingSupplier = await AuthDostawcy.findByEmail(email);
        const existingAuth = await AuthDaneAutoryzacji.findByEmail(email);

        const isAvailable = !existingSupplier && !existingAuth;

        res.json({
          success: true,
          available: isAvailable,
          message: isAvailable
            ? "Email jest dostępny"
            : "Email jest już używany w systemie",
        });
      } catch (error) {
        console.error(`Błąd podczas sprawdzania email ${email}:`, error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Tworzy nowego dostawcę z automatycznie wygenerowanym hasłem
   */
  public createSupplierWithPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const supplierData = req.body as SupplierCreationData;

      // Walidacja danych wejściowych
      if (
        !supplierData.nazwa_firmy ||
        !supplierData.imie_kontaktu ||
        !supplierData.nazwisko_kontaktu ||
        !supplierData.numer_nip ||
        !supplierData.adres_email ||
        !supplierData.telefon ||
        !supplierData.adres_ulica ||
        !supplierData.adres_numer_budynku ||
        !supplierData.adres_miasto ||
        !supplierData.adres_kod_pocztowy ||
        !supplierData.adres_kraj
      ) {
        res.status(400).json({
          success: false,
          error: "Wszystkie wymagane pola muszą być wypełnione",
        });
        return;
      }

      try {
        // ✅ NOWY SPOSÓB - używamy AuthService
        const result = await this.authService.utworzDostawce({
          nazwa_firmy: supplierData.nazwa_firmy,
          imie_kontaktu: supplierData.imie_kontaktu,
          nazwisko_kontaktu: supplierData.nazwisko_kontaktu,
          numer_nip: supplierData.numer_nip,
          adres_email: supplierData.adres_email,
          telefon: supplierData.telefon,
          strona_www: supplierData.strona_www,
          adres_ulica: supplierData.adres_ulica,
          adres_numer_budynku: supplierData.adres_numer_budynku,
          adres_numer_lokalu: supplierData.adres_numer_lokalu,
          adres_miasto: supplierData.adres_miasto,
          adres_kod_pocztowy: supplierData.adres_kod_pocztowy,
          adres_kraj: supplierData.adres_kraj,
          // haslo nie podajemy - zostanie wygenerowane automatycznie
        });

        res.status(201).json({
          success: true,
          data: {
            supplier: result.dostawca,
            password: result.wygenerowane_haslo, // Zwracamy wygenerowane hasło
          },
        });
      } catch (error: unknown) {
        console.error("Błąd podczas tworzenia dostawcy:", error);

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
   * Tworzy nowego dostawcę (bez konta logowania)
   */
  public createSupplier = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const supplierData = req.body as SupplierCreationData;

      // Walidacja danych wejściowych
      if (
        !supplierData.nazwa_firmy ||
        !supplierData.imie_kontaktu ||
        !supplierData.nazwisko_kontaktu ||
        !supplierData.numer_nip ||
        !supplierData.adres_email ||
        !supplierData.telefon ||
        !supplierData.adres_ulica ||
        !supplierData.adres_numer_budynku ||
        !supplierData.adres_miasto ||
        !supplierData.adres_kod_pocztowy ||
        !supplierData.adres_kraj
      ) {
        res.status(400).json({
          success: false,
          error: "Wszystkie wymagane pola muszą być wypełnione",
        });
        return;
      }

      try {
        // Sprawdź, czy dostawca o tym NIP już istnieje
        const existingSupplierByNip = await AuthDostawcy.findByNip(
          supplierData.numer_nip,
        );
        if (existingSupplierByNip) {
          res.status(409).json({
            success: false,
            error: "Dostawca o podanym NIP już istnieje",
          });
          return;
        }

        // Sprawdź, czy dostawca o tym adresie email już istnieje
        const existingSupplierByEmail = await AuthDostawcy.findByEmail(
          supplierData.adres_email,
        );
        if (existingSupplierByEmail) {
          res.status(409).json({
            success: false,
            error: "Dostawca o podanym adresie email już istnieje",
          });
          return;
        }

        // ⚠️ UWAGA: Ta metoda tworzy TYLKO dostawcę bez konta logowania
        // Używamy bezpośrednio modelu, bo AuthService zawsze tworzy konto
        const id_dostawcy = await AuthDostawcy.generateUniqueId();

        const newSupplier = await AuthDostawcy.create({
          id_dostawcy,
          nazwa_firmy: supplierData.nazwa_firmy,
          imie_kontaktu: supplierData.imie_kontaktu,
          nazwisko_kontaktu: supplierData.nazwisko_kontaktu,
          numer_nip: supplierData.numer_nip,
          adres_email: supplierData.adres_email,
          telefon: supplierData.telefon,
          strona_www: supplierData.strona_www,
          adres_ulica: supplierData.adres_ulica,
          adres_numer_budynku: supplierData.adres_numer_budynku,
          adres_numer_lokalu: supplierData.adres_numer_lokalu,
          adres_miasto: supplierData.adres_miasto,
          adres_kod_pocztowy: supplierData.adres_kod_pocztowy,
          adres_kraj: supplierData.adres_kraj,
        });

        res.status(201).json({
          success: true,
          data: newSupplier,
        });
      } catch (error) {
        console.error("Błąd podczas tworzenia dostawcy:", error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Aktualizuje dane dostawcy
   */
  public updateSupplier = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const supplierData = req.body as Partial<SupplierCreationData>;

      try {
        // Sprawdź, czy dostawca istnieje
        const existingSupplier = await AuthDostawcy.findByPk(id);
        if (!existingSupplier) {
          res.status(404).json({
            success: false,
            error: "Dostawca nie został znaleziony",
          });
          return;
        }

        // Sprawdź duplikaty tylko jeśli zmieniamy NIP lub email
        if (
          supplierData.numer_nip &&
          supplierData.numer_nip !== existingSupplier.numer_nip
        ) {
          const existingByNip = await AuthDostawcy.findByNip(
            supplierData.numer_nip,
          );
          if (existingByNip && existingByNip.id_dostawcy !== id) {
            res.status(409).json({
              success: false,
              error: "Dostawca o podanym NIP już istnieje",
            });
            return;
          }
        }

        if (
          supplierData.adres_email &&
          supplierData.adres_email !== existingSupplier.adres_email
        ) {
          const existingByEmail = await AuthDostawcy.findByEmail(
            supplierData.adres_email,
          );
          if (existingByEmail && existingByEmail.id_dostawcy !== id) {
            res.status(409).json({
              success: false,
              error: "Dostawca o podanym adresie email już istnieje",
            });
            return;
          }
        }

        // Aktualizuj dane dostawcy
        await existingSupplier.update({
          nazwa_firmy: supplierData.nazwa_firmy || existingSupplier.nazwa_firmy,
          imie_kontaktu:
            supplierData.imie_kontaktu || existingSupplier.imie_kontaktu,
          nazwisko_kontaktu:
            supplierData.nazwisko_kontaktu ||
            existingSupplier.nazwisko_kontaktu,
          numer_nip: supplierData.numer_nip || existingSupplier.numer_nip,
          adres_email: supplierData.adres_email || existingSupplier.adres_email,
          telefon: supplierData.telefon || existingSupplier.telefon,
          strona_www:
            supplierData.strona_www !== undefined
              ? supplierData.strona_www
              : existingSupplier.strona_www,
          adres_ulica: supplierData.adres_ulica || existingSupplier.adres_ulica,
          adres_numer_budynku:
            supplierData.adres_numer_budynku ||
            existingSupplier.adres_numer_budynku,
          adres_numer_lokalu:
            supplierData.adres_numer_lokalu !== undefined
              ? supplierData.adres_numer_lokalu
              : existingSupplier.adres_numer_lokalu,
          adres_miasto:
            supplierData.adres_miasto || existingSupplier.adres_miasto,
          adres_kod_pocztowy:
            supplierData.adres_kod_pocztowy ||
            existingSupplier.adres_kod_pocztowy,
          adres_kraj: supplierData.adres_kraj || existingSupplier.adres_kraj,
        });

        // Jeśli zmieniono email, zaktualizuj też w danych autoryzacji
        if (
          supplierData.adres_email &&
          supplierData.adres_email !== existingSupplier.adres_email
        ) {
          await AuthDaneAutoryzacji.update(
            { adres_email: supplierData.adres_email },
            { where: { id_uzytkownika: id } },
          );
        }

        const updatedSupplier = await AuthDostawcy.findByPk(id);
        res.json({
          success: true,
          data: updatedSupplier,
        });
      } catch (error) {
        console.error(`Błąd podczas aktualizacji dostawcy o ID ${id}:`, error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );

  /**
   * Usuwa dostawcę
   */
  public deleteSupplier = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      try {
        // ✅ NOWY SPOSÓB - używamy AuthService
        await this.authService.usunDostawce(id);

        res.json({
          success: true,
          message: "Dostawca został usunięty",
        });
      } catch (error: unknown) {
        console.error(`Błąd podczas usuwania dostawcy o ID ${id}:`, error);

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
}

export default new SupplierController();
