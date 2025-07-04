import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { USER_ROLES, ID_PREFIXES } from "../../constants";

// Interfejs atrybutów modelu
export interface AuthPracownicyAttributes {
  id_pracownika: string;
  imie: string;
  nazwisko: string;
  rola: typeof USER_ROLES.ADMIN | typeof USER_ROLES.STAFF;
  adres_email: string;
  telefon?: string | null;
  data_utworzenia: Date;
  data_aktualizacji: Date;
}

// Typ dla tworzenia nowych rekordów (opcjonalne pola)
export type AuthPracownicyCreationAttributes = Optional<
  AuthPracownicyAttributes,
  "id_pracownika" | "telefon" | "data_utworzenia" | "data_aktualizacji"
>;

// Model Sequelize
export class AuthPracownicy
  extends Model<AuthPracownicyAttributes, AuthPracownicyCreationAttributes>
  implements AuthPracownicyAttributes
{
  public id_pracownika!: string;
  public imie!: string;
  public nazwisko!: string;
  public rola!: typeof USER_ROLES.ADMIN | typeof USER_ROLES.STAFF;
  public adres_email!: string;
  public telefon!: string | null;

  // Timestamps
  public readonly data_utworzenia!: Date;
  public readonly data_aktualizacji!: Date;

  // Metody pomocnicze
  public static async findByName(
    imie: string,
    nazwisko: string,
  ): Promise<AuthPracownicy | null> {
    return this.findOne({
      where: {
        imie: imie,
        nazwisko: nazwisko,
      },
    });
  }

  public static async findByEmail(
    email: string,
  ): Promise<AuthPracownicy | null> {
    return this.findOne({ where: { adres_email: email } });
  }

  public get pelneImie(): string {
    return `${this.imie} ${this.nazwisko}`;
  }

  public static async generateUniqueId(
    rola: typeof USER_ROLES.ADMIN | typeof USER_ROLES.STAFF,
  ): Promise<string> {
    // Pobierz liczbę rekordów dla danej roli
    const count = await this.count({ where: { rola } });
    // Następny numer to count + 1
    const nextNumber = count + 1;
    // Formatuj jako 5-cyfrowy kod z zerami wiodącymi (zgodnie z istniejącymi danymi)
    const formattedNumber = nextNumber.toString().padStart(5, "0");

    // Określ prefix na podstawie roli
    const prefix =
      rola === USER_ROLES.ADMIN ? ID_PREFIXES.ADMIN : ID_PREFIXES.STAFF;

    return `${prefix}/${formattedNumber}`;
  }
}

// Funkcja inicjalizacji modelu
export const initAuthPracownicy = () => {
  AuthPracownicy.init(
    {
      id_pracownika: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: "Unikalny identyfikator pracownika (np. STF/0001, ADM/0001).",
      },
      imie: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
          notEmpty: true,
        },
        comment: "Imię pracownika.",
      },
      nazwisko: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
          notEmpty: true,
        },
        comment: "Nazwisko pracownika.",
      },
      rola: {
        type: DataTypes.ENUM(USER_ROLES.ADMIN, USER_ROLES.STAFF),
        allowNull: false,
        comment: "Rola pracownika w systemie (admin lub staff).",
      },
      adres_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        comment: "Adres email pracownika.",
      },
      telefon: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: /^[+]?[0-9\s\-()]+$/i,
        },
        comment: "Numer telefonu pracownika.",
      },
      data_utworzenia: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_utworzenia",
        comment: "Data i czas utworzenia rekordu pracownika.",
      },
      data_aktualizacji: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_aktualizacji",
        comment: "Data i czas ostatniej aktualizacji rekordu pracownika.",
      },
    },
    {
      sequelize,
      tableName: "auth_pracownicy",
      timestamps: true,
      createdAt: "data_utworzenia",
      updatedAt: "data_aktualizacji",
      indexes: [
        {
          unique: true,
          fields: ["adres_email"],
        },
        {
          fields: ["imie", "nazwisko"],
        },
        {
          fields: ["rola"],
        },
        {
          fields: ["telefon"],
        },
      ],
      comment: "Tabela z danymi pracowników i administratorów.",
    },
  );
};

export default AuthPracownicy;
