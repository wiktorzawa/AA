import type { FC } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  TextInput,
} from "flowbite-react";
import { HiMenuAlt1, HiSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface DashboardNavbarProps {
  onToggleSidebar: () => void;
}

export const DashboardNavbar: FC<DashboardNavbarProps> = ({
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("username");
    setUserRole(role);
    setUsername(email);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/authentication/sign-in");
  };

  const getLogoText = () => {
    switch (userRole) {
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

  return (
    <Navbar fluid className="fixed top-0 right-0 left-0 z-30 shadow-none">
      <div className="flex items-center">
        <Button
          className="mr-3 cursor-pointer rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Toggle sidebar</span>
          <HiMenuAlt1 className="h-6 w-6" />
        </Button>
        <NavbarBrand href="/">
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
      <div className="flex items-center">
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
            <span className="block text-sm">Użytkownik</span>
            <span className="block truncate text-sm font-medium">
              {username || "brak danych"}
            </span>
          </DropdownHeader>
          <DropdownItem>Dashboard</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem>Earnings</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={handleSignOut}>Wyloguj</DropdownItem>
        </Dropdown>
      </div>
    </Navbar>
  );
};
