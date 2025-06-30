import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { SupplierSidebar } from "@/components/sidebar/SupplierSidebar";
import { DashboardNavbar } from "@/components/navbar/DashboardNavbar";

export const SupplierLayout: FC<PropsWithChildren> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarHoverChange = (isHovered: boolean) => {
    setIsSidebarHovered(isHovered);
  };

  // Określ czy sidebar zajmuje pełną szerokość (280px) czy wąską (64px)
  const sidebarIsExpanded =
    isSidebarOpen || (!isSidebarOpen && isSidebarHovered);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SupplierSidebar
        isOpen={isSidebarOpen}
        onHoverChange={handleSidebarHoverChange}
      />
      <DashboardNavbar onToggleSidebar={handleToggleSidebar} />
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarIsExpanded ? "ml-80" : "ml-16"
        } min-h-screen`}
      >
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};
