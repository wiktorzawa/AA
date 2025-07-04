import type { FC } from "react";
import { useState } from "react";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";
import {
  Alert,
  Button,
  Card,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { HiExclamationCircle, HiRefresh } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/productsApi";

// Importujemy komponent do debugowania autoryzacji
import { DebugAuthStatus } from "@/components/DebugAuthStatus";

// Przykładowe dane do testowania gdy API nie zwraca danych
const sampleProducts = [
  {
    id: "1",
    name: "Laptop Dell XPS 13",
    category: "Elektronika",
    brand: "Dell",
    price: 4999.99,
    stock: 15,
    totalSales: 120,
    status: "In Stock",
    image: "",
    details: "",
  },
  {
    id: "2",
    name: "iPhone 13 Pro",
    category: "Smartfony",
    brand: "Apple",
    price: 5299.99,
    stock: 8,
    totalSales: 85,
    status: "In Stock",
    image: "",
    details: "",
  },
  {
    id: "3",
    name: "Samsung 4K TV",
    category: "Telewizory",
    brand: "Samsung",
    price: 3499.99,
    stock: 0,
    totalSales: 45,
    status: "Out of Stock",
    image: "",
    details: "",
  },
  {
    id: "4",
    name: "Słuchawki Sony WH-1000XM4",
    category: "Audio",
    brand: "Sony",
    price: 1299.99,
    stock: 23,
    totalSales: 67,
    status: "In Stock",
    image: "",
    details: "",
  },
  {
    id: "5",
    name: "Klawiatura mechaniczna Logitech",
    category: "Peryferia",
    brand: "Logitech",
    price: 499.99,
    stock: 12,
    totalSales: 34,
    status: "In Stock",
    image: "",
    details: "",
  },
];

export const AdminTablesPage: FC = () => {
  const [useTestData, setUseTestData] = useState(false);

  // Pobieramy dane produktów z API
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    retry: 1,
    enabled: !useTestData, // Wyłącz zapytanie jeśli używamy danych testowych
  });

  // Obsługa stanu ładowania
  if (isLoading && !useTestData) {
    return (
      <div className="p-4">
        <div className="w-full">
          <BlockBreadcrumb
            title="Tabela Produktów"
            description="Zaawansowany widok produktów z dostawy"
          />
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Spinner size="xl" />
              <p className="mt-4 text-gray-500">Ładowanie produktów...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formatowanie danych do formatu wymaganego przez komponent TabelaTestAi
  const formattedProducts = useTestData
    ? sampleProducts
    : productsData?.products?.map((product) => ({
        ...product,
        totalSales: product.totalSales ?? 0,
        price: product.price ?? 0,
        image: "placeholder.jpg",
        details: "No details available",
      })) || [];

  return (
    <div className="p-4">
      <div className="w-full">
        <BlockBreadcrumb
          title="Tabela Produktów"
          description="Zaawansowany widok produktów z dostawy"
        />

        {/* Dodajemy komponent do debugowania autoryzacji */}
        <DebugAuthStatus />

        {isError && !useTestData && (
          <Alert color="failure" icon={HiExclamationCircle} className="mt-4">
            <div className="flex flex-col">
              <span className="font-medium">
                Błąd podczas pobierania danych!
              </span>
              <span className="text-sm">
                {error instanceof Error
                  ? error.message
                  : "Wystąpił nieoczekiwany błąd"}
              </span>
              <div className="mt-3 flex space-x-4">
                <Button size="xs" color="failure" onClick={() => refetch()}>
                  <HiRefresh className="mr-2 h-4 w-4" />
                  Spróbuj ponownie
                </Button>
                <Button
                  size="xs"
                  color="gray"
                  onClick={() => setUseTestData(!useTestData)}
                >
                  {useTestData ? "Użyj danych z API" : "Użyj danych testowych"}
                </Button>
              </div>
            </div>
          </Alert>
        )}

        <Card className="mt-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Produkty w dostawach</h3>
            {!isError && (
              <Button
                size="xs"
                color="light"
                onClick={() => setUseTestData(!useTestData)}
              >
                {useTestData ? "Użyj danych z API" : "Użyj danych testowych"}
              </Button>
            )}
          </div>

          {/* Prosta tabela używająca komponentów Flowbite */}
          {formattedProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table hoverable>
                <TableHead>
                  <TableHeadCell>Nazwa</TableHeadCell>
                  <TableHeadCell>Kategoria</TableHeadCell>
                  <TableHeadCell>Marka</TableHeadCell>
                  <TableHeadCell>Cena</TableHeadCell>
                  <TableHeadCell>Stan</TableHeadCell>
                  <TableHeadCell>Sprzedaż</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {formattedProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.price.toFixed(2)} zł</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.totalSales}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            product.status === "In Stock"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {product.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Brak produktów do wyświetlenia</p>
              <Button
                size="sm"
                color="light"
                className="mt-2"
                onClick={() => setUseTestData(true)}
              >
                Załaduj przykładowe dane
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminTablesPage;
