import type { FC } from "react";
import { useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Label,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Tooltip,
} from "flowbite-react";

import { useDeliveries, useProductsByDelivery } from "../../hooks";
import type { DeliveryProduct } from "../../api/deliveryApi";

// Types for our delivery data
interface DeliveryData {
  id_dostawy: string;
  id_dostawcy: string;
  nazwa_pliku: string;
  nr_palet_dostawy?: string;
  status_weryfikacji: string;
  data_utworzenia: string;
  data_aktualizacji?: string;
  url_pliku_S3?: string;
}

// ProductData typ jest teraz importowany jako DeliveryProduct z API

export const AdvancedDeliveriesTableWithExpandableRows: FC = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Fetch deliveries using custom hook
  const {
    data: deliveriesResponse,
    isLoading,
    isError,
    error,
  } = useDeliveries();

  const deliveries = deliveriesResponse?.data || [];

  // Toggle row expansion
  const toggleRowExpansion = (deliveryId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(deliveryId)) {
      newExpanded.delete(deliveryId);
    } else {
      newExpanded.add(deliveryId);
    }
    setExpandedRows(newExpanded);
  };

  // Toggle row selection
  const toggleRowSelection = (deliveryId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(deliveryId)) {
      newSelection.delete(deliveryId);
    } else {
      newSelection.add(deliveryId);
    }
    setSelectedRows(newSelection);
  };

  // Toggle all rows selection
  const toggleAllSelection = () => {
    if (selectedRows.size === deliveries.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(
        new Set(deliveries.map((d: DeliveryData) => d.id_dostawy)),
      );
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "zweryfikowana":
        return "success";
      case "w_trakcie":
        return "warning";
      case "nowa":
        return "info";
      case "odrzucona":
        return "failure";
      default:
        return "gray";
    }
  };

  // Get status display text
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case "zweryfikowana":
        return "Zweryfikowana";
      case "w_trakcie":
        return "W trakcie";
      case "nowa":
        return "Nowa";
      case "odrzucona":
        return "Odrzucona";
      default:
        return status || "Nieznany";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Ładowanie dostaw...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Błąd podczas pobierania danych
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "Wystąpił nieoczekiwany błąd"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-3 sm:py-5 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-12">
        <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
          {/* Header */}
          <div className="flex flex-col items-center justify-between space-y-3 border-b p-4 md:flex-row md:space-y-0 md:space-x-4 dark:border-gray-700">
            <div className="flex w-full items-center space-x-3">
              <h5 className="font-semibold dark:text-white">Dostawy</h5>
              <div className="font-medium text-gray-400">
                {deliveries.length} wyników
              </div>
              <Tooltip
                content={`Pokazuje 1-${deliveries.length} z ${deliveries.length} wyników`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Więcej informacji</span>
              </Tooltip>
            </div>
            <div className="flex w-full flex-row items-center justify-end space-x-3 md:w-fit">
              <Button className="w-full whitespace-nowrap">
                <svg
                  className="mr-2 h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Dodaj nową dostawę
              </Button>
              <Button color="gray" className="w-full whitespace-nowrap">
                <svg
                  className="mr-2 h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  stroke="currentColor"
                  viewBox="0 0 12 13"
                  aria-hidden
                >
                  <path d="M1 2V1h10v3H1V2Zm0 4h5v6H1V6Zm8 0h2v6H9V6Z" />
                </svg>
                Zarządzaj kolumnami
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col-reverse items-start justify-between border-b p-4 md:flex-row md:items-center md:space-x-4 dark:border-gray-700">
            <div className="mt-3 md:mt-0">
              <Dropdown
                color="gray"
                label={
                  <>
                    <svg
                      className="mr-1.5 -ml-1 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                    Akcje
                  </>
                }
              >
                <DropdownItem>Edytuj wszystkie</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Usuń wszystkie</DropdownItem>
              </Dropdown>
            </div>
            <div className="grid w-full grid-cols-1 md:grid-cols-4 md:gap-4 lg:w-2/3">
              <div className="w-full">
                <Label htmlFor="status" className="sr-only">
                  Status
                </Label>
                <Select id="status" name="status" defaultValue="">
                  <option value="">Status</option>
                  <option value="nowa">Nowa</option>
                  <option value="w_trakcie">W trakcie</option>
                  <option value="zweryfikowana">Zweryfikowana</option>
                  <option value="odrzucona">Odrzucona</option>
                </Select>
              </div>
              <div className="w-full">
                <Label htmlFor="dostawca" className="sr-only">
                  Dostawca
                </Label>
                <Select id="dostawca" name="dostawca" defaultValue="">
                  <option value="">Dostawca</option>
                  <option value="dostawca1">Dostawca 1</option>
                  <option value="dostawca2">Dostawca 2</option>
                </Select>
              </div>
              <div className="w-full">
                <Label htmlFor="data" className="sr-only">
                  Data
                </Label>
                <Select id="data" name="data" defaultValue="">
                  <option value="">Data</option>
                  <option value="today">Dzisiaj</option>
                  <option value="week">Ostatni tydzień</option>
                  <option value="month">Ostatni miesiąc</option>
                </Select>
              </div>
              <div className="w-full">
                <Label htmlFor="palety" className="sr-only">
                  Palety
                </Label>
                <Select id="palety" name="palety" defaultValue="">
                  <option value="">Palety</option>
                  <option value="1-5">1-5</option>
                  <option value="6-10">6-10</option>
                  <option value="11+">11+</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <TableHead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                <TableHeadCell className="w-4 p-4">
                  <div className="flex items-center">
                    <Checkbox
                      checked={
                        selectedRows.size === deliveries.length &&
                        deliveries.length > 0
                      }
                      onChange={toggleAllSelection}
                    />
                    <Label htmlFor="checkbox-all" className="sr-only">
                      Zaznacz wszystkie
                    </Label>
                  </div>
                </TableHeadCell>
                <TableHeadCell className="px-6 py-3">ID Dostawy</TableHeadCell>
                <TableHeadCell className="px-6 py-3">Nazwa Pliku</TableHeadCell>
                <TableHeadCell className="px-6 py-3">Nr Palet</TableHeadCell>
                <TableHeadCell className="px-6 py-3">Status</TableHeadCell>
                <TableHeadCell className="px-6 py-3">
                  Data Utworzenia
                </TableHeadCell>
                <TableHeadCell className="px-6 py-3">
                  <span className="sr-only">Akcje</span>
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {deliveries.map((delivery: DeliveryData, index: number) => (
                  <DeliveryRow
                    key={delivery.id_dostawy || index}
                    delivery={delivery}
                    isSelected={selectedRows.has(delivery.id_dostawy)}
                    isExpanded={expandedRows.has(delivery.id_dostawy)}
                    onToggleSelection={() =>
                      toggleRowSelection(delivery.id_dostawy)
                    }
                    onToggleExpansion={() =>
                      toggleRowExpansion(delivery.id_dostawy)
                    }
                    getStatusBadgeColor={getStatusBadgeColor}
                    getStatusDisplayText={getStatusDisplayText}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

// Component for individual delivery row
interface DeliveryRowProps {
  delivery: DeliveryData;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelection: () => void;
  onToggleExpansion: () => void;
  getStatusBadgeColor: (status: string) => string;
  getStatusDisplayText: (status: string) => string;
}

const DeliveryRow: FC<DeliveryRowProps> = ({
  delivery,
  isSelected,
  isExpanded,
  onToggleSelection,
  onToggleExpansion,
  getStatusBadgeColor,
  getStatusDisplayText,
}) => {
  // Query for products of this delivery when expanded
  const {
    data: productsResponse,
    isLoading: productsLoading,
    isError: productsError,
  } = useProductsByDelivery(delivery.id_dostawy, isExpanded);

  const products = productsResponse?.data || [];

  return (
    <>
      <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <TableCell className="w-4 p-4">
          <div className="flex items-center">
            <Checkbox checked={isSelected} onChange={onToggleSelection} />
            <Label
              htmlFor={`checkbox-${delivery.id_dostawy}`}
              className="sr-only"
            >
              Zaznacz rząd
            </Label>
          </div>
        </TableCell>
        <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
          {delivery.id_dostawy}
        </TableCell>
        <TableCell>{delivery.nazwa_pliku}</TableCell>
        <TableCell>{delivery.nr_palet_dostawy || "—"}</TableCell>
        <TableCell>
          <Badge color={getStatusBadgeColor(delivery.status_weryfikacji)}>
            {getStatusDisplayText(delivery.status_weryfikacji)}
          </Badge>
        </TableCell>
        <TableCell>
          {new Date(delivery.data_utworzenia).toLocaleDateString("pl-PL")}
        </TableCell>
        <TableCell>
          <Button
            size="sm"
            color="gray"
            onClick={onToggleExpansion}
            className="flex items-center"
          >
            <svg
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </TableCell>
      </TableRow>

      {/* Expanded row content */}
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={7} className="p-0">
            <div className="bg-gray-50 p-4 dark:bg-gray-700">
              <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                Produkty w dostawie
              </h4>

              {productsLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">
                    Ładowanie produktów...
                  </span>
                </div>
              )}

              {productsError && (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  Błąd podczas pobierania produktów
                </div>
              )}

              {!productsLoading && !productsError && products.length === 0 && (
                <div className="py-4 text-sm text-gray-500">
                  Brak produktów w tej dostawie
                </div>
              )}

              {!productsLoading && !productsError && products.length > 0 && (
                <div className="overflow-x-auto">
                  <Table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <TableHead className="bg-gray-100 text-xs text-gray-700 uppercase dark:bg-gray-600 dark:text-gray-400">
                      <TableHeadCell className="px-4 py-3">
                        Nazwa Produktu
                      </TableHeadCell>
                      <TableHeadCell className="px-4 py-3">EAN</TableHeadCell>
                      <TableHeadCell className="px-4 py-3">ASIN</TableHeadCell>
                      <TableHeadCell className="px-4 py-3">Ilość</TableHeadCell>
                      <TableHeadCell className="px-4 py-3">
                        Status
                      </TableHeadCell>
                      <TableHeadCell className="px-4 py-3">
                        Paleta
                      </TableHeadCell>
                    </TableHead>
                    <TableBody>
                      {products.map(
                        (product: DeliveryProduct, index: number) => (
                          <TableRow
                            key={product.id_produktu_dostawy || index}
                            className="border-b dark:border-gray-600"
                          >
                            <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                              {product.nazwa_produktu}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {product.kod_ean || "—"}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {product.kod_asin || "—"}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {product.ilosc}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <Badge
                                color={getStatusBadgeColor(
                                  product.status_weryfikacji,
                                )}
                                size="sm"
                              >
                                {getStatusDisplayText(
                                  product.status_weryfikacji,
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {product.nr_palety || "—"}
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default AdvancedDeliveriesTableWithExpandableRows;
