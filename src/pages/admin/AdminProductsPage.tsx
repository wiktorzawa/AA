import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { HiPlus, HiSearch } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/productsApi";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";
import { DebugAuthStatus } from "@/components/DebugAuthStatus";

// Interface dla produktu z API dostawy (format polski)
interface DeliveryProductDisplay {
  id?: string;
  nazwa_produktu?: string;
  kategoria_produktu?: string;
  cena_produktu_spec?: number;
  ilosc?: number;
}

// Custom hook for debouncing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export const AdminProductsPage: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms opóźnienia

  const {
    data: productsData,
    isLoading,
    isFetching, // Używamy isFetching do pokazywania spinnera przy każdej zmianie
    isError,
    error,
  } = useQuery({
    queryKey: ["products", debouncedSearchTerm, currentPage],
    queryFn: getProducts,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });

  const products = productsData?.products || [];
  const pagination = productsData?.pagination;

  if (isError) {
    return (
      <div className="p-4">
        <BlockBreadcrumb
          title="Zarządzanie Produktami"
          description="Wystąpił błąd podczas ładowania danych."
        />
        <div className="mt-10 text-center text-red-500">
          <p>Błąd: {error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <BlockBreadcrumb
        title="Zarządzanie Produktami"
        description="Przeglądaj, filtruj i zarządzaj wszystkimi produktami w systemie."
      />
      <DebugAuthStatus />
      <div className="relative mt-6 overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
        <div className="flex flex-col space-y-3 p-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative w-full">
              <HiSearch className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <TextInput
                placeholder="Szukaj produktów..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Resetuj do pierwszej strony przy nowym wyszukiwaniu
                }}
              />
            </div>
          </div>
          <div className="flex shrink-0 flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3 lg:justify-end">
            <Button>
              <HiPlus className="mr-2 h-4 w-4" />
              Dodaj nowy produkt
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="xl" />
            </div>
          ) : (
            <Table hoverable>
              <TableHead>
                <TableHeadCell>Nazwa Produktu</TableHeadCell>
                <TableHeadCell>Kategoria</TableHeadCell>
                <TableHeadCell>Cena</TableHeadCell>
                <TableHeadCell>Ilość</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {products.map(
                  (product: DeliveryProductDisplay, index: number) => (
                    <TableRow
                      key={product.id || index}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                        {product.nazwa_produktu || "Brak nazwy"}
                      </TableCell>
                      <TableCell>
                        {product.kategoria_produktu || "Brak kategorii"}
                      </TableCell>
                      <TableCell>
                        {product.cena_produktu_spec
                          ? `${product.cena_produktu_spec.toFixed(2)} zł`
                          : "Brak ceny"}
                      </TableCell>
                      <TableCell>{product.ilosc || 0}</TableCell>
                      <TableCell>
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-300">
                          Dostępny
                        </span>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          )}
          {isFetching && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
              <Spinner size="lg" />
            </div>
          )}
        </div>

        <nav
          className="flex flex-col items-start justify-between space-y-3 p-4 md:flex-row md:items-center md:space-y-0"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Wyświetlono&nbsp;
            <span className="font-semibold text-gray-900 dark:text-white">
              {products.length}
            </span>
            &nbsp;z&nbsp;
            <span className="font-semibold text-gray-900 dark:text-white">
              {pagination?.totalItems || 0}
            </span>
          </span>
          {pagination?.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={pagination.totalPages}
              showIcons
            />
          )}
        </nav>
      </div>
    </div>
  );
};
