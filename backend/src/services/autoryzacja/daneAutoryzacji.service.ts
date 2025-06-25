import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import DaneAutoryzacji, {
  DaneAutoryzacjiAttributes,
  DaneAutoryzacjiCreationAttributes,
} from "../../models/autoryzacja/DaneAutoryzacji";
import { AppError } from "../../utils/AppError";

export interface TokenPayload {
  id_logowania: string;
  id_powiazany: string;
  adres_email: string;
  rola_uzytkownika: "admin" | "staff" | "supplier";
}

export interface LoginRequest {
  adres_email: string;
  haslo: string;
  adres_ip?: string;
  user_agent?: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
  uzytkownik: {
    id_logowania: string;
    id_powiazany: string;
    adres_email: string;
    rola_uzytkownika: string;
    ostatnie_logowanie: Date;
  };
}

export class DaneAutoryzacjiService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "msbox-secret-key";
  private readonly JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "msbox-refresh-secret";
  private readonly TOKEN_EXPIRY = "15m"; // Token główny na 15 minut
  private readonly REFRESH_TOKEN_EXPIRY = "7d"; // Refresh token na 7 dni

  /**
   * Logowanie użytkownika
   */
  async zalogujUzytkownika(requestData: LoginRequest): Promise<LoginResponse> {
    const { adres_email, haslo, adres_ip, user_agent } = requestData;

    // Znajdź użytkownika po emailu
    const uzytkownik = await DaneAutoryzacji.findOne({
      where: { adres_email },
    });

    if (!uzytkownik) {
      throw new AppError("Nieprawidłowy email lub hasło", 401);
    }

    // Sprawdź czy konto nie jest zablokowane
    if (uzytkownik.isAccountLocked()) {
      throw new AppError(
        "Konto zostało tymczasowo zablokowane. Spróbuj ponownie później.",
        423,
      );
    }

    // Weryfikuj hasło
    const hasloPoprawne = await bcrypt.compare(haslo, uzytkownik.hash_hasla);

    if (!hasloPoprawne) {
      // Zwiększ liczbę nieudanych prób
      uzytkownik.incrementFailedAttempts();
      await uzytkownik.save();

      throw new AppError("Nieprawidłowy email lub hasło", 401);
    }

    // Resetuj nieudane próby i zaktualizuj ostatnie logowanie
    uzytkownik.resetFailedAttempts();
    uzytkownik.ostatnie_logowanie = new Date();
    await uzytkownik.save();

    // Generuj tokeny
    const tokenPayload: TokenPayload = {
      id_logowania: uzytkownik.id_logowania,
      id_powiazany: uzytkownik.id_powiazany,
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
        id_powiazany: uzytkownik.id_powiazany,
        adres_email: uzytkownik.adres_email,
        rola_uzytkownika: uzytkownik.rola_uzytkownika,
        ostatnie_logowanie: uzytkownik.ostatnie_logowanie,
      },
    };
  }

  /**
   * Odświeżenie tokenu
   */
  async odswiezToken(
    refresh_token: string,
  ): Promise<{ token: string; refresh_token: string }> {
    try {
      const decoded = jwt.verify(
        refresh_token,
        this.JWT_REFRESH_SECRET,
      ) as TokenPayload;

      // Sprawdź czy użytkownik nadal istnieje
      const uzytkownik = await DaneAutoryzacji.findByPk(decoded.id_logowania);
      if (!uzytkownik) {
        throw new AppError("Użytkownik nie istnieje", 401);
      }

      // Sprawdź czy konto nie jest zablokowane
      if (uzytkownik.isAccountLocked()) {
        throw new AppError("Konto zostało zablokowane", 423);
      }

      const tokenPayload: TokenPayload = {
        id_logowania: uzytkownik.id_logowania,
        id_powiazany: uzytkownik.id_powiazany,
        adres_email: uzytkownik.adres_email,
        rola_uzytkownika: uzytkownik.rola_uzytkownika,
      };

      const newToken = jwt.sign(tokenPayload, this.JWT_SECRET, {
        expiresIn: this.TOKEN_EXPIRY,
      });
      const newRefreshToken = jwt.sign(tokenPayload, this.JWT_REFRESH_SECRET, {
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
      });

      return {
        token: newToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new AppError("Nieprawidłowy refresh token", 401);
    }
  }

  /**
   * Weryfikacja tokenu
   */
  async weryfikujToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as TokenPayload;

      // Sprawdź czy użytkownik nadal istnieje
      const uzytkownik = await DaneAutoryzacji.findByPk(decoded.id_logowania);
      if (!uzytkownik) {
        throw new AppError("Użytkownik nie istnieje", 401);
      }

      return decoded;
    } catch (error) {
      throw new AppError("Nieprawidłowy token", 401);
    }
  }

  /**
   * Tworzenie nowego konta użytkownika
   */
  async utworzKonto(
    daneKonta: DaneAutoryzacjiCreationAttributes & { haslo: string },
  ): Promise<DaneAutoryzacjiAttributes> {
    const { haslo, ...pozostaleDane } = daneKonta;

    // Sprawdź czy email już istnieje
    const istniejacyUzytkownik = await DaneAutoryzacji.findOne({
      where: { adres_email: pozostaleDane.adres_email },
    });

    if (istniejacyUzytkownik) {
      throw new AppError("Użytkownik z tym adresem email już istnieje", 409);
    }

    // Zahashuj hasło
    const hash_hasla = await bcrypt.hash(haslo, 12);

    // Utwórz konto
    const noweKonto = await DaneAutoryzacji.create({
      ...pozostaleDane,
      hash_hasla,
    });

    return noweKonto.toJSON();
  }

  /**
   * Zmiana hasła
   */
  async zmienHaslo(
    id_logowania: string,
    stareHaslo: string,
    noweHaslo: string,
  ): Promise<void> {
    const uzytkownik = await DaneAutoryzacji.findByPk(id_logowania);

    if (!uzytkownik) {
      throw new AppError("Użytkownik nie istnieje", 404);
    }

    // Weryfikuj stare hasło
    const stareHasloPoprawne = await bcrypt.compare(
      stareHaslo,
      uzytkownik.hash_hasla,
    );
    if (!stareHasloPoprawne) {
      throw new AppError("Nieprawidłowe stare hasło", 401);
    }

    // Zahashuj nowe hasło
    const nowyHash = await bcrypt.hash(noweHaslo, 12);

    // Zaktualizuj hasło
    uzytkownik.hash_hasla = nowyHash;
    uzytkownik.nieudane_proby_logowania = 0; // Resetuj nieudane próby
    uzytkownik.zablokowane_do = null; // Odblokuj konto
    await uzytkownik.save();
  }

  /**
   * Resetowanie hasła (przez administratora)
   */
  async resetujHaslo(id_logowania: string, noweHaslo: string): Promise<void> {
    const uzytkownik = await DaneAutoryzacji.findByPk(id_logowania);

    if (!uzytkownik) {
      throw new AppError("Użytkownik nie istnieje", 404);
    }

    // Zahashuj nowe hasło
    const nowyHash = await bcrypt.hash(noweHaslo, 12);

    // Zaktualizuj hasło i resetuj blokady
    uzytkownik.hash_hasla = nowyHash;
    uzytkownik.nieudane_proby_logowania = 0;
    uzytkownik.zablokowane_do = null;
    await uzytkownik.save();
  }

  /**
   * Odblokowanie konta
   */
  async odblokujKonto(id_logowania: string): Promise<void> {
    const uzytkownik = await DaneAutoryzacji.findByPk(id_logowania);

    if (!uzytkownik) {
      throw new AppError("Użytkownik nie istnieje", 404);
    }

    uzytkownik.nieudane_proby_logowania = 0;
    uzytkownik.zablokowane_do = null;
    await uzytkownik.save();
  }

  /**
   * Pobierz wszystkich użytkowników (tylko dla adminów)
   */
  async pobierzWszystkichUzytkownikow(): Promise<DaneAutoryzacjiAttributes[]> {
    const uzytkownicy = await DaneAutoryzacji.findAll({
      attributes: { exclude: ["hash_hasla"] }, // Nie zwracaj hashy haseł
      order: [["data_utworzenia", "DESC"]],
    });

    return uzytkownicy.map((u: DaneAutoryzacji) => u.toJSON());
  }

  /**
   * Pobierz użytkownika po ID
   */
  async pobierzUzytkownika(
    id_logowania: string,
  ): Promise<DaneAutoryzacjiAttributes | null> {
    const uzytkownik = await DaneAutoryzacji.findByPk(id_logowania, {
      attributes: { exclude: ["hash_hasla"] },
    });

    return uzytkownik ? uzytkownik.toJSON() : null;
  }

  /**
   * Usuń konto użytkownika
   */
  async usunKonto(id_logowania: string): Promise<void> {
    const uzytkownik = await DaneAutoryzacji.findByPk(id_logowania);

    if (!uzytkownik) {
      throw new AppError("Użytkownik nie istnieje", 404);
    }

    await uzytkownik.destroy();
  }

  /**
   * Statystyki użytkowników
   */
  async pobierzStatystyki(): Promise<{
    lacznie_uzytkownikow: number;
    adminow: number;
    pracownikow: number;
    dostawcow: number;
    zablokowanych: number;
    aktywnych_dzisiaj: number;
  }> {
    const dzisiaj = new Date();
    dzisiaj.setHours(0, 0, 0, 0);

    const [
      lacznie_uzytkownikow,
      adminow,
      pracownikow,
      dostawcow,
      zablokowanych,
      aktywnych_dzisiaj,
    ] = await Promise.all([
      DaneAutoryzacji.count(),
      DaneAutoryzacji.count({ where: { rola_uzytkownika: "admin" } }),
      DaneAutoryzacji.count({ where: { rola_uzytkownika: "staff" } }),
      DaneAutoryzacji.count({ where: { rola_uzytkownika: "supplier" } }),
      DaneAutoryzacji.count({
        where: {
          zablokowane_do: { [Op.gt]: new Date() },
        },
      }),
      DaneAutoryzacji.count({
        where: {
          ostatnie_logowanie: { [Op.gte]: dzisiaj },
        },
      }),
    ]);

    return {
      lacznie_uzytkownikow,
      adminow,
      pracownikow,
      dostawcow,
      zablokowanych,
      aktywnych_dzisiaj,
    };
  }
}
