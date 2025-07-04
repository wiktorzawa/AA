import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthService } from "../../services/auth/authService";
import { CreatePracownikData } from "../../types/auth.types";

export class StaffController {
  private authService = new AuthService();

  /**
   * Pobiera wszystkich pracowników.
   */
  public getAllStaff = asyncHandler(async (req: Request, res: Response) => {
    const staffList = await this.authService.pobierzWszystkichPracownikow();
    res.status(200).json({ success: true, data: staffList });
  });

  /**
   * Pobiera pracownika po ID.
   */
  public getStaffById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const staff = await this.authService.pobierzPracownika(id);
    res.status(200).json({ success: true, data: staff });
  });

  /**
   * Tworzy nowego pracownika z automatycznie wygenerowanym hasłem.
   */
  public createStaff = asyncHandler(async (req: Request, res: Response) => {
    const staffData: CreatePracownikData = req.body;
    const result = await this.authService.utworzPracownika(staffData);
    res.status(201).json({
      success: true,
      data: {
        staff: result.pracownik,
        password: result.wygenerowane_haslo,
      },
    });
  });

  /**
   * Aktualizuje dane pracownika.
   */
  public updateStaff = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const staffData: Partial<CreatePracownikData> = req.body;
    const updatedStaff = await this.authService.aktualizujPracownika(
      id,
      staffData,
    );
    res.status(200).json({ success: true, data: updatedStaff });
  });

  /**
   * Usuwa pracownika.
   */
  public deleteStaff = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.authService.usunPracownika(id);
    res
      .status(200)
      .json({ success: true, message: "Pracownik został usunięty" });
  });
}

export default new StaffController();
