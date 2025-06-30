import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";

// Interfejs atrybutów modelu
export interface DostNowaDostawaAttributes {
  id_dostawy: string;
  id_dostawcy: string;
  id_pliku: string;
  nazwa_pliku: string;
  url_pliku_S3: string;
  nr_palet_dostawy?: string | null;
  status_weryfikacji:
    | "nowa"
    | "trwa weryfikacja"
    | "zweryfikowano"
    | "raport"
    | "zakończono";
  data_utworzenia: Date;
  data_aktualizacji: Date;
}

// Type alias dla tworzenia nowych rekordów (opcjonalne pola)
export type DostNowaDostawaCreationAttributes = Optional<
  DostNowaDostawaAttributes,
  | "nr_palet_dostawy"
  | "status_weryfikacji"
  | "data_utworzenia"
  | "data_aktualizacji"
>;

// Model Sequelize
export class DostNowaDostawa
  extends Model<DostNowaDostawaAttributes, DostNowaDostawaCreationAttributes>
  implements DostNowaDostawaAttributes
{
  public id_dostawy!: string;
  public id_dostawcy!: string;
  public id_pliku!: string;
  public nazwa_pliku!: string;
  public url_pliku_S3!: string;
  public nr_palet_dostawy!: string | null;
  public status_weryfikacji!:
    | "nowa"
    | "trwa weryfikacja"
    | "zweryfikowano"
    | "raport"
    | "zakończono";

  // Timestamps
  public readonly data_utworzenia!: Date;
  public readonly data_aktualizacji!: Date;

  // Metody pomocnicze
  public static async findByDostawca(
    id_dostawcy: string,
  ): Promise<DostNowaDostawa[]> {
    return this.findAll({
      where: { id_dostawcy },
      order: [["data_utworzenia", "DESC"]],
    });
  }

  public static async findByStatus(
    status: DostNowaDostawaAttributes["status_weryfikacji"],
  ): Promise<DostNowaDostawa[]> {
    return this.findAll({
      where: { status_weryfikacji: status },
      order: [["data_utworzenia", "DESC"]],
    });
  }

  public static async findByIdPliku(
    id_pliku: string,
  ): Promise<DostNowaDostawa | null> {
    return this.findOne({ where: { id_pliku } });
  }

  public static generateIdPliku(
    liczba_plikow: number,
    id_dostawy: string,
  ): string {
    return `PLK/${liczba_plikow.toString().padStart(3, "0")}/${id_dostawy}`;
  }

  public static extractDeliveryNumberFromFilename(
    filename: string,
  ): string | null {
    // Wzorce numerów dostaw w nazwach plików:
    // PL10023609, AM38160, AM38159 itp.
    const patterns = [
      /PL\d{8}/, // PL + 8 cyfr (np. PL10023609)
      /AM\d{5}/, // AM + 5 cyfr (np. AM38160, AM38159)
      /[A-Z]{2}\d{5,8}/, // 2 litery + 5-8 cyfr (ogólny wzorzec)
    ];

    for (const pattern of patterns) {
      const match = filename.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  public static generateDeliveryId(deliveryNumber: string): string {
    return `DST/${deliveryNumber}`;
  }

  public static async createWithGeneratedId(
    data: DostNowaDostawaCreationAttributes & { id_dostawy: string },
  ): Promise<DostNowaDostawa> {
    // Próbuj wyciągnąć numer dostawy z nazwy pliku jeśli nie podano
    if (!data.id_dostawy) {
      const deliveryNumber = this.extractDeliveryNumberFromFilename(
        data.nazwa_pliku,
      );

      if (deliveryNumber) {
        data.id_dostawy = this.generateDeliveryId(deliveryNumber);
      } else {
        throw new Error("Nie można wygenerować ID dostawy z nazwy pliku");
      }
    }

    return this.create(data);
  }

  public updateStatus(
    newStatus: DostNowaDostawaAttributes["status_weryfikacji"],
  ): Promise<DostNowaDostawa> {
    return this.update({ status_weryfikacji: newStatus });
  }
}

// Funkcja inicjalizacji modelu
export const initDostNowaDostawa = () => {
  DostNowaDostawa.init(
    {
      id_dostawy: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        comment:
          "Unikalny numer dostawy wygenerowany z nazwy pliku (np. DST/PL10023609, DST/AM38160)",
      },
      id_dostawcy: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "Identyfikator dostawcy, który przesłał plik",
      },
      id_pliku: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment:
          'Identyfikator wgranego pliku nadawany automatycznie(przedrostekPLK+"/"+liczba plikow w dostawie+id_dostawy) PLK/xxx/xxxxxxxxx',
      },
      nazwa_pliku: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment:
          "Nazwa pliku wgranego pliku (np. Dostawa magazyn Wiktor 16.05.2025r Amazon Basics PL10023609_23669-656.xlsx)",
      },
      url_pliku_S3: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
        comment: "link do miejsca przechowywania pliku w S3",
        field: "url_pliku__s3", // Mapowanie na prawdziwą nazwę kolumny w bazie
      },
      nr_palet_dostawy: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment:
          "Numery palet w dostawie - obsługuje różne formaty: pojedyncze (23669-656), alfanumeryczne (AM38160_90029568233) lub kilka numerów oddzielonych przecinkami/średnikami",
      },
      status_weryfikacji: {
        type: DataTypes.ENUM(
          "nowa",
          "trwa weryfikacja",
          "zweryfikowano",
          "raport",
          "zakończono",
        ),
        allowNull: false,
        defaultValue: "nowa",
        comment: "Aktualny status weryfikacji pliku",
      },
      data_utworzenia: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_utworzenia",
        comment: "Data i czas utworzenia rekordu",
      },
      data_aktualizacji: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_aktualizacji",
        comment: "Data i czas ostatniej aktualizacji rekordu",
      },
    },
    {
      sequelize,
      tableName: "dost_nowa_dostawa",
      timestamps: true,
      createdAt: "data_utworzenia",
      updatedAt: "data_aktualizacji",
      indexes: [
        {
          unique: true,
          fields: ["id_pliku"],
        },

        {
          fields: ["id_dostawcy"],
        },
        {
          fields: ["status_weryfikacji"],
        },
        {
          fields: ["data_utworzenia"],
        },
        {
          fields: ["id_dostawcy", "status_weryfikacji"],
        },
        {
          fields: ["nazwa_pliku"],
        },
      ],
      comment:
        "Tabela głównych dostaw z podstawowymi informacjami o plikach dostawców",
    },
  );
};

export default DostNowaDostawa;
