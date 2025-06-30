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
  HiHome,
  HiSearch,
  HiTruck,
  HiShoppingCart,
  HiDocumentText,
  HiChartBar,
  HiUser,
  HiCog,
  HiCash,
  HiPlus,
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";

interface SupplierSidebarProps {
  isOpen?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

export const SupplierSidebar: FC<SupplierSidebarProps> = ({
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
              onClick={() => navigate("/supplier")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/supplier");
                }
              }}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
                <span className="text-sm font-bold">D</span>
              </div>
            </div>
          </div>
          <SidebarItem
            href="/supplier"
            icon={HiHome}
            className={
              isActive("/supplier") ? "bg-gray-100 dark:bg-gray-700" : ""
            }
            onClick={() => navigate("/supplier")}
          />
          <SidebarItem
            href="/supplier/deliveries"
            icon={HiTruck}
            className={
              isActive("/supplier/deliveries")
                ? "bg-gray-100 dark:bg-gray-700"
                : ""
            }
            onClick={() => navigate("/supplier/deliveries")}
          />
          <SidebarItem
            href="/supplier/products"
            icon={HiShoppingCart}
            className={
              isActive("/supplier/products")
                ? "bg-gray-100 dark:bg-gray-700"
                : ""
            }
            onClick={() => navigate("/supplier/products")}
          />
          <SidebarItem
            href="/supplier/orders"
            icon={HiDocumentText}
            className={
              isActive("/supplier/orders") ? "bg-gray-100 dark:bg-gray-700" : ""
            }
            onClick={() => navigate("/supplier/orders")}
          />
          <SidebarItem
            href="/supplier/reports"
            icon={HiChartBar}
            className={
              isActive("/supplier/reports")
                ? "bg-gray-100 dark:bg-gray-700"
                : ""
            }
            onClick={() => navigate("/supplier/reports")}
          />
        </SidebarItemGroup>
      </Sidebar>

      {/* Expanded Sidebar - Show on hover or when opened */}
      {shouldShowExpanded && (
        <div className="absolute top-0 left-16 h-full w-64 border-r bg-white px-2 py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <Sidebar
            aria-label="Supplier sidebar with navigation"
            className="h-full w-full [&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col py-3">
              <form className="pb-3 md:hidden">
                <TextInput
                  icon={HiSearch}
                  type="search"
                  placeholder="Szukaj..."
                  required
                  size={32}
                />
              </form>
              <SidebarItems className="[&_*]:font-medium">
                <SidebarItemGroup>
                  <SidebarItem
                    href="/supplier"
                    icon={HiHome}
                    className={
                      isActive("/supplier")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/supplier")}
                  >
                    Dashboard
                  </SidebarItem>

                  <SidebarCollapse label="Dostawy" icon={HiTruck}>
                    <SidebarItem
                      href="/supplier/deliveries/add"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/supplier/deliveries/add")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/supplier/deliveries/add")}
                    >
                      <div className="flex items-center">
                        <HiPlus className="mr-2 h-4 w-4" />
                        Dodaj Dostawę
                      </div>
                    </SidebarItem>
                    <SidebarItem
                      href="/supplier/deliveries"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/supplier/deliveries")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/supplier/deliveries")}
                    >
                      Wszystkie Dostawy
                    </SidebarItem>
                    <SidebarItem
                      href="/supplier/deliveries/pending"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/supplier/deliveries/pending")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/supplier/deliveries/pending")}
                    >
                      Oczekujące
                    </SidebarItem>
                    <SidebarItem
                      href="/supplier/deliveries/completed"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/supplier/deliveries/completed")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/supplier/deliveries/completed")}
                    >
                      Zrealizowane
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse label="Produkty" icon={HiShoppingCart}>
                    <SidebarItem
                      href="/supplier/products"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/supplier/products")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/supplier/products")}
                    >
                      Katalog Produktów
                    </SidebarItem>
                    <SidebarItem
                      href="/supplier/products/inventory"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/supplier/products/inventory")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/supplier/products/inventory")}
                    >
                      Stan Magazynowy
                    </SidebarItem>
                    <SidebarItem
                      href="/supplier/products/pricing"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/supplier/products/pricing")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/supplier/products/pricing")}
                    >
                      Cennik
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse label="Zamówienia" icon={HiDocumentText}>
                    <SidebarItem
                      href="/supplier/orders"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/supplier/orders")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/supplier/orders")}
                    >
                      Wszystkie Zamówienia
                    </SidebarItem>
                    <SidebarItem
                      href="/supplier/orders/new"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/supplier/orders/new")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/supplier/orders/new")}
                    >
                      Nowe Zamówienia
                    </SidebarItem>
                    <SidebarItem
                      href="/supplier/orders/processing"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/supplier/orders/processing")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/supplier/orders/processing")}
                    >
                      W Realizacji
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarItem
                    href="/supplier/reports"
                    icon={HiChartBar}
                    className={
                      isActive("/supplier/reports")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/supplier/reports")}
                  >
                    Raporty
                  </SidebarItem>
                </SidebarItemGroup>

                <SidebarItemGroup>
                  <SidebarItem
                    href="/supplier/payments"
                    icon={HiCash}
                    className={
                      isActive("/supplier/payments")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/supplier/payments")}
                  >
                    Płatności
                  </SidebarItem>
                  <SidebarItem
                    href="/supplier/profile"
                    icon={HiUser}
                    className={
                      isActive("/supplier/profile")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/supplier/profile")}
                  >
                    Mój Profil
                  </SidebarItem>
                  <SidebarItem
                    href="/supplier/settings"
                    icon={HiCog}
                    className={
                      isActive("/supplier/settings")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/supplier/settings")}
                  >
                    Ustawienia
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
