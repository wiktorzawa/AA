import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { DashboardNavbar } from "@components/navbar/DashboardNavbar";
import AppSidebar from "@components/sidebar/AppSidebar";
import isBrowser from "@/helpers/is-browser";
import { Outlet } from "react-router-dom";

interface DashboardLayoutProps extends PropsWithChildren {
  userRole?: "admin" | "staff" | "supplier";
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, userRole }) => {
  const [isOpen, setOpen] = useState(isBrowser() && window.innerWidth >= 768);

  return (
    <>
      <DashboardNavbar onToggleSidebar={() => setOpen(!isOpen)} />
      <div className="flex items-start pt-16">
        <div
          className={classNames(
            "transition-width fixed top-0 left-0 z-30 h-screen shrink-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
            isOpen ? "block w-64" : "hidden w-16 lg:block",
          )}
        >
          <div className="flex h-full flex-col justify-between pt-16">
            <AppSidebar userRole={userRole} />
          </div>
        </div>
        <main
          className={classNames(
            "relative h-screen flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900",
            {
              "lg:ml-64": isOpen,
              "lg:ml-16": !isOpen,
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
