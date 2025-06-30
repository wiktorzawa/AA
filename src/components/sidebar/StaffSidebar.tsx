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
  HiClipboardList,
  HiTruck,
  HiChartBar,
  HiUser,
  HiCog,
  HiPlus,
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";

interface StaffSidebarProps {
  isOpen?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

export const StaffSidebar: FC<StaffSidebarProps> = ({
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
              onClick={() => navigate("/staff")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/staff");
                }
              }}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
                <span className="text-sm font-bold">S</span>
              </div>
            </div>
          </div>
          <SidebarItem
            href="/staff"
            icon={HiHome}
            className={isActive("/staff") ? "bg-gray-100 dark:bg-gray-700" : ""}
            onClick={() => navigate("/staff")}
          />
          <SidebarItem
            href="/staff/tasks"
            icon={HiClipboardList}
            className={
              isActive("/staff/tasks") ? "bg-gray-100 dark:bg-gray-700" : ""
            }
            onClick={() => navigate("/staff/tasks")}
          />
          <SidebarItem
            href="/staff/deliveries"
            icon={HiTruck}
            className={
              isActive("/staff/deliveries") || isActive("/staff/deliveries/add")
                ? "bg-gray-100 dark:bg-gray-700"
                : ""
            }
            onClick={() => navigate("/staff/deliveries")}
          />
          <SidebarItem
            href="/staff/orders"
            icon={HiTruck}
            className={
              isActive("/staff/orders") ? "bg-gray-100 dark:bg-gray-700" : ""
            }
            onClick={() => navigate("/staff/orders")}
          />
          <SidebarItem
            href="/staff/reports"
            icon={HiChartBar}
            className={
              isActive("/staff/reports") ? "bg-gray-100 dark:bg-gray-700" : ""
            }
            onClick={() => navigate("/staff/reports")}
          />
          <SidebarItem
            href="/staff/profile"
            icon={HiUser}
            className={
              isActive("/staff/profile") ? "bg-gray-100 dark:bg-gray-700" : ""
            }
            onClick={() => navigate("/staff/profile")}
          />
        </SidebarItemGroup>
      </Sidebar>

      {/* Expanded Sidebar - Show on hover or when opened */}
      {shouldShowExpanded && (
        <div className="absolute top-0 left-16 h-full w-64 border-r bg-white px-2 py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <Sidebar
            aria-label="Staff sidebar with navigation"
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
                    href="/staff"
                    icon={HiHome}
                    className={
                      isActive("/staff") ? "bg-gray-100 dark:bg-gray-700" : ""
                    }
                    onClick={() => navigate("/staff")}
                  >
                    Dashboard
                  </SidebarItem>

                  <SidebarCollapse label="Dostawy" icon={HiTruck}>
                    <SidebarItem
                      href="/staff/deliveries/add"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/staff/deliveries/add")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/staff/deliveries/add")}
                    >
                      <div className="flex items-center">
                        <HiPlus className="mr-2 h-4 w-4" />
                        Dodaj Dostawę
                      </div>
                    </SidebarItem>
                    <SidebarItem
                      href="/staff/deliveries"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/staff/deliveries")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/staff/deliveries")}
                    >
                      Wszystkie Dostawy
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse label="Zadania" icon={HiClipboardList}>
                    <SidebarItem
                      href="/staff/tasks"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/staff/tasks")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/staff/tasks")}
                    >
                      Wszystkie Zadania
                    </SidebarItem>
                    <SidebarItem
                      href="/staff/tasks/assigned"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/staff/tasks/assigned")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/staff/tasks/assigned")}
                    >
                      Przypisane do Mnie
                    </SidebarItem>
                    <SidebarItem
                      href="/staff/tasks/completed"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/staff/tasks/completed")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/staff/tasks/completed")}
                    >
                      Ukończone
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarCollapse label="Zamówienia" icon={HiTruck}>
                    <SidebarItem
                      href="/staff/orders"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/staff/orders")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/staff/orders")}
                    >
                      Wszystkie Zamówienia
                    </SidebarItem>
                    <SidebarItem
                      href="/staff/orders/processing"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/staff/orders/processing")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/staff/orders/processing")}
                    >
                      W Realizacji
                    </SidebarItem>
                    <SidebarItem
                      href="/staff/orders/shipped"
                      className={twMerge(
                        "pl-0 [&>span]:pl-12",
                        isActive("/staff/orders/shipped")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "",
                      )}
                      onClick={() => navigate("/staff/orders/shipped")}
                    >
                      Wysłane
                    </SidebarItem>
                  </SidebarCollapse>

                  <SidebarItem
                    href="/staff/reports"
                    icon={HiChartBar}
                    className={
                      isActive("/staff/reports")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/staff/reports")}
                  >
                    Raporty
                  </SidebarItem>
                </SidebarItemGroup>

                <SidebarItemGroup>
                  <SidebarItem
                    href="/staff/profile"
                    icon={HiUser}
                    className={
                      isActive("/staff/profile")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/staff/profile")}
                  >
                    Mój Profil
                  </SidebarItem>
                  <SidebarItem
                    href="/staff/settings"
                    icon={HiCog}
                    className={
                      isActive("/staff/settings")
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                    onClick={() => navigate("/staff/settings")}
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
