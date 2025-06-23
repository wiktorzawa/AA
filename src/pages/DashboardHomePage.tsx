import type { FC } from "react";

const DashboardHomePage: FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold dark:text-white">
        Strona główna pulpitu
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Witaj w swoim nowym dashboardzie!
      </p>
    </div>
  );
};

export default DashboardHomePage;
