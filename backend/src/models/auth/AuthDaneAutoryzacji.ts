import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";
import { UserRole } from "../../types/auth.types";

// Interfejs atrybutów modelu
export interface AuthDaneAutoryzacjiAttributes {
  id_logowania: string;
  id_uzytkownika: string;
  adres_email: string;
  hash_hasla: string;
  rola_uzytkownika: UserRole;
  nieudane_proby_logowania: number;
  zablokowane_do?: Date | null;
  ostatnie_logowanie?: Date | null;
  data_utworzenia: Date;
  data_aktualizacji: Date;
}

// Type alias dla tworzenia nowych rekordów (opcjonalne pola)
export type AuthDaneAutoryzacjiCreationAttributes = Optional<
  AuthDaneAutoryzacjiAttributes,
  | "id_logowania"
  | "nieudane_proby_logowania"
  | "zablokowane_do"
  | "ostatnie_logowanie"
  | "data_utworzenia"
  | "data_aktualizacji"
>;

// Model Sequelize
export class AuthDaneAutoryzacji
  extends Model<
    AuthDaneAutoryzacjiAttributes,
    AuthDaneAutoryzacjiCreationAttributes
  >
  implements AuthDaneAutoryzacjiAttributes
{
  public id_logowania!: string;
  public id_uzytkownika!: string;
  public adres_email!: string;
  public hash_hasla!: string;
  public rola_uzytkownika!: UserRole;
  public nieudane_proby_logowania!: number;
  public zablokowane_do!: Date | null;
  public ostatnie_logowanie!: Date | null;

  // Timestamps
  public readonly data_utworzenia!: Date;
  public readonly data_aktualizacji!: Date;

  // Metody pomocnicze
  public static async findByEmail(
    email: string,
  ): Promise<AuthDaneAutoryzacji | null> {
    return this.findOne({ where: { adres_email: email } });
  }

  public static async findByUserId(
    userId: string,
  ): Promise<AuthDaneAutoryzacji | null> {
    return this.findOne({ where: { id_uzytkownika: userId } });
  }

  public static generateLoginId(userId: string): string {
    return `${userId}/LOG`;
  }

  public isAccountLocked(): boolean {
    return this.zablokowane_do ? new Date() < this.zablokowane_do : false;
  }

  public incrementFailedAttempts(): void {
    this.nieudane_proby_logowania += 1;

    // Zablokuj konto po 5 nieudanych próbach na 30 minut
    if (this.nieudane_proby_logowania >= 5) {
      this.zablokowane_do = new Date(Date.now() + 30 * 60 * 1000); // 30 minut
    }
  }

  public resetFailedAttempts(): void {
    this.nieudane_proby_logowania = 0;
    this.zablokowane_do = null;
    this.ostatnie_logowanie = new Date();
  }
}

// Funkcja inicjalizacji modelu (wywoływana z database.ts)
export const initAuthDaneAutoryzacji = () => {
  AuthDaneAutoryzacji.init(
    {
      id_logowania: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false,
        comment:
          "Unikalny identyfikator wpisu logowania (np. ADM/0001/LOG, SUP/0001/LOG).",
      },
      id_uzytkownika: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment:
          "Identyfikator użytkownika z tabeli auth_pracownicy lub auth_dostawcy (np. ADM/0001, STF/0001, SUP/0001).",
      },
      adres_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        comment: "Główny adres email używany do logowania i komunikacji.",
      },
      hash_hasla: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Zahaszowane hasło użytkownika dla bezpieczeństwa.",
      },
      rola_uzytkownika: {
        type: DataTypes.ENUM("admin", "staff", "supplier"),
        allowNull: false,
        comment: "Rola użytkownika w systemie (admin, staff, supplier).",
      },
      nieudane_proby_logowania: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Liczba kolejnych nieudanych prób logowania.",
      },
      zablokowane_do: {
        type: DataTypes.DATE,
        allowNull: true,
        comment:
          "Timestamp, do którego konto jest zablokowane po zbyt wielu nieudanych próbach.",
      },
      ostatnie_logowanie: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Data i czas ostatniego udanego logowania użytkownika.",
      },
      data_utworzenia: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_utworzenia",
        comment: "Data i czas utworzenia rekordu.",
      },
      data_aktualizacji: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_aktualizacji",
        comment: "Data i czas ostatniej aktualizacji rekordu.",
      },
    },
    {
      sequelize,
      tableName: "auth_dane_autoryzacji",
      timestamps: true,
      createdAt: "data_utworzenia",
      updatedAt: "data_aktualizacji",
      indexes: [
        {
          unique: true,
          fields: ["adres_email"],
        },
        {
          unique: true,
          fields: ["id_uzytkownika"],
        },
        {
          fields: ["rola_uzytkownika"],
        },
      ],
      comment:
        "Tabela z danymi autoryzacji i logowania dla wszystkich użytkowników.",
    },
  );
};

export default AuthDaneAutoryzacji;
