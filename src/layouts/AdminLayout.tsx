import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { DashboardNavbar } from "@/components/navbar/DashboardNavbar";

export const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar isOpen={isSidebarOpen} />
      <DashboardNavbar onToggleSidebar={handleToggleSidebar} />
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? "ml-80" : "ml-16"
        } min-h-screen`}
      >
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};
