import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Spinner, BreadcrumbItem } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { getDeliveries } from "@/api/deliveryApi";

export const SupplierDeliveriesPage: FC = () => {
  const {
    data: deliveriesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["deliveries"],
    queryFn: getDeliveries,
  });

  if (isError) {
    console.error("Błąd ładowania dostaw:", error);
  }

  return (
    <>
      <Breadcrumb className="mb-8">
        <BreadcrumbItem href="/supplier" icon={HiHome}>
          Dashboard
        </BreadcrumbItem>
        <BreadcrumbItem>Dostawy</BreadcrumbItem>
      </Breadcrumb>
      <div className="text-center">
        {isLoading && (
          <div>
            <Spinner />
            <p>Ładowanie dostaw...</p>
          </div>
        )}
      </div>

      {deliveriesData && <pre>{JSON.stringify(deliveriesData, null, 2)}</pre>}
    </>
  );
};

export default SupplierDeliveriesPage;
