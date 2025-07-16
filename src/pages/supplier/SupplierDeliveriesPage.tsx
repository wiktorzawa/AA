import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Spinner, BreadcrumbItem, Alert } from "flowbite-react";
import { HiHome, HiExclamation } from "react-icons/hi";
import { getSupplierDeliveries } from "@/api/deliveryApi";
import { useAuthStore } from "@/stores/authStore";
import type { SupplierProfile } from "@/types/app.types";
import { ExpandableDeliveriesTable } from "@/components/tables/ExpandableDeliveriesTable";

export const SupplierDeliveriesPage: FC = () => {
  const profile = useAuthStore((state) => state.profile);

  function isSupplier(p: any): p is SupplierProfile {
    return p && "supplierId" in p;
  }

  const supplierId = isSupplier(profile) ? profile.supplierId : null;

  const {
    data: deliveriesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["supplierDeliveries", supplierId],
    queryFn: () => {
      if (!supplierId) {
        return Promise.reject(new Error("Brak ID dostawcy"));
      }
      return getSupplierDeliveries(supplierId);
    },
    enabled: !!supplierId,
  });

  if (isError) {
    console.error("Błąd ładowania dostaw:", error);
  }

  const deliveries = deliveriesData?.data ?? [];

  return (
    <>
      <Breadcrumb className="mb-8">
        <BreadcrumbItem href="/supplier" icon={HiHome}>
          Panel Dostawcy
        </BreadcrumbItem>
        <BreadcrumbItem>Moje Dostawy</BreadcrumbItem>
      </Breadcrumb>

      {isLoading && (
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-2">Ładowanie dostaw...</p>
        </div>
      )}

      {isError && (
        <Alert color="failure" icon={HiExclamation}>
          <h3 className="font-semibold">Błąd</h3>
          <p>Nie udało się załadować listy dostaw. Spróbuj ponownie później.</p>
          <p className="mt-2 text-xs">Szczegóły: {error?.message}</p>
        </Alert>
      )}

      {!isLoading && !isError && (
        <ExpandableDeliveriesTable deliveries={deliveries} />
      )}
    </>
  );
};

export default SupplierDeliveriesPage;
