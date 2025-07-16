import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { DashboardNavbar } from "@/components/sidebar/navbar/DashboardNavbar";

export const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSidebarHoverChange = (isHovered: boolean) => {
    setIsSidebarHovered(isHovered);
  };

  const sidebarIsExpanded =
    isSidebarOpen || (!isSidebarOpen && isSidebarHovered);

  return (
    <div className="min-h-screen">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onHoverChange={handleSidebarHoverChange}
      />
      <DashboardNavbar onToggleSidebar={handleToggleSidebar} />
      <main
        className={`${
          sidebarIsExpanded ? "lg:ml-80" : "lg:ml-16"
        } min-h-screen bg-gray-50 p-4 pt-16 transition-all duration-300 dark:bg-gray-900`}
      >
        {children}
      </main>
    </div>
  );
};
