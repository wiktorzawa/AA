import type { FC } from "react";
import { Card } from "flowbite-react";

const AdminDashboardPage: FC = () => {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold dark:text-white">
        Panel Administratora
      </h1>
      <Card>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Witaj w panelu administratora. Tutaj możesz zarządzać użytkownikami,
          ustawieniami systemu i monitorować aktywność.
        </p>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
