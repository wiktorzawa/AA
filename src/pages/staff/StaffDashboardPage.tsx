import type { FC } from "react";
import { Card } from "flowbite-react";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";

const StaffDashboardPage: FC = () => {
  return (
    <div className="p-4">
      <div className="w-full">
        <BlockBreadcrumb
          title="Panel Pracownika"
          description="Centrum pracy i zarządzania zadaniami - przegląd aktualnych obowiązków i narzędzi dla personelu"
        />

        <div className="w-full rounded-lg bg-green-800 p-6 shadow-sm dark:bg-green-800">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Witaj w Panelu Pracownika
          </h1>
          <p className="font-normal text-gray-100">
            Tutaj możesz zarządzać swoimi zadaniami, przeglądać zamówienia i
            monitorować postęp pracy. Wybierz odpowiednią sekcję z menu bocznego
            aby rozpocząć pracę.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Moje Zadania
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Przegląd przypisanych zadań i ich statusu realizacji.
            </p>
          </Card>

          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Zamówienia
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Zarządzanie zamówieniami w trakcie realizacji i wysyłki.
            </p>
          </Card>

          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Raporty
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Przeglądaj raporty dotyczące swojej pracy i wydajności.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
