import type { FC } from "react";
import { Card } from "flowbite-react";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";

const AdminDashboardPage: FC = () => {
  return (
    <div className="p-4">
      <div className="w-full">
        <BlockBreadcrumb
          title="Panel Administratora"
          description="Centrum kontroli i zarządzania systemem - przegląd kluczowych funkcji administracyjnych"
        />

        <div className="w-full rounded-lg bg-gray-800 p-6 shadow-sm dark:bg-gray-800">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Witaj w Panelu Administratora
          </h1>
          <p className="font-normal text-gray-400">
            Tutaj możesz zarządzać użytkownikami, ustawieniami systemu i
            monitorować aktywność. Wybierz odpowiednią sekcję z menu bocznego
            aby rozpocząć pracę.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
