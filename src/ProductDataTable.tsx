import type { FC } from "react";
import { Card } from "flowbite-react";
import type { PreviewProduct } from "./types/api.types";
import { DataTable, type ColumnDef } from "./components/flowbite-pro/DataTable";

interface ProductDataTableProps {
  products: PreviewProduct[];
}

const columns: ColumnDef<PreviewProduct>[] = [
  { header: "Numer Palety", accessorKey: "nr_palety", enableSorting: true },
  { header: "LPN", accessorKey: "lpn", enableSorting: true },
  { header: "ASIN", accessorKey: "kod_asin", enableSorting: true },
  { header: "EAN", accessorKey: "kod_ean", enableSorting: true },
  {
    header: "Nazwa Produktu",
    accessorKey: "nazwa_produktu",
    enableSorting: true,
  },
  { header: "Ilość", accessorKey: "ilosc", enableSorting: true },
  { header: "Cena", accessorKey: "cena_produktu_spec", enableSorting: true },
  { header: "Stan", accessorKey: "stan_produktu", enableSorting: true },
];

export const ProductDataTable: FC<ProductDataTableProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Brak danych produktów do wyświetlenia.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="mb-4 text-xl font-semibold dark:text-white">
        Podgląd Produktów w Dostawie
      </h3>
      <DataTable columns={columns} data={products} searchable />
    </Card>
  );
};
