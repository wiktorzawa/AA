import type { FC } from "react";
import { useProducts } from "@/hooks/useProducts";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Badge,
} from "flowbite-react";

const AdminDashboardPage: FC = function () {
  const { data: productsResponse, isLoading, isError } = useProducts();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        Wystąpił błąd podczas ładowania produktów.
      </div>
    );
  }

  const products = productsResponse?.data?.products || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Products
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Browse and filter the product list below.
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Quantity</TableHeadCell>
              <TableHeadCell>Price</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {products.map((product) => (
              <TableRow
                key={product.id}
                className="bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <TableCell className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                  {product.nazwa_produktu}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge color="info">
                    {product.kategoria_produktu || "Brak"}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">{product.ilosc}</TableCell>
                <TableCell className="px-6 py-4">
                  {product.cena_produktu_spec
                    ? `${product.cena_produktu_spec.toFixed(2)} PLN`
                    : "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge color="success">{product.status_weryfikacji}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
