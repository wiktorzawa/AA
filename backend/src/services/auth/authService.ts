import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { sequelize } from "../../config/database";
import {
  AuthDaneAutoryzacji,
  type AuthDaneAutoryzacjiAttributes,
  type AuthDaneAutoryzacjiCreationAttributes,
} from "../../models/auth/AuthDaneAutoryzacji";
import {
  AuthPracownicy,
  type AuthPracownicyAttributes,
} from "../../models/auth/AuthPracownicy";
import {
  AuthDostawcy,
  type AuthDostawcyAttributes,
} from "../../models/auth/AuthDostawcy";
import {
  type TokenPayload,
  type LoginRequest,
  type LoginResponse,
  type CreatePracownikData,
  type CreateDostawcaData,
} from "../../types/auth.types";
import { AppError } from "../../utils/AppError";

// 🔄 ZAKTUALIZOWANE RESPONSE INTERFACES Z PRAWIDŁOWYMI TYPAMI
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
  private readonly JWT_SECRET = process.env.JWT_SECRET || "msbox-secret-key";
  private readonly JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "msbox-refresh-secret";
  private readonly TOKEN_EXPIRY = "15m"; // Token główny na 15 minut
  private readonly REFRESH_TOKEN_EXPIRY = "7d"; // Refresh token na 7 dni

  /**
   * 🆕 Generuje bezpieczne hasło
   */
  private generateSecurePassword(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * 🆕 Tworzy nowego pracownika z pełną kontrolą transakcji
   */
  async utworzPracownika(
    data: CreatePracownikData,
  ): Promise<CreatePracownikResponseTyped> {
    const transaction = await sequelize.transaction();

    try {
      // 1. Walidacja danych wejściowych
      if (!data.imie || !data.nazwisko || !data.rola || !data.adres_email) {
        throw new AppError("Wszystkie wymagane pola muszą być wypełnione", 400);
      }

      if (data.rola !== "admin" && data.rola !== "staff") {
        throw new AppError(
          'Nieprawidłowa rola. Dozwolone wartości to "admin" lub "staff"',
          400,
        );
      }

      // 2. Sprawdź czy email już istnieje
      const existingStaffByEmail = await AuthPracownicy.findOne({
        where: { adres_email: data.adres_email },
        transaction,
      });

      if (existingStaffByEmail) {
        throw new AppError(
          "Pracownik o podanym adresie email już istnieje",
          409,
        );
      }

      const existingAuthByEmail = await AuthDaneAutoryzacji.findByEmail(
        data.adres_email,
      );
      if (existingAuthByEmail) {
        throw new AppError("Adres email jest już używany w systemie", 409);
      }

      // 3. Generuj unikalny ID pracownika
      const id_pracownika = await AuthPracownicy.generateUniqueId(data.rola);

      // 4. Przygotuj hasło
      const haslo = data.haslo || this.generateSecurePassword();
      const wygenerowane_haslo = !data.haslo ? haslo : undefined;
      const hash_hasla = await bcrypt.hash(haslo, 12);

      // 5. Utwórz pracownika
      const pracownik = await AuthPracownicy.create(
        {
          id_pracownika,
          imie: data.imie,
          nazwisko: data.nazwisko,
          rola: data.rola,
          adres_email: data.adres_email,
          telefon: data.telefon,
        },
        { transaction },
      );

      // 6. Utwórz dane autoryzacji
      const id_logowania = AuthDaneAutoryzacji.generateLoginId(id_pracownika);
      const daneAutoryzacji = await AuthDaneAutoryzacji.create(
        {
          id_logowania,
          id_uzytkownika: id_pracownika,
          adres_email: data.adres_email,
          hash_hasla,
          rola_uzytkownika: data.rola,
          nieudane_proby_logowania: 0,
        },
        { transaction },
      );

      await transaction.commit();

      console.log(
        `✅ [AuthService]: Utworzono pracownika ${id_pracownika} z rolą ${data.rola}`,
      );

      return {
        pracownik: pracownik.toJSON(),
        daneAutoryzacji: daneAutoryzacji.toJSON(),
        wygenerowane_haslo,
      };
    } catch (error) {
      await transaction.rollback();
      console.error(
        "❌ [AuthService]: Błąd podczas tworzenia pracownika:",
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas tworzenia pracownika", 500);
    }
  }

  /**
   * 🆕 Tworzy nowego dostawcę z pełną kontrolą transakcji
   */
  async utworzDostawce(
    data: CreateDostawcaData,
  ): Promise<CreateDostawcaResponseTyped> {
    const transaction = await sequelize.transaction();

    try {
      // 1. Walidacja danych wejściowych
      if (
        !data.nazwa_firmy ||
        !data.imie_kontaktu ||
        !data.nazwisko_kontaktu ||
        !data.numer_nip ||
        !data.adres_email ||
        !data.telefon ||
        !data.adres_ulica ||
        !data.adres_numer_budynku ||
        !data.adres_miasto ||
        !data.adres_kod_pocztowy ||
        !data.adres_kraj
      ) {
        throw new AppError("Wszystkie wymagane pola muszą być wypełnione", 400);
      }

      // 2. Sprawdź czy NIP już istnieje
      const existingSupplierByNip = await AuthDostawcy.findByNip(
        data.numer_nip,
      );
      if (existingSupplierByNip) {
        throw new AppError("Dostawca o podanym NIP już istnieje", 409);
      }

      // 3. Sprawdź czy email już istnieje
      const existingSupplierByEmail = await AuthDostawcy.findByEmail(
        data.adres_email,
      );
      if (existingSupplierByEmail) {
        throw new AppError(
          "Dostawca o podanym adresie email już istnieje",
          409,
        );
      }

      const existingAuthByEmail = await AuthDaneAutoryzacji.findByEmail(
        data.adres_email,
      );
      if (existingAuthByEmail) {
        throw new AppError("Adres email jest już używany w systemie", 409);
      }

      // 4. Generuj unikalny ID dostawcy
      const id_dostawcy = await AuthDostawcy.generateUniqueId();

      // 5. Przygotuj hasło
      const haslo = data.haslo || this.generateSecurePassword();
      const wygenerowane_haslo = !data.haslo ? haslo : undefined;
      const hash_hasla = await bcrypt.hash(haslo, 12);

      // 6. Utwórz dostawcę
      const dostawca = await AuthDostawcy.create(
        {
          id_dostawcy,
          nazwa_firmy: data.nazwa_firmy,
          imie_kontaktu: data.imie_kontaktu,
          nazwisko_kontaktu: data.nazwisko_kontaktu,
          numer_nip: data.numer_nip,
          adres_email: data.adres_email,
          telefon: data.telefon,
          strona_www: data.strona_www,
          adres_ulica: data.adres_ulica,
          adres_numer_budynku: data.adres_numer_budynku,
          adres_numer_lokalu: data.adres_numer_lokalu,
          adres_miasto: data.adres_miasto,
          adres_kod_pocztowy: data.adres_kod_pocztowy,
          adres_kraj: data.adres_kraj,
        },
        { transaction },
      );

      // 7. Utwórz dane autoryzacji
      const id_logowania = AuthDaneAutoryzacji.generateLoginId(id_dostawcy);
      const daneAutoryzacji = await AuthDaneAutoryzacji.create(
        {
          id_logowania,
          id_uzytkownika: id_dostawcy,
          adres_email: data.adres_email,
          hash_hasla,
          rola_uzytkownika: "supplier",
          nieudane_proby_logowania: 0,
        },
        { transaction },
      );

      await transaction.commit();

      console.log(
        `✅ [AuthService]: Utworzono dostawcę ${id_dostawcy} (${data.nazwa_firmy})`,
      );

      return {
        dostawca: dostawca.toJSON(),
        daneAutoryzacji: daneAutoryzacji.toJSON(),
        wygenerowane_haslo,
      };
    } catch (error) {
      await transaction.rollback();
      console.error(
        "❌ [AuthService]: Błąd podczas tworzenia dostawcy:",
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas tworzenia dostawcy", 500);
    }
  }

  /**
   * 🆕 Aktualizuje dane pracownika
   */
  async aktualizujPracownika(
    id_pracownika: string,
    data: Partial<CreatePracownikData>,
  ): Promise<AuthPracownicyAttributes> {
    const transaction = await sequelize.transaction();

    try {
      // 1. Sprawdź czy pracownik istnieje
      const existingStaff = await AuthPracownicy.findByPk(id_pracownika, {
        transaction,
      });
      if (!existingStaff) {
        throw new AppError("Pracownik nie został znaleziony", 404);
      }

      // 2. Jeśli zmieniamy email, sprawdź czy nowy email jest dostępny
      if (data.adres_email && data.adres_email !== existingStaff.adres_email) {
        const existingStaffByEmail = await AuthPracownicy.findOne({
          where: { adres_email: data.adres_email },
          transaction,
        });
        if (
          existingStaffByEmail &&
          existingStaffByEmail.id_pracownika !== id_pracownika
        ) {
          throw new AppError(
            "Pracownik o podanym adresie email już istnieje",
            409,
          );
        }
      }

      // 3. Aktualizuj dane pracownika
      await existingStaff.update(
        {
          imie: data.imie || existingStaff.imie,
          nazwisko: data.nazwisko || existingStaff.nazwisko,
          rola: data.rola || existingStaff.rola,
          adres_email: data.adres_email || existingStaff.adres_email,
          telefon:
            data.telefon !== undefined ? data.telefon : existingStaff.telefon,
        },
        { transaction },
      );

      // 4. Aktualizuj dane autoryzacji jeśli potrzeba
      if (data.adres_email || data.rola) {
        await AuthDaneAutoryzacji.update(
          {
            ...(data.adres_email && { adres_email: data.adres_email }),
            ...(data.rola && { rola_uzytkownika: data.rola }),
          },
          {
            where: { id_uzytkownika: id_pracownika },
            transaction,
          },
        );
      }

      await transaction.commit();

      const updatedStaff = await AuthPracownicy.findByPk(id_pracownika);
      return updatedStaff!.toJSON();
    } catch (error) {
      await transaction.rollback();
      console.error(
        `❌ [AuthService]: Błąd podczas aktualizacji pracownika ${id_pracownika}:`,
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas aktualizacji pracownika", 500);
    }
  }

  /**
   * 🆕 Usuwa pracownika i powiązane dane autoryzacji
   */
  async usunPracownika(id_pracownika: string): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      // 1. Sprawdź czy pracownik istnieje
      const existingStaff = await AuthPracownicy.findByPk(id_pracownika, {
        transaction,
      });
      if (!existingStaff) {
        throw new AppError("Pracownik nie został znaleziony", 404);
      }

      // 2. Usuń dane autoryzacji
      await AuthDaneAutoryzacji.destroy({
        where: { id_uzytkownika: id_pracownika },
        transaction,
      });

      // 3. Usuń pracownika
      await existingStaff.destroy({ transaction });

      await transaction.commit();

      console.log(`✅ [AuthService]: Usunięto pracownika ${id_pracownika}`);
    } catch (error) {
      await transaction.rollback();
      console.error(
        `❌ [AuthService]: Błąd podczas usuwania pracownika ${id_pracownika}:`,
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas usuwania pracownika", 500);
    }
  }

  /**
   * 🆕 Usuwa dostawcę i powiązane dane autoryzacji
   */
  async usunDostawce(id_dostawcy: string): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      // 1. Sprawdź czy dostawca istnieje
      const existingSupplier = await AuthDostawcy.findByPk(id_dostawcy, {
        transaction,
      });
      if (!existingSupplier) {
        throw new AppError("Dostawca nie został znaleziony", 404);
      }

      // 2. Usuń dane autoryzacji
      await AuthDaneAutoryzacji.destroy({
        where: { id_uzytkownika: id_dostawcy },
        transaction,
      });

      // 3. Usuń dostawcę
      await existingSupplier.destroy({ transaction });

      await transaction.commit();

      console.log(`✅ [AuthService]: Usunięto dostawcę ${id_dostawcy}`);
    } catch (error) {
      await transaction.rollback();
      console.error(
        `❌ [AuthService]: Błąd podczas usuwania dostawcy ${id_dostawcy}:`,
        error,
      );

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Błąd podczas usuwania dostawcy", 500);
    }
  }

  /**
   * Logowanie użytkownika
   */
  async zalogujUzytkownika(requestData: LoginRequest): Promise<LoginResponse> {
    const { adres_email, haslo } = requestData;

    // Znajdź użytkownika po emailu
    const uzytkownik = await AuthDaneAutoryzacji.findByEmail(adres_email);

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
    await uzytkownik.save();

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
      const uzytkownik = await AuthDaneAutoryzacji.findByPk(
        decoded.id_logowania,
      );
      if (!uzytkownik) {
        throw new AppError("Użytkownik nie istnieje", 401);
      }

      // Sprawdź czy konto nie jest zablokowane
      if (uzytkownik.isAccountLocked()) {
        throw new AppError("Konto zostało zablokowane", 423);
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
      const newRefreshToken = jwt.sign(tokenPayload, this.JWT_REFRESH_SECRET, {
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
      });

      return {
        token: newToken,
        refresh_token: newRefreshToken,
      };
    } catch {
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
      const uzytkownik = await AuthDaneAutoryzacji.findByPk(
        decoded.id_logowania,
      );
      if (!uzytkownik) {
        throw new AppError("Użytkownik nie istnieje", 401);
      }

      return decoded;
    } catch {
      throw new AppError("Nieprawidłowy token", 401);
    }
  }

  /**
   * Tworzenie nowego konta użytkownika
   */
  async utworzKonto(
    daneKonta: AuthDaneAutoryzacjiCreationAttributes & { haslo: string },
  ): Promise<AuthDaneAutoryzacjiAttributes> {
    const { haslo, ...pozostaleDane } = daneKonta;

    // Sprawdź czy email już istnieje
    const istniejacyUzytkownik = await AuthDaneAutoryzacji.findByEmail(
      pozostaleDane.adres_email,
    );

    if (istniejacyUzytkownik) {
      throw new AppError("Użytkownik z tym adresem email już istnieje", 409);
    }

    // Sprawdź czy id_uzytkownika już istnieje
    if (pozostaleDane.id_uzytkownika) {
      const istniejacyId = await AuthDaneAutoryzacji.findByUserId(
        pozostaleDane.id_uzytkownika,
      );
      if (istniejacyId) {
        throw new AppError("Użytkownik z tym ID już istnieje", 409);
      }
    }

    // Zahashuj hasło
    const hash_hasla = await bcrypt.hash(haslo, 12);

    // Utwórz konto
    const id_logowania = AuthDaneAutoryzacji.generateLoginId(
      pozostaleDane.id_uzytkownika,
    );
    const noweKonto = await AuthDaneAutoryzacji.create({
      id_logowania,
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
    const uzytkownik = await AuthDaneAutoryzacji.findByPk(id_logowania);

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
    const uzytkownik = await AuthDaneAutoryzacji.findByPk(id_logowania);

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
    const uzytkownik = await AuthDaneAutoryzacji.findByPk(id_logowania);

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
  async pobierzWszystkichUzytkownikow(): Promise<
    AuthDaneAutoryzacjiAttributes[]
  > {
    const uzytkownicy = await AuthDaneAutoryzacji.findAll({
      attributes: { exclude: ["hash_hasla"] }, // Nie zwracaj hashy haseł
      order: [["data_utworzenia", "DESC"]],
    });

    return uzytkownicy.map((u) => u.toJSON());
  }

  /**
   * Pobierz użytkownika po ID
   */
  async pobierzUzytkownika(
    id_logowania: string,
  ): Promise<AuthDaneAutoryzacjiAttributes | null> {
    const uzytkownik = await AuthDaneAutoryzacji.findByPk(id_logowania, {
      attributes: { exclude: ["hash_hasla"] },
    });

    return uzytkownik ? uzytkownik.toJSON() : null;
  }

  /**
   * Usuń konto użytkownika
   */
  async usunKonto(id_logowania: string): Promise<void> {
    const uzytkownik = await AuthDaneAutoryzacji.findByPk(id_logowania);

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
      AuthDaneAutoryzacji.count(),
      AuthDaneAutoryzacji.count({ where: { rola_uzytkownika: "admin" } }),
      AuthDaneAutoryzacji.count({ where: { rola_uzytkownika: "staff" } }),
      AuthDaneAutoryzacji.count({ where: { rola_uzytkownika: "supplier" } }),
      AuthDaneAutoryzacji.count({
        where: {
          zablokowane_do: { [Op.gt]: new Date() },
        },
      }),
      AuthDaneAutoryzacji.count({
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
