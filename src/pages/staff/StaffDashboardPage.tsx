import type { FC } from "react";
import { Card } from "flowbite-react";

const StaffDashboardPage: FC = () => {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold dark:text-white">
        Panel Pracownika
      </h1>
      <Card>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Witaj w panelu pracownika. Tutaj znajdziesz swoje zadania i narzędzia
          potrzebne do pracy.
        </p>
      </Card>
    </div>
  );
};

export default StaffDashboardPage;
