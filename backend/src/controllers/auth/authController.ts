import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthService } from "../../services/auth/authService";
import { AppError } from "../../utils/AppError";
import { LoginRequest } from "../../types/auth.types";

export class AuthController {
  private authService = new AuthService();

  /**
   * Loguje użytkownika, delegując całą logikę do AuthService.
   */
  public login = asyncHandler(async (req: Request, res: Response) => {
    const loginData: LoginRequest = req.body;
    const result = await this.authService.zalogujUzytkownika(loginData);
    res.status(200).json(result);
  });

  /**
   * Odświeża token JWT, delegując logikę do AuthService.
   */
  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      throw new AppError("Refresh token jest wymagany", 400);
    }
    const result = await this.authService.odswiezToken(refresh_token);
    res.status(200).json(result);
  });

  /**
   * Wylogowuje użytkownika
   */
  public logout = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      if (!req.user || !req.user.id_logowania) {
        throw new AppError("Brak danych do wylogowania.", 400);
      }
      await this.authService.wylogujUzytkownika(req.user.id_logowania);
      res.json({ success: true, message: "Pomyślnie wylogowano." });
    },
  );

  /**
   * Pobiera profil zalogowanego użytkownika na podstawie jego emaila z tokenu
   */
  public getUserProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      if (!req.user) {
        throw new AppError("Brak danych użytkownika. Dostęp zabroniony.", 401);
      }
      const userEmail = req.user.adres_email;
      const user =
        await this.authService.pobierzSzczegolyUzytkownika(userEmail);
      res.json({ success: true, user });
    },
  );

  /**
   * Zwraca status zalogowanego użytkownika
   */
  public status = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Middleware `authenticateToken` już zweryfikowało token i dołączyło `req.user`
      // Wystarczy, że sprawdzimy jego istnienie i go zwrócimy.
      if (!req.user) {
        throw new AppError("Użytkownik nie jest uwierzytelniony.", 401);
      }
      res.json({ success: true, user: req.user });
    },
  );
}

export default new AuthController();
