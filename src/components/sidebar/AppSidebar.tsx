import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiClipboard,
  HiInformationCircle,
  HiShoppingBag,
  HiUsers,
  HiTruck,
  HiCog,
  HiDocumentReport,
  HiCollection,
  HiTable,
} from "react-icons/hi";

interface AppSidebarProps {
  userRole?: "admin" | "staff" | "supplier";
}

const AppSidebar: FC<AppSidebarProps> = function ({ userRole }) {
  const [currentPage, setCurrentPage] = useState("");
  const [actualUserRole, setActualUserRole] = useState<string | null>(null);

  useEffect(() => {
    const newPage = window.location.pathname;
    setCurrentPage(newPage);

    // Pobierz rolę z localStorage lub użyj przekazanej prop
    const roleFromStorage = localStorage.getItem("userRole");
    const finalRole = userRole || roleFromStorage;

    console.log("AppSidebar - userRole prop:", userRole);
    console.log("AppSidebar - roleFromStorage:", roleFromStorage);
    console.log("AppSidebar - finalRole:", finalRole);
    console.log("AppSidebar - currentPage:", newPage);

    setActualUserRole(finalRole);
  }, [userRole, currentPage]);

  // Menu dla Admin
  const renderAdminMenu = () => (
    <>
      <SidebarItem
        href="/admin/dashboard"
        icon={HiChartPie}
        className={
          "/admin/dashboard" === currentPage
            ? "bg-gray-100 dark:bg-gray-700"
            : ""
        }
      >
        Dashboard
      </SidebarItem>
      <SidebarItem
        href="/admin/landing"
        icon={HiCollection}
        className={
          "/admin/landing" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
        }
      >
        Landing Page
      </SidebarItem>
      <SidebarItem
        href="/admin/tables"
        icon={HiTable}
        className={
          "/admin/tables" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
        }
      >
        Advanced Tables
      </SidebarItem>
      <SidebarItem
        href="/admin/users"
        icon={HiUsers}
        className={
          "/admin/users" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
        }
      >
        Zarządzanie Użytkownikami
      </SidebarItem>
      <SidebarItem
        href="/admin/staff"
        icon={HiClipboard}
        className={
          "/admin/staff" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
        }
      >
        Zarządzanie Personelem
      </SidebarItem>
      <SidebarItem
        href="/admin/suppliers"
        icon={HiTruck}
        className={
          "/admin/suppliers" === currentPage
            ? "bg-gray-100 dark:bg-gray-700"
            : ""
        }
      >
        Zarządzanie Dostawcami
      </SidebarItem>
      <SidebarCollapse icon={HiShoppingBag} label="E-commerce">
        <SidebarItem href="/admin/products">Produkty</SidebarItem>
        <SidebarItem href="/admin/orders">Zamówienia</SidebarItem>
        <SidebarItem href="/admin/inventory">Magazyn</SidebarItem>
      </SidebarCollapse>
      <SidebarItem
        href="/admin/reports"
        icon={HiDocumentReport}
        className={
          "/admin/reports" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
        }
      >
        Raporty
      </SidebarItem>
      <SidebarItem
        href="/admin/settings"
        icon={HiCog}
        className={
          "/admin/settings" === currentPage
            ? "bg-gray-100 dark:bg-gray-700"
            : ""
        }
      >
        Ustawienia Systemu
      </SidebarItem>
    </>
  );

  // Menu dla Staff
  const renderStaffMenu = () => (
    <>
      <SidebarItem
        href="/staff/dashboard"
        icon={HiChartPie}
        className={
          "/staff/dashboard" === currentPage
            ? "bg-gray-100 dark:bg-gray-700"
            : ""
        }
      >
        Dashboard
      </SidebarItem>
      <SidebarItem
        href="/staff/tasks"
        icon={HiClipboard}
        className={
          "/staff/tasks" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
        }
      >
        Moje Zadania
      </SidebarItem>
      <SidebarCollapse icon={HiShoppingBag} label="Obsługa Zamówień">
        <SidebarItem href="/staff/orders/new">Nowe Zamówienia</SidebarItem>
        <SidebarItem href="/staff/orders/processing">W Realizacji</SidebarItem>
        <SidebarItem href="/staff/orders/completed">Zakończone</SidebarItem>
      </SidebarCollapse>
      <SidebarItem
        href="/staff/inventory"
        icon={HiCollection}
        className={
          "/staff/inventory" === currentPage
            ? "bg-gray-100 dark:bg-gray-700"
            : ""
        }
      >
        Magazyn
      </SidebarItem>
      <SidebarItem
        href="/staff/reports"
        icon={HiDocumentReport}
        className={
          "/staff/reports" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""
        }
      >
        Raporty
      </SidebarItem>
    </>
  );

  // Menu dla Supplier
  const renderSupplierMenu = () => (
    <>
      <SidebarItem
        href="/supplier/dashboard"
        icon={HiChartPie}
        className={
          "/supplier/dashboard" === currentPage
            ? "bg-gray-100 dark:bg-gray-700"
            : ""
        }
      >
        Dashboard
      </SidebarItem>
      <SidebarItem
        href="/supplier/deliveries"
        icon={HiTruck}
        className={
          "/supplier/deliveries" === currentPage
            ? "bg-gray-100 dark:bg-gray-700"
            : ""
        }
      >
        Moje Dostawy
      </SidebarItem>
      <SidebarCollapse icon={HiShoppingBag} label="Produkty">
        <SidebarItem href="/supplier/products">Lista Produktów</SidebarItem>
        <SidebarItem href="/supplier/products/add">Dodaj Produkt</SidebarItem>
        <SidebarItem href="/supplier/inventory">Stan Magazynowy</SidebarItem>
      </SidebarCollapse>
      <SidebarItem
        href="/supplier/orders"
        icon={HiClipboard}
        className={
          "/supplier/orders" === currentPage
            ? "bg-gray-100 dark:bg-gray-700"
            : ""
        }
      >
        Zamówienia
      </SidebarItem>
      <SidebarItem
        href="/supplier/invoices"
        icon={HiDocumentReport}
        className={
          "/supplier/invoices" === currentPage
            ? "bg-gray-100 dark:bg-gray-700"
            : ""
        }
      >
        Faktury
      </SidebarItem>
    </>
  );

  // Menu domyślne (gdy brak roli lub ogólny dashboard)
  const renderDefaultMenu = () => (
    <>
      <SidebarItem
        href="/"
        icon={HiChartPie}
        className={"/" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""}
      >
        Dashboard
      </SidebarItem>
      <SidebarItem href="/authentication/sign-in" icon={HiInformationCircle}>
        Zaloguj się
      </SidebarItem>
    </>
  );

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          <SidebarItems>
            <SidebarItemGroup>
              {actualUserRole === "admin" && renderAdminMenu()}
              {actualUserRole === "staff" && renderStaffMenu()}
              {actualUserRole === "supplier" && renderSupplierMenu()}
              {!actualUserRole && renderDefaultMenu()}
            </SidebarItemGroup>
          </SidebarItems>
        </div>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
