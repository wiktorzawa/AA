import type { FC } from "react";
import {
  Avatar,
  DarkThemeToggle,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  TextInput,
} from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { HiBars3 } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface DashboardNavbarProps {
  onToggleSidebar: () => void;
}

export const DashboardNavbar: FC<DashboardNavbarProps> = ({
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = async () => {
    logout();
    navigate("/authentication/sign-in");
  };

  const getLogoText = () => {
    switch (user?.rola_uzytkownika) {
      case "admin":
        return "MsBox_admin";
      case "supplier":
        return "MsBox_dostawca";
      case "staff":
        return "MsBox_pracownik";
      default:
        return "MS-BOX";
    }
  };

  const getLogoHref = () => {
    switch (user?.rola_uzytkownika) {
      case "admin":
        return "/admin";
      case "supplier":
        return "/supplier/dashboard";
      case "staff":
        return "/staff/dashboard";
      default:
        return "/";
    }
  };

  return (
    <Navbar fluid className="fixed top-0 right-0 left-0 z-50 shadow-none">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-gray-200 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600"
          type="button"
          aria-label="Toggle sidebar"
        >
          <HiBars3 className="h-5 w-5" />
        </button>
        <NavbarBrand href={getLogoHref()}>
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            {getLogoText()}
          </span>
        </NavbarBrand>
        <form className="ml-16 hidden md:block">
          <TextInput
            icon={HiSearch}
            id="search"
            name="search"
            placeholder="Search"
            required
            size={32}
            type="search"
          />
        </form>
      </div>
      <div className="flex items-center gap-3">
        <DarkThemeToggle />
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <DropdownHeader>
            <span className="block text-sm dark:text-gray-300">Użytkownik</span>
            <span className="block truncate text-sm font-medium dark:text-white">
              {user?.adres_email || "brak danych"}
            </span>
          </DropdownHeader>
          <DropdownItem className="dark:text-white">Dashboard</DropdownItem>
          <DropdownItem className="dark:text-white">Settings</DropdownItem>
          <DropdownItem className="dark:text-white">Earnings</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={handleSignOut} className="dark:text-white">
            Wyloguj
          </DropdownItem>
        </Dropdown>
      </div>
    </Navbar>
  );
};
