import type { FC } from "react";
import { Card, Badge, Button, Table } from "flowbite-react";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";
import { HiTruck, HiCheck, HiClock } from "react-icons/hi";

const SupplierDeliveriesPage: FC = () => {
  const deliveries = [
    {
      id: "DEL-001",
      products: "Amazon Basics PL10023609",
      quantity: 150,
      destination: "Magazyn Wiktor",
      status: "delivered",
      deliveryDate: "2024-01-15",
      value: "12,500 PLN",
    },
    {
      id: "DEL-002",
      products: "Artykuły kuchenne AM38160",
      quantity: 75,
      destination: "Magazyn Centralny",
      status: "in_transit",
      deliveryDate: "2024-01-18",
      value: "8,750 PLN",
    },
    {
      id: "DEL-003",
      products: "Elektronika i gry przenośne",
      quantity: 200,
      destination: "Magazyn Wiktor",
      status: "pending",
      deliveryDate: "2024-01-20",
      value: "25,000 PLN",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge color="warning" icon={HiClock}>
            Oczekująca
          </Badge>
        );
      case "in_transit":
        return (
          <Badge color="info" icon={HiTruck}>
            W transporcie
          </Badge>
        );
      case "delivered":
        return (
          <Badge color="success" icon={HiCheck}>
            Dostarczona
          </Badge>
        );
      default:
        return <Badge color="gray">Nieznany</Badge>;
    }
  };

  return (
    <div className="p-4">
      <div className="w-full">
        <BlockBreadcrumb
          title="Dostawy"
          description="Zarządzanie dostawami produktów i monitorowanie ich statusu"
        />

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lista Dostaw
          </h2>
          <Button color="blue">Nowa Dostawa</Button>
        </div>

        <div className="mt-4">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell>ID Dostawy</Table.HeadCell>
                  <Table.HeadCell>Produkty</Table.HeadCell>
                  <Table.HeadCell>Ilość</Table.HeadCell>
                  <Table.HeadCell>Miejsce docelowe</Table.HeadCell>
                  <Table.HeadCell>Data dostawy</Table.HeadCell>
                  <Table.HeadCell>Wartość</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Akcje</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {deliveries.map((delivery) => (
                    <Table.Row
                      key={delivery.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                        {delivery.id}
                      </Table.Cell>
                      <Table.Cell>{delivery.products}</Table.Cell>
                      <Table.Cell>{delivery.quantity} szt.</Table.Cell>
                      <Table.Cell>{delivery.destination}</Table.Cell>
                      <Table.Cell>{delivery.deliveryDate}</Table.Cell>
                      <Table.Cell className="font-medium">
                        {delivery.value}
                      </Table.Cell>
                      <Table.Cell>{getStatusBadge(delivery.status)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2">
                          <Button size="xs" color="gray" outline>
                            Szczegóły
                          </Button>
                          {delivery.status === "pending" && (
                            <Button size="xs" color="blue">
                              Wyślij
                            </Button>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  3
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Aktywne dostawy
                </p>
              </div>
              <HiTruck className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  425
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Produkty w transporcie
                </p>
              </div>
              <HiClock className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  46,250 PLN
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Wartość dostaw
                </p>
              </div>
              <HiCheck className="h-8 w-8 text-green-600" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierDeliveriesPage;
