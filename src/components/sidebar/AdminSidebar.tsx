import type { FC } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  TextInput,
} from "flowbite-react";
import {
  HiChartPie,
  HiHome,
  HiSearch,
  HiShoppingCart,
  HiTable,
  HiCog,
  HiDocumentReport,
  HiDatabase,
  HiTruck,
  HiPlus,
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";

interface AdminSidebarProps {
  isOpen?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

export const AdminSidebar: FC<AdminSidebarProps> = ({
  isOpen = true,
  onHoverChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  const isActive = (path: string) => location.pathname === path;
  const shouldShowExpanded = isOpen || isHovered;

  return (
    <div
      className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Collapsed Sidebar - Always visible */}
      <Sidebar
        collapsed
        className="h-full w-16 border-r dark:border-gray-700 [&>div]:bg-white [&>div]:py-3 dark:[&>div]:bg-gray-800"
      >
        <SidebarItemGroup className="[&_[role=tooltip]]:hidden [&_svg]:text-gray-400">
          <div className="mb-4 p-2">
            <div
              onClick={() => navigate("/admin")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/admin");
                }
              }}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <span className="text-sm font-bold">A</span>
              </div>
            </div>
          </div>
          <SidebarItem
            href="/admin"
            icon={HiHome}
            className={isActive("/admin") ? "bg-gray-100 dark:bg-gray-700" : ""}
            onClick={() => navigate("/admin")}
          />
          <SidebarItem
            href="/admin/landing"
            icon={HiChartPie}
            className={
              isActive("/admin/landing") ? "bg-gray-100 dark:bg-gray-700" : ""
            }
            onClick={() => navigate("/admin/landing")}
          />
          <SidebarItem
            href="/admin/products"
            icon={HiShoppingCart}
            className={
              isActive("/admin/products") ? "bg-gray-100 dark:bg-gray-700" : ""
            }
            onClick={() => navigate("/admin/products")}
          />
          <SidebarItem
            href="/admin/tables"
            icon={HiTable}
            className={
              isActive("/admin/tables") ? "bg-gray-100 dark:bg-gray-700" : ""
            }
            onClick={() => navigate("/admin/tables")}
          />

          <SidebarItem
            href="/admin/reports"
            icon={HiDocumentReport}
            className={
              isActive("/admin/reports") ? "bg-gray-100 dark:bg-gray-700" : ""
            }
            onClick={() => navigate("/admin/reports")}
          />
          <SidebarItem
            href="/admin/deliveries"
            icon={HiTruck}
            className={
              isActive("/admin/deliveries") || isActive("/admin/deliveries/add")
                ? "bg-gray-100 dark:bg-gray-700"
                : ""
            }
            onClick={() => navigate("/admin/deliveries")}
          />
        </SidebarItemGroup>
      </Sidebar>

      {/* Expanded Sidebar - Show on hover or when opened */}
      {shouldShowExpanded && (
        <div className="absolute top-0 left-16 h-full w-64 border-r bg-white px-2 py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <Sidebar
            aria-label="Admin sidebar with navigation"
            className="h-full w-full [&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col py-3">
              <form className="pb-3 md:hidden">
                <TextInput
                  icon={HiSearch}
                  type="search"
                  placeholder="Search admin..."
                  required
                  size={32}
                />
              </form>
              <SidebarItems className="[&_*]:font-medium">
                <SidebarItemGroup>
                  <SidebarItem
                    href="/admin"
                    icon={HiHome}
                    className={
                      isActive("/admin") ? "bg-gray-100 dark:bg-gray-700" : ""
                    }
                    onClick={() => navigate("/admin")}
                  >
                    Dashboard
                  </SidebarItem>
                  <SidebarItem
                    href="/admin/landing"
                    icon={HiChartPie}
                    className={
                      isActive("/admin/landing")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/admin/landing")}
                  >
                    Landing Page
                  </SidebarItem>

                  <SidebarCollapse label="Dostawy" icon={HiTruck}>
                    <SidebarItem
                      href="/admin/deliveries/add"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/deliveries/add")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/deliveries/add")}
                    >
                      <div className="flex items-center">
                        <HiPlus className="mr-2 h-4 w-4" />
                        Dodaj Dostawę
                      </div>
                    </SidebarItem>
                    <SidebarItem
                      href="/admin/deliveries"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/deliveries")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/deliveries")}
                    >
                      Wszystkie Dostawy
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse label="E-commerce" icon={HiShoppingCart}>
                    <SidebarItem
                      href="/admin/products"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/products")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/products")}
                    >
                      Products
                    </SidebarItem>
                    <SidebarItem
                      href="/admin/orders"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/orders")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/orders")}
                    >
                      Orders
                    </SidebarItem>
                    <SidebarItem
                      href="/admin/customers"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/customers")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/customers")}
                    >
                      Customers
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse label="Advanced Tables" icon={HiTable}>
                    <SidebarItem
                      href="/admin/tables"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/tables")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/tables")}
                    >
                      All Tables
                    </SidebarItem>
                    <SidebarItem
                      href="/admin/tables/default"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/tables/default")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/tables/default")}
                    >
                      Default Table
                    </SidebarItem>
                    <SidebarItem
                      href="/admin/tables/comparison"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/tables/comparison")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/tables/comparison")}
                    >
                      Comparison
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse label="Zarządzanie" icon={HiCog}>
                    <SidebarItem
                      href="/admin/users"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/users")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/users")}
                    >
                      Zarządzanie Użytkownikami
                    </SidebarItem>
                    <SidebarItem
                      href="/admin/staff"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/staff")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/staff")}
                    >
                      Zarządzanie Personelem
                    </SidebarItem>
                    <SidebarItem
                      href="/admin/suppliers"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/admin/suppliers")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/admin/suppliers")}
                    >
                      Zarządzanie Dostawcami
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarItem
                    href="/admin/reports"
                    icon={HiDocumentReport}
                    className={
                      isActive("/admin/reports")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/admin/reports")}
                  >
                    Raporty
                  </SidebarItem>
                </SidebarItemGroup>

                <SidebarItemGroup>
                  <SidebarItem
                    href="/admin/settings"
                    icon={HiCog}
                    className={
                      isActive("/admin/settings")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/admin/settings")}
                  >
                    Ustawienia Systemu
                  </SidebarItem>
                  <SidebarItem
                    href="/admin/database"
                    icon={HiDatabase}
                    className={
                      isActive("/admin/database")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/admin/database")}
                  >
                    Baza Danych
                  </SidebarItem>
                </SidebarItemGroup>
              </SidebarItems>
            </div>
          </Sidebar>
        </div>
      )}
    </div>
  );
};
