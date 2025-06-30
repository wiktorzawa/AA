import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserWithDetails } from "../../models/auth";
import { AuthDaneAutoryzacji } from "../../models/auth/AuthDaneAutoryzacji";
import { AuthHistoriaLogowan } from "../../models/auth/AuthHistoriaLogowan";
import {
  LoginRequest,
  LoginResponse,
  LegacyLoginRequest,
  LegacyLoginResponse,
  TokenPayload,
} from "../../types/auth.types";

export class AuthController {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "msbox-secret-key";
  private readonly JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "msbox-refresh-secret";
  private readonly TOKEN_EXPIRY = "15m";
  private readonly REFRESH_TOKEN_EXPIRY = "7d";

  /**
   * Logowanie użytkownika - obsługuje oba formaty (legacy i nowy)
   */
  public login = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Obsługa obu formatów - legacy (username/password) i nowy (adres_email/haslo)
      const body = req.body;
      let adres_email: string;
      let haslo: string;

      if ("username" in body && "password" in body) {
        // Legacy format
        const { username, password } = body as LegacyLoginRequest;
        adres_email = username;
        haslo = password;
      } else {
        // Nowy format
        const { adres_email: email, haslo: pass } = body as LoginRequest;
        adres_email = email;
        haslo = pass;
      }

      if (!adres_email || !haslo) {
        res.status(400).json({
          success: false,
          error: "Adres email i hasło są wymagane",
        });
        return;
      }

      try {
        // Znajdź użytkownika po emailu
        const uzytkownik = await AuthDaneAutoryzacji.findByEmail(adres_email);

        if (!uzytkownik) {
          res.status(401).json({
            success: false,
            error: "Nieprawidłowe dane logowania",
          });
          return;
        }

        // Sprawdź czy konto nie jest zablokowane
        if (uzytkownik.isAccountLocked()) {
          res.status(423).json({
            success: false,
            error:
              "Konto zostało tymczasowo zablokowane. Spróbuj ponownie później.",
          });
          return;
        }

        // Weryfikuj hasło
        const hasloPoprawne = await bcrypt.compare(
          haslo,
          uzytkownik.hash_hasla,
        );

        if (!hasloPoprawne) {
          // Zwiększ liczbę nieudanych prób
          uzytkownik.incrementFailedAttempts();
          await uzytkownik.save();

          // Loguj nieudaną próbę logowania
          await AuthHistoriaLogowan.logujNieudaneLogowanie(
            uzytkownik.id_logowania,
          );

          res.status(401).json({
            success: false,
            error: "Nieprawidłowe dane logowania",
          });
          return;
        }

        // Resetuj nieudane próby i zaktualizuj ostatnie logowanie
        uzytkownik.resetFailedAttempts();
        await uzytkownik.save();

        // Loguj udane logowanie
        await AuthHistoriaLogowan.logujUdaneLogowanie(uzytkownik.id_logowania);

        // Generuj tokeny
        const tokenPayload: TokenPayload = {
          id_logowania: uzytkownik.id_logowania,
          id_uzytkownika: uzytkownik.id_uzytkownika,
          adres_email: uzytkownik.adres_email,
          rola_uzytkownika: uzytkownik.rola_uzytkownika,
        };

        const token = jwt.sign(tokenPayload, this.JWT_SECRET, {
          expiresIn: this.TOKEN_EXPIRY,
        });
        const refresh_token = jwt.sign(tokenPayload, this.JWT_REFRESH_SECRET, {
          expiresIn: this.REFRESH_TOKEN_EXPIRY,
        });

        // Sprawdź czy frontend oczekuje legacy format
        if ("username" in body) {
          // Legacy response
          res.json({
            success: true,
            userRole: uzytkownik.rola_uzytkownika,
            userId: uzytkownik.id_uzytkownika,
            token,
            refresh_token,
          } as LegacyLoginResponse);
        } else {
          // Nowy response format
          res.json({
            token,
            refresh_token,
            uzytkownik: {
              id_logowania: uzytkownik.id_logowania,
              id_uzytkownika: uzytkownik.id_uzytkownika,
              adres_email: uzytkownik.adres_email,
              rola_uzytkownika: uzytkownik.rola_uzytkownika,
              ostatnie_logowanie: uzytkownik.ostatnie_logowanie,
            },
          } as LoginResponse);
        }
      } catch (error) {
        console.error("Błąd podczas logowania:", error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera podczas logowania",
        });
      }
    },
  );

  /**
   * Odświeżenie tokenu
   */
  public refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        res.status(400).json({
          success: false,
          error: "Refresh token jest wymagany",
        });
        return;
      }

      try {
        const decoded = jwt.verify(
          refresh_token,
          this.JWT_REFRESH_SECRET,
        ) as TokenPayload;

        // Sprawdź czy użytkownik nadal istnieje
        const uzytkownik = await AuthDaneAutoryzacji.findByPk(
          decoded.id_logowania,
        );
        if (!uzytkownik) {
          res.status(401).json({
            success: false,
            error: "Użytkownik nie istnieje",
          });
          return;
        }

        // Sprawdź czy konto nie jest zablokowane
        if (uzytkownik.isAccountLocked()) {
          res.status(423).json({
            success: false,
            error: "Konto zostało zablokowane",
          });
          return;
        }

        const tokenPayload: TokenPayload = {
          id_logowania: uzytkownik.id_logowania,
          id_uzytkownika: uzytkownik.id_uzytkownika,
          adres_email: uzytkownik.adres_email,
          rola_uzytkownika: uzytkownik.rola_uzytkownika,
        };

        const newToken = jwt.sign(tokenPayload, this.JWT_SECRET, {
          expiresIn: this.TOKEN_EXPIRY,
        });
        const newRefreshToken = jwt.sign(
          tokenPayload,
          this.JWT_REFRESH_SECRET,
          {
            expiresIn: this.REFRESH_TOKEN_EXPIRY,
          },
        );

        res.json({
          success: true,
          token: newToken,
          refresh_token: newRefreshToken,
        });
      } catch {
        res.status(401).json({
          success: false,
          error: "Nieprawidłowy refresh token",
        });
      }
    },
  );

  /**
   * Wylogowanie użytkownika
   */
  public logout = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = (req as Request & { user: TokenPayload }).user;

      if (!user) {
        res.status(401).json({
          success: false,
          error: "Brak autoryzacji",
        });
        return;
      }

      try {
        // Znajdź ostatnią aktywną sesję użytkownika
        const ostatniaSesja = await AuthHistoriaLogowan.findOne({
          where: {
            id_logowania: user.id_logowania,
            status_logowania: "success",
            koniec_sesji: null,
          },
          order: [["data_proby_logowania", "DESC"]],
        });

        if (ostatniaSesja) {
          // Zakończ sesję
          await ostatniaSesja.zakonczSesje();
          console.log(
            `📝 [auth]: Zakończono sesję dla użytkownika ${user.adres_email}`,
          );
        }

        res.json({
          success: true,
          message: "Wylogowano pomyślnie",
        });
      } catch (error) {
        console.error("Błąd podczas wylogowania:", error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera podczas wylogowania",
        });
      }
    },
  );

  /**
   * Pobierz dane użytkownika z szczegółami
   */
  public getUserProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.params;

      try {
        const userWithDetails = await getUserWithDetails(email);

        if (!userWithDetails) {
          res.status(404).json({
            success: false,
            error: "Użytkownik nie znaleziony",
          });
          return;
        }

        res.json({
          success: true,
          data: userWithDetails,
        });
      } catch (error) {
        console.error("Błąd podczas pobierania profilu użytkownika:", error);
        res.status(500).json({
          success: false,
          error: "Błąd serwera",
        });
      }
    },
  );
}

export default new AuthController();
