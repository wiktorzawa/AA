import classNames from "classnames";
import type { FC } from "react";
import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItems,
  SidebarItemGroup,
} from "flowbite-react";
import {
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiArrowSmRight,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

interface DashboardSidebarProps {
  isOpen: boolean;
}

export const DashboardSidebar: FC<DashboardSidebarProps> = ({ isOpen }) => {
  return (
    <div
      className={classNames(
        "fixed top-0 left-0 z-20 h-full -translate-x-full pt-16 transition-transform",
        {
          "translate-x-0": isOpen,
        },
      )}
    >
      <Sidebar
        aria-label="Sidebar with content separator example"
        className="h-full border-r-0"
      >
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem href="#" icon={HiChartPie}>
              Dashboard
            </SidebarItem>
            <SidebarCollapse icon={HiShoppingBag} label="E-commerce">
              <SidebarItem href="#">Products</SidebarItem>
              <SidebarItem href="#">Orders</SidebarItem>
              <SidebarItem href="#">Customers</SidebarItem>
            </SidebarCollapse>
            <SidebarItem href="#" icon={HiInbox}>
              Inbox
            </SidebarItem>
            <SidebarItem href="#" icon={HiUser}>
              Users
            </SidebarItem>
            <SidebarCollapse icon={HiViewBoards} label="Kanban">
              <SidebarItem href="#">Board 1</SidebarItem>
              <SidebarItem href="#">Board 2</SidebarItem>
            </SidebarCollapse>
            <SidebarItem href="#" icon={HiArrowSmRight}>
              Sign In
            </SidebarItem>
            <SidebarItem href="#" icon={HiTable}>
              Sign Up
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>
    </div>
  );
};
