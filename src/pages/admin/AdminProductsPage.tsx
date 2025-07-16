import type { FC } from "react";
import { useState } from "react";
import { Button, Pagination, Spinner, TextInput } from "flowbite-react";
import { HiPlus, HiSearch } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/api/productsApi";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";
import { DebugAuthStatus } from "@/components/DebugAuthStatus";
import { ProductsExpandableTable } from "@/components/tables/ProductsExpandableTable";
import { useDebounce } from "@/hooks/useDebounce";

export const AdminProductsPage: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const itemsPerPage = 10;

  const {
    data: productsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", debouncedSearchTerm, currentPage],
    queryFn: () =>
      getProducts({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: debouncedSearchTerm,
      }),
    placeholderData: (previousData) => previousData,
    retry: 1,
  });

  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.paginationInfo;

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
                  setCurrentPage(1);
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

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <ProductsExpandableTable products={products} />
        )}

        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
            <Spinner size="lg" />
          </div>
        )}

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
          {pagination && pagination.totalPages > 1 && (
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
