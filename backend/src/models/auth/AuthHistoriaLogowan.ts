import { DataTypes, Model, Optional, Op } from "sequelize";
import { sequelize } from "../../config/database";

// Interfejs dla atrybutów modelu
export interface AuthHistoriaLogowanAttributes {
  id_wpisu: number;
  id_logowania: string;
  data_proby_logowania: Date;
  status_logowania: "success" | "failed";
  poczatek_sesji?: Date | null;
  koniec_sesji?: Date | null;
}

// Typ dla tworzenia nowego wpisu (bez id_wpisu - auto increment)
export type AuthHistoriaLogowanCreationAttributes = Optional<
  AuthHistoriaLogowanAttributes,
  "id_wpisu" | "poczatek_sesji" | "koniec_sesji"
>;

// Klasa modelu
export class AuthHistoriaLogowan
  extends Model<
    AuthHistoriaLogowanAttributes,
    AuthHistoriaLogowanCreationAttributes
  >
  implements AuthHistoriaLogowanAttributes
{
  public id_wpisu!: number;
  public id_logowania!: string;
  public data_proby_logowania!: Date;
  public status_logowania!: "success" | "failed";
  public poczatek_sesji!: Date | null;
  public koniec_sesji!: Date | null;

  // Timestamps (jeśli potrzebne)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Metoda do logowania udanej próby logowania
   */
  public static async logujUdaneLogowanie(
    id_logowania: string,
    poczatek_sesji?: Date,
  ): Promise<AuthHistoriaLogowan> {
    return await this.create({
      id_logowania,
      data_proby_logowania: new Date(),
      status_logowania: "success",
      poczatek_sesji: poczatek_sesji || new Date(),
    });
  }

  /**
   * Metoda do logowania nieudanej próby logowania
   */
  public static async logujNieudaneLogowanie(
    id_logowania: string,
  ): Promise<AuthHistoriaLogowan> {
    return await this.create({
      id_logowania,
      data_proby_logowania: new Date(),
      status_logowania: "failed",
    });
  }

  /**
   * Metoda do zakończenia sesji
   */
  public async zakonczSesje(): Promise<void> {
    this.koniec_sesji = new Date();
    await this.save();
  }

  /**
   * Pobiera historię logowań dla konkretnego użytkownika
   */
  public static async pobierzHistorieUzytkownika(
    id_logowania: string,
    limit: number = 50,
  ): Promise<AuthHistoriaLogowan[]> {
    return await this.findAll({
      where: { id_logowania },
      order: [["data_proby_logowania", "DESC"]],
      limit,
    });
  }

  /**
   * Pobiera ostatnie udane logowanie użytkownika
   */
  public static async pobierzOstatnieUdaneLogowanie(
    id_logowania: string,
  ): Promise<AuthHistoriaLogowan | null> {
    return await this.findOne({
      where: {
        id_logowania,
        status_logowania: "success",
      },
      order: [["data_proby_logowania", "DESC"]],
    });
  }

  /**
   * Zlicza nieudane próby logowania od określonej daty
   */
  public static async zliczNieudaneProbyOdDaty(
    id_logowania: string,
    od_daty: Date,
  ): Promise<number> {
    return await this.count({
      where: {
        id_logowania,
        status_logowania: "failed",
        data_proby_logowania: {
          [Op.gte]: od_daty,
        },
      },
    });
  }

  /**
   * Automatycznie zamyka stare sesje (starsze niż podana liczba minut)
   */
  public static async zamknijWygasleSesjе(
    minuty: number = 30,
  ): Promise<number> {
    const dataGraniczna = new Date();
    dataGraniczna.setMinutes(dataGraniczna.getMinutes() - minuty);

    // Znajdź wszystkie otwarte sesje starsze niż określony czas
    const wygasleSesjе = await this.findAll({
      where: {
        status_logowania: "success",
        koniec_sesji: null,
        poczatek_sesji: {
          [Op.lt]: dataGraniczna,
        },
      },
    });

    // Zamknij każdą sesję
    let zamknieteSesjе = 0;
    for (const sesja of wygasleSesjе) {
      await sesja.zakonczSesje();
      zamknieteSesjе++;
    }

    return zamknieteSesjе;
  }

  /**
   * Czyści starą historię (starszą niż podana liczba dni)
   */
  public static async wyczyscStaraHistorie(dni: number = 90): Promise<number> {
    const dataGraniczna = new Date();
    dataGraniczna.setDate(dataGraniczna.getDate() - dni);

    const result = await this.destroy({
      where: {
        data_proby_logowania: {
          [Op.lt]: dataGraniczna,
        },
      },
    });

    return result;
  }
}

// Funkcja inicjalizacji modelu
export const initAuthHistoriaLogowan = () => {
  AuthHistoriaLogowan.init(
    {
      id_wpisu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: "Unikalny identyfikator wpisu w historii logowań",
      },
      id_logowania: {
        type: DataTypes.STRING(25), // Zwiększone do 25 znaków
        allowNull: false,
        comment:
          "Identyfikator logowania użytkownika (powiązanie z auth_dane_autoryzacji)",
      },
      data_proby_logowania: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "Data i czas próby logowania",
      },
      status_logowania: {
        type: DataTypes.ENUM("success", "failed"),
        allowNull: false,
        comment: "Status próby logowania (success/failed)",
      },
      poczatek_sesji: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Data i czas rozpoczęcia sesji (tylko dla udanych logowań)",
      },
      koniec_sesji: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Data i czas zakończenia sesji",
      },
    },
    {
      sequelize,
      modelName: "AuthHistoriaLogowan",
      tableName: "auth_historia_logowan",
      timestamps: false, // Używamy własnych pól czasowych
      comment: "Historia logowań użytkowników",
      indexes: [
        {
          name: "user_login",
          fields: ["id_logowania"],
        },
        {
          name: "idx_data_proby",
          fields: ["data_proby_logowania"],
        },
        {
          name: "idx_status_data",
          fields: ["status_logowania", "data_proby_logowania"],
        },
      ],
    },
  );
};

export default AuthHistoriaLogowan;
