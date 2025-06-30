import type { FC } from "react";
import { Card, Badge, Button } from "flowbite-react";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";
import { HiCheck, HiClock, HiExclamation } from "react-icons/hi";

const StaffTasksPage: FC = () => {
  const tasks = [
    {
      id: 1,
      title: "Pakowanie zamówienia #12345",
      description: "Spakowanie produktów dla klienta ABC",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Kontrola jakości partii produktów",
      description: "Sprawdzenie jakości nowej dostawy elektroniki",
      priority: "medium",
      status: "in_progress",
      dueDate: "2024-01-16",
    },
    {
      id: 3,
      title: "Aktualizacja inwentarza",
      description: "Przeprowadzenie inwentaryzacji magazynu A",
      priority: "low",
      status: "completed",
      dueDate: "2024-01-14",
    },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge color="failure" icon={HiExclamation}>
            Wysoki
          </Badge>
        );
      case "medium":
        return (
          <Badge color="warning" icon={HiClock}>
            Średni
          </Badge>
        );
      case "low":
        return (
          <Badge color="success" icon={HiCheck}>
            Niski
          </Badge>
        );
      default:
        return <Badge color="gray">Nieznany</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge color="gray">Oczekujące</Badge>;
      case "in_progress":
        return <Badge color="info">W trakcie</Badge>;
      case "completed":
        return <Badge color="success">Ukończone</Badge>;
      default:
        return <Badge color="gray">Nieznany</Badge>;
    }
  };

  return (
    <div className="p-4">
      <div className="w-full">
        <BlockBreadcrumb
          title="Moje Zadania"
          description="Przegląd wszystkich przypisanych zadań i ich statusu realizacji"
        />

        <div className="mt-6 space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="w-full">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {task.title}
                  </h5>
                  <p className="mt-2 font-normal text-gray-700 dark:text-gray-400">
                    {task.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Priorytet:</span>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Status:</span>
                      {getStatusBadge(task.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Termin:</span>
                      <span className="text-sm font-medium">
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {task.status === "pending" && (
                    <Button size="sm" color="blue">
                      Rozpocznij
                    </Button>
                  )}
                  {task.status === "in_progress" && (
                    <Button size="sm" color="success">
                      Zakończ
                    </Button>
                  )}
                  <Button size="sm" color="gray" outline>
                    Szczegóły
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffTasksPage;
