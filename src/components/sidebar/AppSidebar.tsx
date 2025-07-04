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
import { logger } from "../../utils/logger";

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

    logger.debug("AppSidebar role resolution", {
      userRoleProp: userRole,
      roleFromStorage,
      finalRole,
      currentPage: newPage,
    });

    setActualUserRole(finalRole);
  }, [userRole, currentPage]);

  // Menu dla Admin
  const renderAdminMenu = () => (
    <>
      <SidebarItem
        href="/admin/dashboard"
        icon={HiChartPie}
        active={"/admin/dashboard" === currentPage}
      >
        Dashboard
      </SidebarItem>
      <SidebarItem
        href="/admin/landing"
        icon={HiCollection}
        active={"/admin/landing" === currentPage}
      >
        Landing Page
      </SidebarItem>
      <SidebarItem
        href="/admin/tables"
        icon={HiTable}
        active={"/admin/tables" === currentPage}
      >
        Advanced Tables
      </SidebarItem>
      <SidebarItem
        href="/admin/users"
        icon={HiUsers}
        active={"/admin/users" === currentPage}
      >
        Zarządzanie Użytkownikami
      </SidebarItem>
      <SidebarItem
        href="/admin/staff"
        icon={HiClipboard}
        active={"/admin/staff" === currentPage}
      >
        Zarządzanie Personelem
      </SidebarItem>
      <SidebarItem
        href="/admin/suppliers"
        icon={HiTruck}
        active={"/admin/suppliers" === currentPage}
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
        active={"/admin/reports" === currentPage}
      >
        Raporty
      </SidebarItem>
      <SidebarItem
        href="/admin/settings"
        icon={HiCog}
        active={"/admin/settings" === currentPage}
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
        active={"/staff/dashboard" === currentPage}
      >
        Dashboard
      </SidebarItem>
      <SidebarItem
        href="/staff/tasks"
        icon={HiClipboard}
        active={"/staff/tasks" === currentPage}
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
        active={"/staff/inventory" === currentPage}
      >
        Magazyn
      </SidebarItem>
      <SidebarItem
        href="/staff/reports"
        icon={HiDocumentReport}
        active={"/staff/reports" === currentPage}
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
        active={"/supplier/dashboard" === currentPage}
      >
        Dashboard
      </SidebarItem>
      <SidebarItem
        href="/supplier/deliveries"
        icon={HiTruck}
        active={"/supplier/deliveries" === currentPage}
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
        active={"/supplier/orders" === currentPage}
      >
        Zamówienia
      </SidebarItem>
      <SidebarItem
        href="/supplier/invoices"
        icon={HiDocumentReport}
        active={"/supplier/invoices" === currentPage}
      >
        Faktury
      </SidebarItem>
    </>
  );

  // Menu domyślne (gdy brak roli lub ogólny dashboard)
  const renderDefaultMenu = () => (
    <>
      <SidebarItem href="/" icon={HiChartPie} active={"/" === currentPage}>
        Dashboard
      </SidebarItem>
      <SidebarItem href="/authentication/sign-in" icon={HiUsers}>
        Zaloguj się
      </SidebarItem>
      <SidebarItem href="/authentication/sign-up" icon={HiUsers}>
        Zarejestruj się
      </SidebarItem>
    </>
  );

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="h-full bg-gray-50 dark:bg-gray-900"
    >
      <SidebarItems>
        <SidebarItemGroup>
          {actualUserRole === "admin" && renderAdminMenu()}
          {actualUserRole === "staff" && renderStaffMenu()}
          {actualUserRole === "supplier" && renderSupplierMenu()}
          {!actualUserRole && renderDefaultMenu()}
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiInformationCircle}>
            Help
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};

export default AppSidebar;
