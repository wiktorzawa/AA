import { Button, ButtonGroup } from "flowbite-react";
import { HiPlus } from "react-icons/hi";

export function TableHeaderWithCTAAndButtonGroup() {
  return (
    <section className="flex items-center bg-gray-50 py-6 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl px-4 lg:px-12">
        <div className="relative overflow-hidden bg-white shadow-md md:rounded-lg dark:bg-gray-800">
          <div className="flex flex-col items-center justify-between space-y-3 p-4 md:flex-row md:space-y-0 md:space-x-4">
            <Button className="w-full md:w-fit">
              <HiPlus className="mr-2 -ml-1 h-3.5 w-3.5" />
              Add product
            </Button>
            <ButtonGroup className="w-full flex-col md:w-auto md:flex-row">
              <Button
                color="gray"
                className="rounded-tr-lg rounded-b-none md:rounded-r-none md:rounded-b-lg dark:bg-gray-700 dark:text-white dark:enabled:hover:bg-gray-600"
              >
                Positions
              </Button>
              <Button
                color="gray"
                className="border-l md:border-l-0 dark:bg-gray-700 dark:text-white dark:enabled:hover:bg-gray-600"
              >
                Estimated Traffic
              </Button>
              <Button
                color="gray"
                className="border-l md:border-l-0 dark:bg-gray-700 dark:text-white dark:enabled:hover:bg-gray-600"
              >
                Visibility
              </Button>
              <Button
                color="gray"
                className="rounded-t-none rounded-bl-lg border-l md:rounded-tr-lg md:rounded-bl-none dark:bg-gray-700 dark:text-white dark:enabled:hover:bg-gray-600"
              >
                All for flowbite.com
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
