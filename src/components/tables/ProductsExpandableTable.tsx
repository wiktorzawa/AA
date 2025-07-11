import {
  Badge,
  Checkbox,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import type { FC } from "react";
import React, { useState } from "react";
import type { Product } from "@/types/product.types";

interface ProductsExpandableTableProps {
  products: Product[];
}

export const ProductsExpandableTable: FC<ProductsExpandableTableProps> = ({
  products,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Sprawdź, czy jakikolwiek produkt ma zdefiniowany stan_produktu
  const showStatusColumn = products.some(
    (product) =>
      product.stan_produktu !== undefined && product.stan_produktu !== null,
  );

  const toggleRow = (id: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatusBadgeColor = (
    status: "nowy" | "w_trakcie" | "zatwierdzony" | "odrzucony" | undefined,
  ) => {
    switch (status) {
      case "zatwierdzony":
        return "success";
      case "w_trakcie":
        return "warning";
      case "nowy":
        return "info";
      case "odrzucony":
        return "failure";
      default:
        return "gray";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
        <TableHead className="bg-gray-50 text-xs uppercase dark:bg-gray-700">
          <TableRow>
            <TableHeadCell scope="col" className="p-4">
              <div className="flex items-center">
                <Checkbox id="checkbox-all" name="checkbox-all" />
                <Label htmlFor="checkbox-all" className="sr-only">
                  Zaznacz wszystko
                </Label>
              </div>
            </TableHeadCell>
            <TableHeadCell scope="col" className="px-4 py-3">
              <span className="sr-only">Rozwiń</span>
            </TableHeadCell>
            <TableHeadCell scope="col" className="max-w-sm px-4 py-3">
              nazwa_produktu
            </TableHeadCell>
            <TableHeadCell scope="col" className="min-w-32 px-4 py-3">
              kategoria
            </TableHeadCell>
            <TableHeadCell scope="col" className="min-w-24 px-4 py-3">
              ilosc
            </TableHeadCell>
            <TableHeadCell scope="col" className="min-w-24 px-4 py-3">
              cena
            </TableHeadCell>
            {showStatusColumn && (
              <TableHeadCell scope="col" className="min-w-24 px-4 py-3">
                stan_produktu
              </TableHeadCell>
            )}
            <TableHeadCell scope="col" className="min-w-32 px-4 py-3">
              status
            </TableHeadCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product) => (
            <React.Fragment key={product.id}>
              <TableRow
                className="cursor-pointer border-b transition hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                onClick={() => toggleRow(product.id)}
              >
                <TableCell className="w-4 px-4 py-3">
                  <div className="flex items-center">
                    <Checkbox
                      id={`checkbox-${product.id}`}
                      name={`checkbox-${product.id}`}
                      onClick={(event) => event.stopPropagation()}
                    />
                    <Label
                      htmlFor={`checkbox-${product.id}`}
                      className="sr-only"
                    >
                      Zaznacz produkt
                    </Label>
                  </div>
                </TableCell>
                <TableCell className="w-4 p-3">
                  <svg
                    className={`h-6 w-6 shrink-0 transition-transform ${
                      expandedRows.has(product.id) ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </TableCell>
                <TableCell
                  scope="row"
                  className="flex items-center px-4 py-3 font-medium text-gray-900 dark:text-white"
                >
                  <img
                    src={
                      "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png"
                    }
                    alt={product.nazwa_produktu}
                    className="mr-3 h-8 w-auto"
                  />
                  {product.nazwa_produktu}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {product.kategoria_produktu || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {product.ilosc}
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {product.cena_produktu_spec
                    ? `${product.cena_produktu_spec.toFixed(2)} PLN`
                    : "N/A"}
                </TableCell>
                {showStatusColumn && (
                  <TableCell className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {product.stan_produktu || "N/A"}
                  </TableCell>
                )}
                <TableCell className="px-4 py-3">
                  <Badge
                    color={getStatusBadgeColor(product.status_weryfikacji)}
                    className="w-fit"
                  >
                    {product.status_weryfikacji || "brak"}
                  </Badge>
                </TableCell>
              </TableRow>
              {expandedRows.has(product.id) && (
                <TableRow>
                  <TableCell
                    className="border-b p-4 dark:border-gray-700"
                    colSpan={showStatusColumn ? 8 : 7}
                  >
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <h6 className="font-semibold dark:text-white">
                          Delivery ID:
                        </h6>
                        <p>{product.delivery?.id || "N/A"}</p>
                      </div>
                      <div>
                        <h6 className="font-semibold dark:text-white">
                          Palette ID:
                        </h6>
                        <p>{product.palette?.id || "N/A"}</p>
                      </div>
                      <div>
                        <h6 className="font-semibold dark:text-white">LPN:</h6>
                        <p>{product.lpn || "N/A"}</p>
                      </div>
                      <div>
                        <h6 className="font-semibold dark:text-white">EAN:</h6>
                        <p>{product.kod_ean || "N/A"}</p>
                      </div>
                      <div>
                        <h6 className="font-semibold dark:text-white">ASIN:</h6>
                        <p>{product.kod_asin || "N/A"}</p>
                      </div>
                      <div>
                        <h6 className="font-semibold dark:text-white">
                          Country:
                        </h6>
                        <p>{product.kraj_pochodzenia || "N/A"}</p>
                      </div>
                      <div>
                        <h6 className="font-semibold dark:text-white">
                          Created:
                        </h6>
                        <p>{new Date(product.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <h6 className="font-semibold dark:text-white">
                          Updated:
                        </h6>
                        <p>{new Date(product.updatedAt).toLocaleString()}</p>
                      </div>
                      <div className="col-span-4">
                        <h6 className="font-semibold dark:text-white">
                          Verification Notes:
                        </h6>
                        <p>{product.uwagi_weryfikacji || "Brak uwag"}</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
