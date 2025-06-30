import type { FC } from "react";
import { Card } from "flowbite-react";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";

const SupplierDashboardPage: FC = () => {
  return (
    <div className="p-4">
      <div className="w-full">
        <BlockBreadcrumb
          title="Panel Dostawcy"
          description="Centrum zarządzania dostawami i produktami - przegląd kluczowych funkcji dla dostawców"
        />

        <div className="w-full rounded-lg bg-purple-800 p-6 shadow-sm dark:bg-purple-800">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Witaj w Panelu Dostawcy
          </h1>
          <p className="font-normal text-gray-100">
            Tutaj możesz zarządzać swoimi dostawami, produktami i zamówieniami.
            Monitoruj stan magazynowy i przeglądaj raporty sprzedaży. Wybierz
            odpowiednią sekcję z menu bocznego aby rozpocząć pracę.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Dostawy
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Zarządzanie dostawami, ich statusem i harmonogramem realizacji.
            </p>
          </Card>

          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Produkty
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Katalog produktów, stan magazynowy i zarządzanie cennikiem.
            </p>
          </Card>

          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Zamówienia
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Przeglądaj nowe zamówienia i zarządzaj ich realizacją.
            </p>
          </Card>

          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Płatności
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Historia płatności, faktury i rozliczenia finansowe.
            </p>
          </Card>

          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Raporty
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Analiza sprzedaży, wydajności i statystyki biznesowe.
            </p>
          </Card>

          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Profil
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Zarządzanie danymi firmy i ustawieniami konta.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboardPage;
