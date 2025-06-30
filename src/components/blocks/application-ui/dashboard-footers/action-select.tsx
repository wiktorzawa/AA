import { Button, Dropdown, DropdownItem, theme } from "flowbite-react";
import { twMerge } from "tailwind-merge";

export function FooterWithActionSelect() {
  return (
    <footer className="flex items-center justify-between rounded-lg bg-white p-4 shadow md:p-6 xl:p-8 dark:bg-gray-800">
      <div className="flex items-center space-x-3">
        <p className="text-gray-500 xl:text-center dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">
            1/150
          </span>
          &nbsp;items selected
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <Dropdown
          color="gray"
          label="Select action"
          outline
          theme={{
            floating: {
              target: twMerge(
                theme.dropdown.floating.target,
                "hover:text-primary-700 border-gray-200 bg-white whitespace-nowrap text-gray-900 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-200 focus:outline-none dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 [&>span]:text-xs dark:[&>span]:bg-gray-800 dark:[&>span]:text-gray-400",
              ),
            },
          }}
        >
          <DropdownItem>Select All</DropdownItem>
          <DropdownItem>Archive</DropdownItem>
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </Dropdown>
        <Button className="[&>span]:text-xs">Apply</Button>
      </div>
    </footer>
  );
}
