import { Button } from "flowbite-react";

export function TableFooterWithStatistics() {
  return (
    <section className="flex items-center bg-gray-50 py-6 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl px-4 lg:px-12">
        <div className="relative overflow-hidden rounded-b-lg bg-white shadow-md dark:bg-gray-800">
          <nav
            aria-label="Table navigation"
            className="flex flex-col items-start justify-between space-y-3 px-4 pt-3 pb-4 md:flex-row md:items-center md:space-y-0"
          >
            <div className="flex items-center space-x-5 text-sm">
              <div>
                <div className="mb-1 text-gray-500 dark:text-gray-400">
                  Purchase price
                </div>
                <div className="font-medium dark:text-white">$ 3,567,890</div>
              </div>
              <div>
                <div className="mb-1 text-gray-500 dark:text-gray-400">
                  Total selling price
                </div>
                <div className="font-medium dark:text-white">$ 8,489,400</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-primary-700 hover:text-primary-800 focus:ring-primary-300 dark:text-primary-500 dark:hover:text-primary-600 dark:focus:ring-primary-800 flex items-center rounded-lg py-1.5 text-center text-sm font-medium focus:ring-4 focus:outline-none">
                Print barcodes
              </button>
              <button className="text-primary-700 hover:text-primary-800 focus:ring-primary-300 dark:text-primary-500 dark:hover:text-primary-600 dark:focus:ring-primary-800 flex items-center rounded-lg py-1.5 text-center text-sm font-medium focus:ring-4 focus:outline-none">
                Duplicate
              </button>
              <Button className="[&>span]:px-2.5 [&>span]:text-xs">
                Export CSV
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
