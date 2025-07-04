import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthService } from "../../services/auth/authService";
import { CreateDostawcaData } from "../../types/auth.types";

export class SupplierController {
  private authService = new AuthService();

  /**
   * Pobiera wszystkich dostawców.
   */
  public getAllSuppliers = asyncHandler(async (req: Request, res: Response) => {
    const suppliersList = await this.authService.pobierzWszystkichDostawcow();
    res.status(200).json({ success: true, data: suppliersList });
  });

  /**
   * Pobiera dostawcę po ID.
   */
  public getSupplierById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const supplier = await this.authService.pobierzDostawce(id);
    res.status(200).json({ success: true, data: supplier });
  });

  /**
   * Tworzy nowego dostawcę z automatycznie wygenerowanym hasłem.
   */
  public createSupplier = asyncHandler(async (req: Request, res: Response) => {
    const supplierData: CreateDostawcaData = req.body;
    const result = await this.authService.utworzDostawce(supplierData);
    res.status(201).json({
      success: true,
      data: {
        supplier: result.dostawca,
        password: result.wygenerowane_haslo,
      },
    });
  });

  /**
   * Aktualizuje dane dostawcy.
   */
  public updateSupplier = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const supplierData: Partial<CreateDostawcaData> = req.body;
    const updatedSupplier = await this.authService.aktualizujDostawce(
      id,
      supplierData,
    );
    res.status(200).json({ success: true, data: updatedSupplier });
  });

  /**
   * Usuwa dostawcę.
   */
  public deleteSupplier = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.authService.usunDostawce(id);
    res
      .status(200)
      .json({ success: true, message: "Dostawca został usunięty" });
  });

  /**
   * Sprawdza dostępność NIP.
   */
  public checkNipAvailability = asyncHandler(
    async (req: Request, res: Response) => {
      const { nip } = req.params;
      const isAvailable = await this.authService.sprawdzDostepnoscNIP(nip);
      res.status(200).json({ success: true, available: isAvailable });
    },
  );

  /**
   * Sprawdza dostępność email.
   */
  public checkEmailAvailability = asyncHandler(
    async (req: Request, res: Response) => {
      const { email } = req.params;
      const isAvailable = await this.authService.sprawdzDostepnoscEmail(email);
      res.status(200).json({ success: true, available: isAvailable });
    },
  );
}

export default new SupplierController();
