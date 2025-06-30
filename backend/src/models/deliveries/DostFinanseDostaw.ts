import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database";

// Interfejs atrybutów modelu
export interface DostFinanseDostawAttributes {
  id_finanse_dostawy: number;
  id_dostawy: string;
  suma_produktow: number;
  wartosc_produktow_spec: number;
  stawka_vat: number;
  procent_wartosci: number;
  wartosc_brutto: number;
  koszt_pln_brutto: number;
  koszt_pln_netto: number;
  waluta: string;
  kurs_wymiany?: number | null;
  data_utworzenia: Date;
  data_aktualizacji: Date;
}

// Type alias dla tworzenia nowych rekordów (opcjonalne pola)
export type DostFinanseDostawCreationAttributes = Optional<
  DostFinanseDostawAttributes,
  | "id_finanse_dostawy"
  | "stawka_vat"
  | "waluta"
  | "kurs_wymiany"
  | "data_utworzenia"
  | "data_aktualizacji"
>;

// Model Sequelize
export class DostFinanseDostaw
  extends Model<
    DostFinanseDostawAttributes,
    DostFinanseDostawCreationAttributes
  >
  implements DostFinanseDostawAttributes
{
  public id_finanse_dostawy!: number;
  public id_dostawy!: string;
  public suma_produktow!: number;
  public wartosc_produktow_spec!: number;
  public stawka_vat!: number;
  public procent_wartosci!: number;
  public wartosc_brutto!: number;
  public koszt_pln_brutto!: number;
  public koszt_pln_netto!: number;
  public waluta!: string;
  public kurs_wymiany!: number | null;

  // Timestamps
  public readonly data_utworzenia!: Date;
  public readonly data_aktualizacji!: Date;

  // Metody pomocnicze
  public static async findByDostawa(
    id_dostawy: string,
  ): Promise<DostFinanseDostaw | null> {
    return this.findOne({ where: { id_dostawy } });
  }

  public static async findByWaluta(
    waluta: string,
  ): Promise<DostFinanseDostaw[]> {
    return this.findAll({
      where: { waluta },
      order: [["data_utworzenia", "DESC"]],
    });
  }

  public static async getFinancialSummary(): Promise<{
    total_deliveries: number;
    total_products: number;
    total_value_pln: number;
    total_cost_pln: number;
    by_currency: Record<string, { count: number; total_value: number }>;
    average_margin: number;
  }> {
    const finances = await this.findAll();

    const summary = {
      total_deliveries: finances.length,
      total_products: finances.reduce((sum, f) => sum + f.suma_produktow, 0),
      total_value_pln: finances.reduce(
        (sum, f) => sum + Number(f.wartosc_brutto),
        0,
      ),
      total_cost_pln: finances.reduce(
        (sum, f) => sum + Number(f.koszt_pln_brutto),
        0,
      ),
      by_currency: finances.reduce(
        (acc, f) => {
          if (!acc[f.waluta]) {
            acc[f.waluta] = { count: 0, total_value: 0 };
          }
          acc[f.waluta].count += 1;
          acc[f.waluta].total_value += Number(f.wartosc_produktow_spec);
          return acc;
        },
        {} as Record<string, { count: number; total_value: number }>,
      ),
      average_margin: 0,
    };

    // Oblicz średnią marżę
    if (summary.total_value_pln > 0) {
      summary.average_margin =
        ((summary.total_value_pln - summary.total_cost_pln) /
          summary.total_value_pln) *
        100;
    }

    return summary;
  }

  public static calculateFinances(
    suma_produktow: number,
    wartosc_produktow_spec: number,
    procent_wartosci: number,
    kurs_wymiany: number = 1,
    stawka_vat: number = 0.23,
  ): {
    wartosc_brutto: number;
    koszt_pln_netto: number;
    koszt_pln_brutto: number;
  } {
    const koszt_pln_netto =
      wartosc_produktow_spec * kurs_wymiany * procent_wartosci;
    const koszt_pln_brutto = koszt_pln_netto * (1 + stawka_vat);
    const wartosc_brutto =
      wartosc_produktow_spec * kurs_wymiany * (1 + stawka_vat);

    return {
      wartosc_brutto: Number(wartosc_brutto.toFixed(2)),
      koszt_pln_netto: Number(koszt_pln_netto.toFixed(2)),
      koszt_pln_brutto: Number(koszt_pln_brutto.toFixed(2)),
    };
  }

  public updateKursWymiany(nowy_kurs: number): Promise<DostFinanseDostaw> {
    const recalculated = DostFinanseDostaw.calculateFinances(
      this.suma_produktow,
      this.wartosc_produktow_spec,
      this.procent_wartosci,
      nowy_kurs,
      this.stawka_vat,
    );

    return this.update({
      kurs_wymiany: nowy_kurs,
      ...recalculated,
    });
  }

  public getMargin(): number {
    if (this.wartosc_brutto === 0) return 0;
    return (
      ((this.wartosc_brutto - this.koszt_pln_brutto) / this.wartosc_brutto) *
      100
    );
  }

  public getProfitPLN(): number {
    return this.wartosc_brutto - this.koszt_pln_brutto;
  }
}

// Funkcja inicjalizacji modelu
export const initDostFinanseDostaw = () => {
  DostFinanseDostaw.init(
    {
      id_finanse_dostawy: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: "Unikalny identyfikator rekordu finansowego dostawy",
      },
      id_dostawy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "Identyfikator dostawy, której dotyczą dane finansowe",
      },
      suma_produktow: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Łączna liczba wszystkich produktów w dostawie (suma ilości)",
      },
      wartosc_produktow_spec: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "Łączna wartość wszystkich produktów w dostawie",
      },
      stawka_vat: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
        defaultValue: 0.23,
        comment: "Stawka VAT użyta do obliczeń (np. 0.23 dla 23%)",
      },
      procent_wartosci: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
        comment:
          "Procentowa wartość ceny dostawcy, jaką płacimy (np. 0.1800 dla 18%)",
      },
      wartosc_brutto: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "Łączna wartość brutto wszystkich produktów w dostawie",
      },
      koszt_pln_brutto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment:
          "Koszta zakupu brutto w PLN: (wartosc_produktow_spec * kurs_wymiany_eur_pln * procent_wartosci) * (1 + stawka_vat)",
      },
      koszt_pln_netto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment:
          "Koszta zakupu netto w PLN: (wartosc_produktow_spec * kurs_wymiany_eur_pln * procent_wartosci)",
      },
      waluta: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "EUR",
        comment: "Waluta, w której podana jest cena_produktu_spec",
      },
      kurs_wymiany: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: true,
        comment: "Kurs wymiany waluty dostawy na PLN",
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
      tableName: "dost_finanse_dostaw",
      timestamps: true,
      createdAt: "data_utworzenia",
      updatedAt: "data_aktualizacji",
      indexes: [
        {
          fields: ["id_dostawy"],
        },
        {
          fields: ["waluta"],
        },
        {
          fields: ["data_utworzenia"],
        },
        {
          fields: ["stawka_vat"],
        },
      ],
      comment: "Tabela z danymi finansowymi dostaw - kalkulacje kosztów i marż",
    },
  );
};

export default DostFinanseDostaw;
