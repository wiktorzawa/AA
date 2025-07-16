import type { FC } from "react";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";
import {
  Alert,
  Button,
  Card,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Checkbox,
} from "flowbite-react";
import { HiExclamationCircle, HiRefresh } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/productsApi";

// Importujemy komponent do debugowania autoryzacji
import { DebugAuthStatus } from "@/components/DebugAuthStatus";

export const AdminTablesPage: FC = () => {
  // Usunięto nieużywane stany: useTestData, currentPage, searchTerm

  // Pobieramy dane produktów z API
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"], // Uproszczony klucz zapytania
    queryFn: () => getProducts({ page: 1, limit: 100 }),
  });

  // Obsługa stanu ładowania
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="w-full">
          <BlockBreadcrumb
            title="Tabela Produktów"
            description="Zaawansowany widok produktów z dostawy"
          />
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Spinner size="xl" />
              <p className="mt-4 text-gray-500">Ładowanie produktów...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mapa produktów jest teraz oparta tylko na danych z API
  const formattedProducts =
    productsData?.data?.products?.map((product) => ({
      id_produktu_dostawy: product.id, // Używamy 'id' z typu Product
      nazwa_produktu: product.nazwa_produktu,
      kategoria: product.kategoria_produktu || "Brak",
      cena_jednostkowa: product.cena_produktu_spec || 0,
      ilosc_w_magazynie: product.ilosc,
      status: product.status_weryfikacji,
      zdjecie_url:
        "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png", // Placeholder
      // Te pola nie istnieją w typie Product, więc je usuwamy lub mapujemy z istniejących
      // brand: "N/A",
      // sales: 0,
      // szczegoly: product.uwagi_weryfikacji || "Brak szczegółów.",
    })) || [];

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="p-4">
      <div className="w-full">
        <BlockBreadcrumb
          title="Tabela Produktów"
          description="Zaawansowany widok produktów z dostawy"
        />

        {/* Dodajemy komponent do debugowania autoryzacji */}
        <DebugAuthStatus />

        {isError && (
          <Alert color="failure" icon={HiExclamationCircle} className="mt-4">
            <div className="flex flex-col">
              <span className="font-medium">
                Błąd podczas pobierania danych!
              </span>
              <span className="text-sm">
                {error instanceof Error
                  ? error.message
                  : "Wystąpił nieoczekiwany błąd"}
              </span>
              <div className="mt-3 flex space-x-4">
                <Button size="xs" color="failure" onClick={handleRefresh}>
                  <HiRefresh className="mr-2 h-4 w-4" />
                  Spróbuj ponownie
                </Button>
              </div>
            </div>
          </Alert>
        )}

        <Card className="mt-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Produkty w dostawach</h3>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableHeadCell className="p-4">
                  <Checkbox />
                </TableHeadCell>
                <TableHeadCell>Nazwa</TableHeadCell>
                <TableHeadCell>Ilość</TableHeadCell>
                <TableHeadCell>Cena</TableHeadCell>
                <TableHeadCell>Sprzedaż</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Akcje</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {formattedProducts.length > 0 ? (
                  formattedProducts.map((product) => (
                    <TableRow
                      key={product.id_produktu_dostawy}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <TableCell className="p-4">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          {product.nazwa_produktu}
                        </div>
                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          {product.kategoria}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-base font-medium text-gray-900 dark:text-white">
                        {product.ilosc_w_magazynie}
                      </TableCell>
                      <TableCell className="p-4 text-base font-medium text-gray-900 dark:text-white">
                        ${product.cena_jednostkowa.toFixed(2)}
                      </TableCell>
                      <TableCell className="p-4 text-base font-medium text-gray-900 dark:text-white">
                        {/* Wartość sprzedaży - do wdrożenia */}
                        {/* product.sales */}
                      </TableCell>
                      <TableCell className="p-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            product.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="p-4">
                        <Button color="primary" size="sm">
                          Edytuj
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center">
                      <p className="text-gray-500">
                        Brak produktów do wyświetlenia
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminTablesPage;
