import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";

// Interfejs atrybutów modelu
export interface DostDostawyProduktyAttributes {
  id_produktu_dostawy: number;
  id_dostawy?: string | null;
  nr_palety?: string | null;
  LPN?: string | null;
  kod_ean?: string | null;
  kod_asin?: string | null;
  nazwa_produktu: string;
  ilosc: number;
  cena_produktu_spec?: number | null;
  stan_produktu?: string | null;
  kraj_pochodzenia?: string | null;
  kategoria_produktu?: string | null;
  status_weryfikacji: "nowy" | "w_trakcie" | "zatwierdzony" | "odrzucony";
  uwagi_weryfikacji?: string | null;
  data_utworzenia: Date;
  data_aktualizacji: Date;
}

// Type alias dla tworzenia nowych rekordów (opcjonalne pola)
export type DostDostawyProduktyCreationAttributes = Optional<
  DostDostawyProduktyAttributes,
  | "id_produktu_dostawy"
  | "id_dostawy"
  | "nr_palety"
  | "LPN"
  | "kod_ean"
  | "kod_asin"
  | "ilosc"
  | "cena_produktu_spec"
  | "stan_produktu"
  | "kraj_pochodzenia"
  | "kategoria_produktu"
  | "status_weryfikacji"
  | "uwagi_weryfikacji"
  | "data_utworzenia"
  | "data_aktualizacji"
>;

// Model Sequelize
export class DostDostawyProdukty
  extends Model<
    DostDostawyProduktyAttributes,
    DostDostawyProduktyCreationAttributes
  >
  implements DostDostawyProduktyAttributes
{
  public id_produktu_dostawy!: number;
  public id_dostawy!: string | null;
  public nr_palety!: string | null;
  public LPN!: string | null;
  public kod_ean!: string | null;
  public kod_asin!: string | null;
  public nazwa_produktu!: string;
  public ilosc!: number;
  public cena_produktu_spec!: number | null;
  public stan_produktu!: string | null;
  public kraj_pochodzenia!: string | null;
  public kategoria_produktu!: string | null;
  public status_weryfikacji!:
    | "nowy"
    | "w_trakcie"
    | "zatwierdzony"
    | "odrzucony";
  public uwagi_weryfikacji!: string | null;

  // Timestamps
  public readonly data_utworzenia!: Date;
  public readonly data_aktualizacji!: Date;

  // Metody pomocnicze
  public static async findByDostawa(
    id_dostawy: string,
  ): Promise<DostDostawyProdukty[]> {
    return this.findAll({
      where: { id_dostawy },
      order: [["data_utworzenia", "ASC"]],
    });
  }

  public static async findByStatus(
    status: DostDostawyProduktyAttributes["status_weryfikacji"],
  ): Promise<DostDostawyProdukty[]> {
    return this.findAll({
      where: { status_weryfikacji: status },
      order: [["data_utworzenia", "DESC"]],
    });
  }

  public static async findByEAN(
    kod_ean: string,
  ): Promise<DostDostawyProdukty[]> {
    return this.findAll({ where: { kod_ean } });
  }

  public static async findByASIN(
    kod_asin: string,
  ): Promise<DostDostawyProdukty[]> {
    return this.findAll({ where: { kod_asin } });
  }

  public static async findByLPN(LPN: string): Promise<DostDostawyProdukty[]> {
    return this.findAll({ where: { LPN } });
  }

  public static async getStatsByDostawa(id_dostawy: string): Promise<{
    total_products: number;
    total_quantity: number;
    by_status: Record<string, number>;
  }> {
    const products = await this.findByDostawa(id_dostawy);

    const stats = {
      total_products: products.length,
      total_quantity: products.reduce((sum, p) => sum + p.ilosc, 0),
      by_status: products.reduce(
        (acc, p) => {
          acc[p.status_weryfikacji] = (acc[p.status_weryfikacji] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };

    return stats;
  }

  public updateStatus(
    newStatus: DostDostawyProduktyAttributes["status_weryfikacji"],
    uwagi?: string,
  ): Promise<DostDostawyProdukty> {
    return this.update({
      status_weryfikacji: newStatus,
      ...(uwagi && { uwagi_weryfikacji: uwagi }),
    });
  }
}

// Funkcja inicjalizacji modelu
export const initDostDostawyProdukty = () => {
  DostDostawyProdukty.init(
    {
      id_produktu_dostawy: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: "Unikalny identyfikator zagregowanego produktu w dostawie",
      },
      id_dostawy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "Identyfikator dostawy, do której należy produkt",
      },
      nr_palety: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment:
          "Nr palety produktu - mapowane z różnych nazw kolumn w plikach dostawców (LPN/lpn/LPN_NUMBER) lub generowane automatycznie",
      },
      LPN: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment:
          "LPN produktu - mapowane z różnych nazw kolumn w plikach dostawców (LPN/lpn/LPN_NUMBER) lub generowane automatycznie",
      },
      kod_ean: {
        type: DataTypes.STRING(13),
        allowNull: true,
        comment:
          "Kod EAN produktu - mapowane z kolumn (EAN/ean/EAN_CODE/Kod EAN)",
      },
      kod_asin: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment:
          "Kod ASIN produktu - mapowane z kolumn (ASIN/asin/ASIN_CODE/Kod ASIN)",
      },
      nazwa_produktu: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment:
          "Nazwa produktu - mapowane z kolumn (Item Desc/Product Name/Nazwa)",
      },
      ilosc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment:
          "Ilość sztuk danego produktu w dostawie - domyślnie 1 jeśli brak kolumny ilość w pliku dostawcy",
      },
      cena_produktu_spec: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment:
          "Cena produktu podana w specyfikacji dostawcy - mapowane z kolumn (Unit Retail/Price/Cena)",
      },
      stan_produktu: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "Stan produktu - mapowane z kolumn (Stan/Condition/State)",
      },
      kraj_pochodzenia: {
        type: DataTypes.STRING(3),
        allowNull: true,
        comment:
          "Kod kraju pochodzenia produktu (ISO 3166-1 alpha-3) - mapowane z kolumn (Kraj/Country/Origin)",
      },
      kategoria_produktu: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment:
          "Kategoria produktu - mapowane z kolumn (DEPARTMENT/Category/Kategoria)",
      },
      status_weryfikacji: {
        type: DataTypes.ENUM("nowy", "w_trakcie", "zatwierdzony", "odrzucony"),
        allowNull: false,
        defaultValue: "nowy",
        comment: "Status weryfikacji produktu w dostawie",
      },
      uwagi_weryfikacji: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Uwagi z procesu weryfikacji produktu",
      },
      data_utworzenia: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_utworzenia",
        comment: "Data utworzenia rekordu",
      },
      data_aktualizacji: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_aktualizacji",
        comment: "Data ostatniej aktualizacji rekordu",
      },
    },
    {
      sequelize,
      tableName: "dost_dostawy_produkty",
      timestamps: true,
      createdAt: "data_utworzenia",
      updatedAt: "data_aktualizacji",
      indexes: [
        {
          fields: ["id_dostawy"],
        },
        {
          fields: ["kod_ean"],
        },
        {
          fields: ["kod_asin"],
        },
        {
          fields: ["status_weryfikacji"],
        },
        {
          fields: ["data_utworzenia"],
        },
        // {
        //   fields: ["LPN"],
        // },
        {
          fields: ["kraj_pochodzenia"],
        },
        {
          fields: ["kategoria_produktu"],
        },
      ],
      comment:
        "Tabela przechowująca produkty w dostawach - elastyczna struktura obsługująca różne formaty plików dostawców",
    },
  );
};

export default DostDostawyProdukty;
