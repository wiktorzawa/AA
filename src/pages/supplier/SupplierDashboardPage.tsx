import type { FC } from "react";
import { Card } from "flowbite-react";

const SupplierDashboardPage: FC = () => {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold dark:text-white">
        Panel Dostawcy
      </h1>
      <Card>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Witaj w panelu dostawcy. Tutaj możesz zarządzać swoimi dostawami i
          przeglądać dane.
        </p>
      </Card>
    </div>
  );
};

export default SupplierDashboardPage;
