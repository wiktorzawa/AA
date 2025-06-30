import { Button } from "flowbite-react";
import { HiUserAdd } from "react-icons/hi";

export function TableHeaderWithTextAndButton() {
  return (
    <section className="flex items-center bg-gray-50 py-6 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl px-4 lg:px-12">
        <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
          <div className="flex-row items-center justify-between space-y-3 p-4 sm:flex sm:space-y-0 sm:space-x-4">
            <div>
              <h5 className="mr-3 font-semibold dark:text-white">
                Flowbite Users
              </h5>
              <p className="text-gray-500 dark:text-gray-400">
                Manage all your existing users or add a new one
              </p>
            </div>
            <Button>
              <HiUserAdd className="mr-2 -ml-1 h-3.5 w-3.5" />
              Add new user
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
