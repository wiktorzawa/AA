import type { FC } from "react";
import { Button } from "flowbite-react";
import { HiUsers, HiCog, HiChartPie, HiShieldCheck } from "react-icons/hi";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";

const AdminLandingPage: FC = function () {
  const adminStats = [
    {
      icon: HiUsers,
      title: "Użytkownicy",
      value: "2,847",
      change: "+12%",
      description: "Aktywni użytkownicy",
    },
    {
      icon: HiChartPie,
      title: "Sprzedaż",
      value: "€45,385",
      change: "+8.2%",
      description: "Miesięczny przychód",
    },
    {
      icon: HiCog,
      title: "Systemy",
      value: "99.9%",
      change: "+0.1%",
      description: "Dostępność systemu",
    },
    {
      icon: HiShieldCheck,
      title: "Bezpieczeństwo",
      value: "100%",
      change: "0%",
      description: "Zabezpieczenia aktywne",
    },
  ];

  return (
    <div className="p-4">
      <div className="w-full">
        <BlockBreadcrumb
          title="Centrum Administracyjne"
          description="Zarządzaj użytkownikami, monitoruj system i kontroluj wszystkie aspekty platformy z jednego miejsca"
        />

        {/* Admin Stats Section */}
        <div className="mb-6 w-full rounded-lg bg-gray-800 p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Statystyki Systemu
            </h2>
            <p className="text-gray-400">
              Przegląd kluczowych metryk i wskaźników wydajności Twojej
              platformy.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {adminStats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg bg-gray-700 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                  <stat.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-3xl font-bold text-white">
                  {stat.value}
                </h3>
                <p className="mb-1 text-lg font-semibold text-white">
                  {stat.title}
                </p>
                <p className="mb-2 text-sm text-gray-400">{stat.description}</p>
                <span
                  className={`text-sm font-medium ${
                    stat.change.startsWith("+")
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {stat.change} vs poprzedni miesiąc
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Features Section */}
        <div className="mb-6 w-full rounded-lg bg-gray-800 p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Funkcje Administratora
            </h2>
            <p className="text-gray-400">
              Kompleksowe narzędzia do zarządzania platformą i użytkownikami.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-gray-700 p-6">
              <HiUsers className="mb-4 h-10 w-10 text-blue-400" />
              <h3 className="mb-2 text-xl font-bold text-white">
                Zarządzanie Użytkownikami
              </h3>
              <p className="mb-4 text-gray-400">
                Dodawaj, edytuj i zarządzaj kontami użytkowników. Kontroluj
                uprawnienia i role.
              </p>
              <Button
                href="/admin/users"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Zarządzaj
              </Button>
            </div>

            <div className="rounded-lg bg-gray-700 p-6">
              <HiChartPie className="mb-4 h-10 w-10 text-green-400" />
              <h3 className="mb-2 text-xl font-bold text-white">
                Raporty i Analityka
              </h3>
              <p className="mb-4 text-gray-400">
                Szczegółowe raporty sprzedaży, aktywności użytkowników i
                wydajności systemu.
              </p>
              <Button
                href="/admin/reports"
                className="bg-green-600 hover:bg-green-700"
              >
                Zobacz Raporty
              </Button>
            </div>

            <div className="rounded-lg bg-gray-700 p-6">
              <HiCog className="mb-4 h-10 w-10 text-purple-400" />
              <h3 className="mb-2 text-xl font-bold text-white">
                Ustawienia Systemu
              </h3>
              <p className="mb-4 text-gray-400">
                Konfiguruj parametry systemu, bezpieczeństwo i integracje
                zewnętrzne.
              </p>
              <Button
                href="/admin/settings"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Ustawienia
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="w-full rounded-lg bg-gray-800 p-6 shadow-sm dark:bg-gray-800">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Szybkie Akcje
            </h2>
            <p className="mb-6 text-gray-400">
              Najczęściej używane funkcje administratora w jednym miejscu.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                href="/admin/users"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Dodaj Użytkownika
              </Button>
              <Button
                size="lg"
                href="/admin/products"
                className="bg-green-600 hover:bg-green-700"
              >
                Zarządzaj Produktami
              </Button>
              <Button
                size="lg"
                href="/admin/reports"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Generuj Raport
              </Button>
              <Button size="lg" href="/admin/settings" color="gray" outline>
                Konfiguracja
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLandingPage;
