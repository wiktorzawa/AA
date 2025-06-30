import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";

// Interfejs atrybutów modelu
export interface AuthDostawcyAttributes {
  id_dostawcy: string;
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
  data_utworzenia: Date;
  data_aktualizacji: Date;
}

// Typ dla tworzenia nowych rekordów (opcjonalne pola)
export type AuthDostawcyCreationAttributes = Optional<
  AuthDostawcyAttributes,
  | "id_dostawcy"
  | "strona_www"
  | "adres_numer_lokalu"
  | "data_utworzenia"
  | "data_aktualizacji"
>;

// Model Sequelize
export class AuthDostawcy
  extends Model<AuthDostawcyAttributes, AuthDostawcyCreationAttributes>
  implements AuthDostawcyAttributes
{
  public id_dostawcy!: string;
  public nazwa_firmy!: string;
  public imie_kontaktu!: string;
  public nazwisko_kontaktu!: string;
  public numer_nip!: string;
  public adres_email!: string;
  public telefon!: string;
  public strona_www!: string | null;
  public adres_ulica!: string;
  public adres_numer_budynku!: string;
  public adres_numer_lokalu!: string | null;
  public adres_miasto!: string;
  public adres_kod_pocztowy!: string;
  public adres_kraj!: string;

  // Timestamps
  public readonly data_utworzenia!: Date;
  public readonly data_aktualizacji!: Date;

  // Metody pomocnicze
  public static async findByNip(nip: string): Promise<AuthDostawcy | null> {
    return this.findOne({ where: { numer_nip: nip } });
  }

  public static async findByEmail(email: string): Promise<AuthDostawcy | null> {
    return this.findOne({ where: { adres_email: email } });
  }

  public get pelnyAdres(): string {
    const numer = this.adres_numer_lokalu
      ? `${this.adres_numer_budynku}/${this.adres_numer_lokalu}`
      : this.adres_numer_budynku;

    return `${this.adres_ulica} ${numer}, ${this.adres_kod_pocztowy} ${this.adres_miasto}, ${this.adres_kraj}`;
  }

  public get kontaktPelneImie(): string {
    return `${this.imie_kontaktu} ${this.nazwisko_kontaktu}`;
  }

  public static async generateUniqueId(): Promise<string> {
    // Pobierz aktualną liczbę rekordów w tabeli
    const count = await this.count();
    // Następny numer to count + 1 (bo count zaczyna od 0)
    const nextNumber = count + 1;
    // Formatuj jako 5-cyfrowy kod z zerami wiodącymi (zgodnie z istniejącymi danymi)
    const formattedNumber = nextNumber.toString().padStart(5, "0");

    return `SUP/${formattedNumber}`;
  }

  public static validateNip(nip: string): boolean {
    // Podstawowa walidacja NIP (10 cyfr)
    const nipRegex = /^\d{10}$/;
    return nipRegex.test(nip.replace(/[-\s]/g, ""));
  }
}

// Funkcja inicjalizacji modelu
export const initAuthDostawcy = () => {
  AuthDostawcy.init(
    {
      id_dostawcy: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: "Unikalny identyfikator dostawcy (np. SUP/00001).",
      },
      nazwa_firmy: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [2, 255],
          notEmpty: true,
        },
        comment: "Pełna nazwa firmy dostawcy.",
      },
      imie_kontaktu: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
          notEmpty: true,
        },
        comment: "Imię osoby kontaktowej u dostawcy.",
      },
      nazwisko_kontaktu: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
          notEmpty: true,
        },
        comment: "Nazwisko osoby kontaktowej u dostawcy.",
      },
      numer_nip: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          isValidNip(value: string) {
            if (!AuthDostawcy.validateNip(value)) {
              throw new Error("Nieprawidłowy format numeru NIP");
            }
          },
        },
        comment: "Numer NIP firmy dostawcy.",
      },
      adres_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        comment: "Adres email firmy dostawcy.",
      },
      telefon: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          is: /^[+]?[0-9\s\-()]+$/i,
        },
        comment: "Numer telefonu firmy dostawcy.",
      },
      strona_www: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isUrl: true,
        },
        comment: "Adres strony internetowej firmy dostawcy.",
      },
      adres_ulica: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [2, 100],
          notEmpty: true,
        },
        comment: "Ulica adresu firmy.",
      },
      adres_numer_budynku: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          len: [1, 10],
          notEmpty: true,
        },
        comment: "Numer budynku adresu firmy.",
      },
      adres_numer_lokalu: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: "Numer lokalu adresu firmy (opcjonalnie).",
      },
      adres_miasto: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [2, 100],
          notEmpty: true,
        },
        comment: "Miejscowość adresu firmy.",
      },
      adres_kod_pocztowy: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          is: /^\d{2}-\d{3}$/i, // Format XX-XXX dla Polski
        },
        comment: "Kod pocztowy adresu firmy.",
      },
      adres_kraj: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "Polska",
        validate: {
          len: [2, 50],
          notEmpty: true,
        },
        comment: "Kraj adresu firmy.",
      },
      data_utworzenia: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_utworzenia",
        comment: "Data i czas utworzenia rekordu dostawcy.",
      },
      data_aktualizacji: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_aktualizacji",
        comment: "Data i czas ostatniej aktualizacji rekordu dostawcy.",
      },
    },
    {
      sequelize,
      tableName: "auth_dostawcy",
      timestamps: true,
      createdAt: "data_utworzenia",
      updatedAt: "data_aktualizacji",
      // ❌ USUNIĘTE HOOKS - teraz zarządza AuthService
      indexes: [
        {
          unique: true,
          fields: ["numer_nip"],
        },
        {
          unique: true,
          fields: ["adres_email"],
        },
        {
          fields: ["nazwa_firmy"],
        },
        {
          fields: ["adres_miasto"],
        },
      ],
      comment: "Tabela z danymi firm dostawców.",
    },
  );
};

export default AuthDostawcy;
