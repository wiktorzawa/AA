import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";
import { useEffect } from "react";
import { DashboardNavbar } from "@/components/sidebar/navbar/DashboardNavbar";
import AppSidebar from "@components/sidebar/AppSidebar";
import { useUIStore } from "@/stores/uiStore";

import { Outlet } from "react-router-dom";

interface DashboardLayoutProps extends PropsWithChildren {
  userRole?: "admin" | "staff" | "supplier";
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, userRole }) => {
  // Pobieraj każdą wartość/funkcję osobno, by uniknąć niepotrzebnych rerenderów
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const openSidebar = useUIStore((state) => state.openSidebar);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  // Inicjalizacja stanu sidebara na podstawie rozmiaru okna
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 768) {
        openSidebar();
      } else {
        closeSidebar();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DashboardNavbar onToggleSidebar={openSidebar} />
      <div className="flex items-start pt-16">
        <div
          className={classNames(
            "transition-width fixed top-0 left-0 z-30 h-screen shrink-0 border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900",
            isSidebarOpen ? "block w-64" : "hidden w-16 lg:block",
          )}
        >
          <div className="flex h-full flex-col justify-between pt-16">
            <AppSidebar userRole={userRole} />
          </div>
        </div>
        <main
          className={classNames(
            "relative h-screen flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800",
            {
              "lg:ml-64": isSidebarOpen,
              "lg:ml-16": !isSidebarOpen,
            },
          )}
        >
          {children || <Outlet />}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
