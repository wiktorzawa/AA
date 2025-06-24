import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiShoppingBag,
  HiUsers,
  HiTruck,
  HiCog,
} from "react-icons/hi";

interface AppSidebarProps {
  collapsed?: boolean;
}

interface NavItem {
  href: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  roles: ("admin" | "staff" | "supplier")[];
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    href: "/admin/dashboard",
    icon: HiChartPie,
    label: "Dashboard",
    roles: ["admin"],
  },
  {
    href: "/staff/dashboard",
    icon: HiChartPie,
    label: "Dashboard",
    roles: ["staff"],
  },
  {
    href: "/supplier/dashboard",
    icon: HiChartPie,
    label: "Dashboard",
    roles: ["supplier"],
  },
  {
    href: "#",
    icon: HiShoppingBag,
    label: "E-commerce",
    roles: ["admin", "staff"],
    children: [
      {
        href: "/products",
        icon: HiShoppingBag,
        label: "Products",
        roles: ["admin", "staff"],
      },
      {
        href: "/orders",
        icon: HiClipboard,
        label: "Orders",
        roles: ["admin", "staff"],
      },
    ],
  },
  { href: "/users", icon: HiUsers, label: "Users", roles: ["admin"] },
  {
    href: "/deliveries",
    icon: HiTruck,
    label: "Deliveries",
    roles: ["supplier"],
  },
  {
    href: "#",
    icon: HiCog,
    label: "Settings",
    roles: ["admin"],
    children: [
      {
        href: "/settings/general",
        icon: HiCog,
        label: "General",
        roles: ["admin"],
      },
      {
        href: "/settings/users",
        icon: HiUsers,
        label: "User Management",
        roles: ["admin"],
      },
    ],
  },
  {
    href: "/help",
    icon: HiInformationCircle,
    label: "Help",
    roles: ["admin", "staff", "supplier"],
  },
];

export const AppSidebar: FC<AppSidebarProps> = ({ collapsed }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // We need to check for the role on the client side
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const filteredNavItems = userRole
    ? navItems.filter((item) => item.roles.includes(userRole as any))
    : [];

  return (
    <Sidebar collapsed={collapsed}>
      <SidebarItems>
        <SidebarItemGroup>
          {filteredNavItems.map((item) =>
            item.children ? (
              <SidebarCollapse
                key={item.label}
                icon={item.icon}
                label={item.label}
              >
                {item.children.map((child) => (
                  <SidebarItem
                    key={child.label}
                    href={child.href}
                    icon={child.icon}
                  >
                    {child.label}
                  </SidebarItem>
                ))}
              </SidebarCollapse>
            ) : (
              <SidebarItem key={item.label} href={item.href} icon={item.icon}>
                {item.label}
              </SidebarItem>
            ),
          )}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};
