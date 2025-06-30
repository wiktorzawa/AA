import { DataTypes, Model, Optional, Op } from "sequelize";
import { sequelize } from "../../config/database";

// Interfejs atrybutów modelu
export interface DostFakturyDostawcowAttributes {
  id_faktury: number;
  id_dostawcy: string;
  id_dostawy?: string | null;
  numer_faktury: string;
  data_faktury: Date;
  data_platnosci: Date;
  kwota_brutto_razem: number;
  kwota_netto_razem: number;
  waluta: string;
  status_platnosci: "pending" | "paid" | "overdue" | "cancelled";
  data_platnosci_faktycznej?: Date | null;
  data_utworzenia: Date;
  data_aktualizacji: Date;
}

// Type alias dla tworzenia nowych rekordów (opcjonalne pola)
export type DostFakturyDostawcowCreationAttributes = Optional<
  DostFakturyDostawcowAttributes,
  | "id_faktury"
  | "id_dostawy"
  | "waluta"
  | "status_platnosci"
  | "data_platnosci_faktycznej"
  | "data_utworzenia"
  | "data_aktualizacji"
>;

// Model Sequelize
export class DostFakturyDostawcow
  extends Model<
    DostFakturyDostawcowAttributes,
    DostFakturyDostawcowCreationAttributes
  >
  implements DostFakturyDostawcowAttributes
{
  public id_faktury!: number;
  public id_dostawcy!: string;
  public id_dostawy!: string | null;
  public numer_faktury!: string;
  public data_faktury!: Date;
  public data_platnosci!: Date;
  public kwota_brutto_razem!: number;
  public kwota_netto_razem!: number;
  public waluta!: string;
  public status_platnosci!: "pending" | "paid" | "overdue" | "cancelled";
  public data_platnosci_faktycznej!: Date | null;

  // Timestamps
  public readonly data_utworzenia!: Date;
  public readonly data_aktualizacji!: Date;

  // Metody pomocnicze
  public static async findByDostawca(
    id_dostawcy: string,
  ): Promise<DostFakturyDostawcow[]> {
    return this.findAll({
      where: { id_dostawcy },
      order: [["data_faktury", "DESC"]],
    });
  }

  public static async findByDostawa(
    id_dostawy: string,
  ): Promise<DostFakturyDostawcow[]> {
    return this.findAll({
      where: { id_dostawy },
      order: [["data_faktury", "DESC"]],
    });
  }

  public static async findByStatus(
    status: DostFakturyDostawcowAttributes["status_platnosci"],
  ): Promise<DostFakturyDostawcow[]> {
    return this.findAll({
      where: { status_platnosci: status },
      order: [["data_platnosci", "ASC"]],
    });
  }

  public static async findByNumerFaktury(
    numer_faktury: string,
  ): Promise<DostFakturyDostawcow | null> {
    return this.findOne({ where: { numer_faktury } });
  }

  public static async findOverdue(): Promise<DostFakturyDostawcow[]> {
    const today = new Date();
    return this.findAll({
      where: {
        status_platnosci: "pending",
        data_platnosci: { [Op.lt]: today },
      },
      order: [["data_platnosci", "ASC"]],
    });
  }

  public static async getStatsByDostawca(id_dostawcy: string): Promise<{
    total_invoices: number;
    total_amount: number;
    by_status: Record<string, { count: number; amount: number }>;
    overdue_count: number;
  }> {
    const invoices = await this.findByDostawca(id_dostawcy);

    const stats = {
      total_invoices: invoices.length,
      total_amount: invoices.reduce(
        (sum, inv) => sum + Number(inv.kwota_brutto_razem),
        0,
      ),
      by_status: invoices.reduce(
        (acc, inv) => {
          if (!acc[inv.status_platnosci]) {
            acc[inv.status_platnosci] = { count: 0, amount: 0 };
          }
          acc[inv.status_platnosci].count += 1;
          acc[inv.status_platnosci].amount += Number(inv.kwota_brutto_razem);
          return acc;
        },
        {} as Record<string, { count: number; amount: number }>,
      ),
      overdue_count: invoices.filter(
        (inv) =>
          inv.status_platnosci === "pending" && new Date() > inv.data_platnosci,
      ).length,
    };

    return stats;
  }

  public markAsPaid(
    data_platnosci_faktycznej?: Date,
  ): Promise<DostFakturyDostawcow> {
    return this.update({
      status_platnosci: "paid",
      data_platnosci_faktycznej: data_platnosci_faktycznej || new Date(),
    });
  }

  public markAsOverdue(): Promise<DostFakturyDostawcow> {
    return this.update({ status_platnosci: "overdue" });
  }

  public cancel(): Promise<DostFakturyDostawcow> {
    return this.update({ status_platnosci: "cancelled" });
  }

  public isOverdue(): boolean {
    return (
      this.status_platnosci === "pending" && new Date() > this.data_platnosci
    );
  }
}

// Funkcja inicjalizacji modelu
export const initDostFakturyDostawcow = () => {
  DostFakturyDostawcow.init(
    {
      id_faktury: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: "Unikalny identyfikator faktury",
      },
      id_dostawcy: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "Identyfikator dostawcy, który wystawił fakturę",
      },
      id_dostawy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment:
          "Identyfikator dostawy, do której odnosi się faktura (może być NULL)",
      },
      numer_faktury: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: "Numer faktury nadany przez dostawcę",
      },
      data_faktury: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "Data wystawienia faktury",
      },
      data_platnosci: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "Data wymagalności płatności faktury",
      },
      kwota_brutto_razem: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: "Całkowita kwota brutto na fakturze",
      },
      kwota_netto_razem: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: "Całkowita kwota netto na fakturze",
      },
      waluta: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "PLN",
        comment: "Waluta faktury",
      },
      status_platnosci: {
        type: DataTypes.ENUM("pending", "paid", "overdue", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
        comment: "Status płatności faktury",
      },
      data_platnosci_faktycznej: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "Data faktycznej płatności faktury",
      },
      data_utworzenia: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_utworzenia",
        comment: "Data i czas utworzenia rekordu faktury",
      },
      data_aktualizacji: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "data_aktualizacji",
        comment: "Data i czas ostatniej aktualizacji rekordu faktury",
      },
    },
    {
      sequelize,
      tableName: "dost_faktury_dostawcow",
      timestamps: true,
      createdAt: "data_utworzenia",
      updatedAt: "data_aktualizacji",
      indexes: [
        {
          unique: true,
          fields: ["numer_faktury"],
        },
        {
          fields: ["id_dostawcy"],
        },
        {
          fields: ["id_dostawy"],
        },
        {
          fields: ["data_faktury"],
        },
        {
          fields: ["data_platnosci"],
        },
        {
          fields: ["status_platnosci"],
        },
        {
          fields: ["waluta"],
        },
        {
          fields: ["data_utworzenia"],
        },
      ],
      comment:
        "Tabela przechowująca faktury od dostawców z informacjami o płatnościach",
    },
  );
};

export default DostFakturyDostawcow;
