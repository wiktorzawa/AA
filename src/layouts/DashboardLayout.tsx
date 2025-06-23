import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { DashboardSidebar } from "../components/sidebar/DashboardSidebar";
import { DashboardNavbar } from "../components/navbar/DashboardNavbar";

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <DashboardNavbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex items-start pt-16">
        <DashboardSidebar isOpen={isSidebarOpen} />
        <main
          className={classNames(
            "relative h-screen w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900",
            {
              "lg:ml-64": isSidebarOpen,
            },
          )}
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
