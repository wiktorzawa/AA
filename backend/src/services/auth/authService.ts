import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sequelize } from "../../config/database";
import { USER_ROLES, ERROR_MESSAGES } from "../../constants";

// --- BEZPOŚREDNIE IMPORTY MODELI I TYPÓW ---
import {
  AuthDaneAutoryzacji,
  type AuthDaneAutoryzacjiAttributes,
} from "../../models/auth/AuthDaneAutoryzacji";
import {
  AuthPracownicy,
  type AuthPracownicyAttributes,
  type AuthPracownicyCreationAttributes,
} from "../../models/auth/AuthPracownicy";
import {
  AuthDostawcy,
  type AuthDostawcyAttributes,
  type AuthDostawcyCreationAttributes,
} from "../../models/auth/AuthDostawcy";
import { AuthHistoriaLogowan } from "../../models/auth/AuthHistoriaLogowan";
import { getUserWithDetails } from "../../models/auth";

import {
  type TokenPayload,
  type LoginRequest,
  type LoginResponse,
  type CreatePracownikData,
  type CreateDostawcaData,
} from "../../types/auth.types";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";
import { config } from "../../config/config";

// Interfejsy dla odpowiedzi z serwisu
export interface CreatePracownikResponseTyped {
  pracownik: AuthPracownicyAttributes;
  daneAutoryzacji: AuthDaneAutoryzacjiAttributes;
  wygenerowane_haslo?: string;
}

export interface CreateDostawcaResponseTyped {
  dostawca: AuthDostawcyAttributes;
  daneAutoryzacji: AuthDaneAutoryzacjiAttributes;
  wygenerowane_haslo?: string;
}

export class AuthService {
  private readonly JWT_SECRET = config.jwtSecret;
  private readonly JWT_REFRESH_SECRET = config.jwtRefreshSecret;
  private readonly TOKEN_EXPIRY = "15m";
  private readonly REFRESH_TOKEN_EXPIRY = "7d";

  private generateSecurePassword(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // --- ZARZĄDZANIE PRACOWNIKAMI ---

  async utworzPracownika(
    data: CreatePracownikData,
  ): Promise<CreatePracownikResponseTyped> {
    const transaction = await sequelize.transaction();
    try {
      if (!data.imie || !data.nazwisko || !data.rola || !data.adres_email) {
        throw new AppError("Wszystkie wymagane pola muszą być wypełnione", 400);
      }
      if (data.rola !== USER_ROLES.ADMIN && data.rola !== USER_ROLES.STAFF) {
        throw new AppError(ERROR_MESSAGES.INVALID_ROLE, 400);
      }
      const existingAuthByEmail = await AuthDaneAutoryzacji.findByEmail(
        data.adres_email,
      );
      if (existingAuthByEmail) {
        throw new AppError("Adres email jest już używany w systemie", 409);
      }

      const id_pracownika = await AuthPracownicy.generateUniqueId(data.rola);
      const haslo = data.haslo || this.generateSecurePassword();
      const wygenerowane_haslo = !data.haslo ? haslo : undefined;
      const hash_hasla = await bcrypt.hash(haslo, 12);

      const pracownik = await AuthPracownicy.create(
        { id_pracownika, ...data } as AuthPracownicyCreationAttributes,
        { transaction },
      );
      const id_logowania = AuthDaneAutoryzacji.generateLoginId(id_pracownika);
      const daneAutoryzacji = await AuthDaneAutoryzacji.create(
        {
          id_logowania,
          id_uzytkownika: id_pracownika,
          adres_email: data.adres_email,
          hash_hasla,
          rola_uzytkownika: data.rola,
        },
        { transaction },
      );

      await transaction.commit();
      return {
        pracownik: pracownik.toJSON(),
        daneAutoryzacji: daneAutoryzacji.toJSON(),
        wygenerowane_haslo,
      };
    } catch (error) {
      await transaction.rollback();
      if (error instanceof AppError) throw error;
      throw new AppError("Błąd podczas tworzenia pracownika", 500);
    }
  }

  async aktualizujPracownika(
    id_pracownika: string,
    data: Partial<CreatePracownikData>,
  ): Promise<AuthPracownicyAttributes> {
    const pracownik = await AuthPracownicy.findByPk(id_pracownika);
    if (!pracownik) throw new AppError("Pracownik nie znaleziony", 404);
    await pracownik.update(data);
    return pracownik.toJSON();
  }

  async usunPracownika(id_pracownika: string): Promise<void> {
    const pracownik = await AuthPracownicy.findByPk(id_pracownika);
    if (!pracownik) throw new AppError("Pracownik nie znaleziony", 404);
    await AuthDaneAutoryzacji.destroy({
      where: { id_uzytkownika: id_pracownika },
    });
    await pracownik.destroy();
  }

  async pobierzWszystkichPracownikow(): Promise<AuthPracownicyAttributes[]> {
    const pracownicy = await AuthPracownicy.findAll({
      order: [["data_utworzenia", "DESC"]],
    });
    return pracownicy.map((p: AuthPracownicy) => p.toJSON());
  }

  async pobierzPracownika(
    id_pracownika: string,
  ): Promise<AuthPracownicyAttributes | null> {
    const pracownik = await AuthPracownicy.findByPk(id_pracownika);
    return pracownik ? pracownik.toJSON() : null;
  }

  // --- ZARZĄDZANIE DOSTAWCAMI ---

  async utworzDostawce(
    data: CreateDostawcaData,
  ): Promise<CreateDostawcaResponseTyped> {
    const transaction = await sequelize.transaction();
    try {
      if (
        !data.nazwa_firmy ||
        !data.imie_kontaktu ||
        !data.nazwisko_kontaktu ||
        !data.numer_nip ||
        !data.adres_email
      ) {
        throw new AppError("Kluczowe pola dostawcy muszą być wypełnione", 400);
      }
      const existingAuthByEmail = await AuthDaneAutoryzacji.findByEmail(
        data.adres_email,
      );
      if (existingAuthByEmail) {
        throw new AppError("Adres email jest już używany w systemie", 409);
      }
      const existingSupplierByNip = await AuthDostawcy.findByNip(
        data.numer_nip,
      );
      if (existingSupplierByNip) {
        throw new AppError("Dostawca o podanym NIP już istnieje", 409);
      }

      const id_dostawcy = await AuthDostawcy.generateUniqueId();
      const haslo = data.haslo || this.generateSecurePassword();
      const wygenerowane_haslo = !data.haslo ? haslo : undefined;
      const hash_hasla = await bcrypt.hash(haslo, 12);

      const dostawca = await AuthDostawcy.create(
        { id_dostawcy, ...data } as AuthDostawcyCreationAttributes,
        { transaction },
      );
      const id_logowania = AuthDaneAutoryzacji.generateLoginId(id_dostawcy);
      const daneAutoryzacji = await AuthDaneAutoryzacji.create(
        {
          id_logowania,
          id_uzytkownika: id_dostawcy,
          adres_email: data.adres_email,
          hash_hasla,
          rola_uzytkownika: USER_ROLES.SUPPLIER,
        },
        { transaction },
      );

      await transaction.commit();
      return {
        dostawca: dostawca.toJSON(),
        daneAutoryzacji: daneAutoryzacji.toJSON(),
        wygenerowane_haslo,
      };
    } catch (error) {
      await transaction.rollback();
      if (error instanceof AppError) throw error;
      throw new AppError("Błąd podczas tworzenia dostawcy", 500);
    }
  }

  async aktualizujDostawce(
    id_dostawcy: string,
    data: Partial<CreateDostawcaData>,
  ): Promise<AuthDostawcyAttributes> {
    const dostawca = await AuthDostawcy.findByPk(id_dostawcy);
    if (!dostawca) throw new AppError("Dostawca nie znaleziony", 404);
    await dostawca.update(data);
    return dostawca.toJSON();
  }

  async usunDostawce(id_dostawcy: string): Promise<void> {
    const dostawca = await AuthDostawcy.findByPk(id_dostawcy);
    if (!dostawca) throw new AppError("Dostawca nie znaleziony", 404);
    await AuthDaneAutoryzacji.destroy({
      where: { id_uzytkownika: id_dostawcy },
    });
    await dostawca.destroy();
  }

  async pobierzWszystkichDostawcow(): Promise<AuthDostawcyAttributes[]> {
    const dostawcy = await AuthDostawcy.findAll({
      order: [["data_utworzenia", "DESC"]],
    });
    return dostawcy.map((d: AuthDostawcy) => d.toJSON());
  }

  async pobierzDostawce(
    id_dostawcy: string,
  ): Promise<AuthDostawcyAttributes | null> {
    const dostawca = await AuthDostawcy.findByPk(id_dostawcy);
    return dostawca ? dostawca.toJSON() : null;
  }

  async sprawdzDostepnoscNIP(nip: string): Promise<boolean> {
    const dostawca = await AuthDostawcy.findByNip(nip);
    return !dostawca;
  }

  async sprawdzDostepnoscEmail(email: string): Promise<boolean> {
    const uzytkownik = await AuthDaneAutoryzacji.findByEmail(email);
    return !uzytkownik;
  }

  // --- LOGIKA AUTORYZACJI ---

  async zalogujUzytkownika(requestData: LoginRequest): Promise<LoginResponse> {
    if (!this.JWT_SECRET || !this.JWT_REFRESH_SECRET) {
      throw new AppError("Błąd konfiguracji serwera: brak kluczy JWT", 500);
    }
    const { adres_email, haslo } = requestData;
    if (!adres_email || !haslo) {
      throw new AppError(ERROR_MESSAGES.MISSING_CREDENTIALS, 400);
    }
    const uzytkownik = await AuthDaneAutoryzacji.findByEmail(adres_email);
    if (!uzytkownik) {
      throw new AppError("Nieprawidłowy email lub hasło", 401);
    }
    if (uzytkownik.isAccountLocked()) {
      throw new AppError("Konto zostało tymczasowo zablokowane.", 423);
    }
    const hasloPoprawne = await bcrypt.compare(haslo, uzytkownik.hash_hasla);
    if (!hasloPoprawne) {
      uzytkownik.incrementFailedAttempts();
      await uzytkownik.save();
      await AuthHistoriaLogowan.logujNieudaneLogowanie(uzytkownik.id_logowania);
      throw new AppError("Nieprawidłowy email lub hasło", 401);
    }
    uzytkownik.resetFailedAttempts();
    await uzytkownik.save();
    await AuthHistoriaLogowan.logujUdaneLogowanie(uzytkownik.id_logowania);
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
    return {
      token,
      refresh_token,
      uzytkownik: {
        id_logowania: uzytkownik.id_logowania,
        id_uzytkownika: uzytkownik.id_uzytkownika,
        adres_email: uzytkownik.adres_email,
        rola_uzytkownika: uzytkownik.rola_uzytkownika,
        ostatnie_logowanie: uzytkownik.ostatnie_logowanie,
      },
    };
  }

  async odswiezToken(
    refresh_token: string,
  ): Promise<{ token: string; refresh_token: string }> {
    if (!this.JWT_SECRET || !this.JWT_REFRESH_SECRET) {
      throw new AppError("Błąd konfiguracji serwera: brak kluczy JWT", 500);
    }
    try {
      const decoded = jwt.verify(
        refresh_token,
        this.JWT_REFRESH_SECRET,
      ) as TokenPayload;

      const daneAutoryzacji = await AuthDaneAutoryzacji.findByPk(
        decoded.id_logowania,
      );
      if (!daneAutoryzacji || daneAutoryzacji.isAccountLocked()) {
        throw new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, 401);
      }

      const tokenPayload: TokenPayload = {
        id_logowania: daneAutoryzacji.id_logowania,
        id_uzytkownika: daneAutoryzacji.id_uzytkownika,
        adres_email: daneAutoryzacji.adres_email,
        rola_uzytkownika: daneAutoryzacji.rola_uzytkownika,
      };

      const newToken = jwt.sign(tokenPayload, this.JWT_SECRET, {
        expiresIn: this.TOKEN_EXPIRY,
      });
      const newRefreshToken = jwt.sign(tokenPayload, this.JWT_REFRESH_SECRET, {
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
      });

      return { token: newToken, refresh_token: newRefreshToken };
    } catch {
      throw new AppError("Nieprawidłowy refresh token", 401);
    }
  }

  async wylogujUzytkownika(id_logowania: string): Promise<void> {
    try {
      const ostatniaSesja = await AuthHistoriaLogowan.findOne({
        where: {
          id_logowania: id_logowania,
          status_logowania: "success",
          koniec_sesji: null,
        },
        order: [["data_proby_logowania", "DESC"]],
      });
      if (ostatniaSesja) {
        await ostatniaSesja.zakonczSesje();
      }
    } catch (error) {
      logger.error("Błąd serwera podczas kończenia sesji", { error });
      // Nie rzucamy błędu, bo wylogowanie na frontendzie jest ważniejsze
    }
  }

  async pobierzSzczegolyUzytkownika(
    email: string,
  ): Promise<AuthDaneAutoryzacjiAttributes | null> {
    const user = await getUserWithDetails(email);
    return user ? (user.toJSON() as AuthDaneAutoryzacjiAttributes) : null;
  }

  async pobierzUzytkownika(
    id_logowania: string,
  ): Promise<AuthDaneAutoryzacjiAttributes | null> {
    const uzytkownik = await AuthDaneAutoryzacji.findByPk(id_logowania, {
      attributes: { exclude: ["hash_hasla"] },
    });
    return uzytkownik ? uzytkownik.toJSON() : null;
  }
}
