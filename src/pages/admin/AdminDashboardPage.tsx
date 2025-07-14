import type { FC } from "react";
// import { useProducts } from "@/hooks/useProducts";
// import {
//   Spinner,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeadCell,
//   TableRow,
//   Badge,
// } from "flowbite-react";

const AdminDashboardPage: FC = function () {
  // const { data: productsResponse, isLoading, isError } = useProducts();

  // if (isLoading) {
  //   return (
  //     <div className="flex h-64 items-center justify-center">
  //       <Spinner size="xl" />
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <div className="p-4 text-center text-red-500">
  //       Wystąpił błąd podczas ładowania produktów.
  //     </div>
  //   );
  // }

  // const products = productsResponse?.data?.products || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Zalogowano jako admin
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Panel administratora działa! (Wyłączono pobieranie produktów)
      </p>
    </div>
  );
};

export default AdminDashboardPage;
