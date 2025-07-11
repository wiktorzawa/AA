import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";
import { ProductsExpandableTable } from "@/components/tables/ProductsExpandableTable";
import { getProducts } from "@/api/productsApi";
import { logger } from "@/utils/logger";

export const ProductsListPage: FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", "", 1],
    queryFn: () => getProducts({ page: 1, limit: 100 }),
  });

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <Spinner size="xl" />
        <p className="mt-2">Ładowanie produktów...</p>
      </div>
    );
  }

  if (isError) {
    logger.error("Błąd renderowania ProductsListPage:", { error });
    return (
      <div className="p-4 text-center text-red-500">
        <p className="font-bold">Wystąpił błąd</p>
        <p>
          {error instanceof Error
            ? error.message
            : "Nie można załadować danych."}
        </p>
      </div>
    );
  }

  const productsForTable = data?.data?.products || [];

  return (
    <>
      <BlockBreadcrumb
        title="Lista Produktów"
        description="Przeglądaj wszystkie produkty w systemie"
      />
      <div className="mt-8">
        <ProductsExpandableTable products={productsForTable} />
      </div>
    </>
  );
};

export default ProductsListPage;
