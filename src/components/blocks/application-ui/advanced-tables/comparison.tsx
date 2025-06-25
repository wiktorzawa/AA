import {
  Button,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Tooltip,
} from "flowbite-react";

export function AdvancedComparisonTable() {
  return (
    <section className="bg-gray-50 py-3 sm:py-5 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-900">
          <div className="flex flex-col items-start justify-between space-y-3 p-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 dark:bg-gray-800">
            <div className="flex items-center">
              <h5 className="mr-3 font-semibold dark:text-white">
                Compare Products
              </h5>
              <Tooltip content="Selected Xbox Series S, PlayStation 5, and Xbox Series X">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  />
                </svg>
                <span className="sr-only">More info</span>
              </Tooltip>
            </div>
            <div className="flex w-auto shrink-0 flex-row items-center justify-end space-x-3">
              <Button>
                <svg
                  className="mr-2 h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Add new product
              </Button>
              <Button color="gray">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  />
                </svg>
                Reset all
              </Button>
            </div>
          </div>
          <div className="mx-4 border-t dark:mx-0 dark:border-gray-700 dark:bg-gray-800"></div>
          <div className="flex flex-col items-center justify-between space-y-3 p-4 md:flex-row md:space-y-0 md:space-x-4 dark:bg-gray-800">
            <ul className="hidden flex-wrap text-center text-sm font-medium text-gray-500 md:flex dark:text-gray-400">
              <li className="mr-4">
                <Button color="gray" pill>
                  General Information
                </Button>
              </li>
              <li className="mr-4">
                <Button pill>Technical Information</Button>
              </li>
              <li className="mr-4">
                <Button color="gray" pill>
                  Delivery Information
                </Button>
              </li>
              <li className="mr-4">
                <Button color="gray" pill>
                  Ratings
                </Button>
              </li>
            </ul>
            <Select
              id="list-navigation"
              name="list-navigation"
              className="w-full md:hidden"
            >
              <option selected>Overview</option>
              <option value="general">General Information</option>
              <option value="technical">Technical Information</option>
              <option value="delivery">Delivery Information</option>
              <option value="ratings">Ratings</option>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <TableHead className="text-xs text-gray-900 dark:text-white">
                <TableRow>
                  <TableHeadCell
                    scope="col"
                    className="px-4 py-3 dark:bg-transparent"
                  />
                  <TableHeadCell
                    scope="col"
                    className="px-4 py-3 dark:bg-transparent"
                  >
                    <div className="text-lg">
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/xbox-series-s.png"
                        alt="iMac Front"
                        className="h-32 w-auto"
                      />
                      <div className="mt-4">Xbox Series S</div>
                    </div>
                  </TableHeadCell>
                  <TableHeadCell
                    scope="col"
                    className="px-4 py-3 dark:bg-transparent"
                  >
                    <div className="text-lg">
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/playstation-5.png"
                        alt="iMac Front"
                        className="h-32 w-auto"
                      />
                      <div className="mt-4">PlayStation 5</div>
                    </div>
                  </TableHeadCell>
                  <TableHeadCell
                    scope="col"
                    className="px-4 py-3 dark:bg-transparent"
                  >
                    <div className="text-lg">
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/xbox-series-x.png"
                        alt="iMac Front"
                        className="h-32 w-auto"
                      />
                      <div className="mt-4">Xbox Series X</div>
                    </div>
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <TableCell
                    colSpan={4}
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    General Information
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Brand
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Microsoft
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Sony
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Microsoft
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Product Name
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Xbox Series S
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    PlayStation 5
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Xbox Series X
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Colors
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    White
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    White/Black
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Black
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Category
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Gaming/Console
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Gaming/Console
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Gaming/Console
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Price
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    $499
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    $599
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    $299
                  </TableCell>
                </TableRow>
                <TableRow className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <TableCell
                    colSpan={4}
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    Technical Information
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Platform
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Xbox Series S
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    PlayStation 5 Digital Edition
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Xbox Series X
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    RAM
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    16GB GDDR6
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    16GB GDDR6
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    16GB GDDR
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    CPU
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    8-core, 3.6 GHz AMD Zen 2
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    8-core 3.5 GHz AMD Zen 2
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    8-core 3.8 GHz AMD Zen 2
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    GPU
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    4 teraflop AMD RDNA 2
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    10.3 teraflop AMD RDNA 2
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    12 teraflop AMD RDNA 2
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Storage
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    512 GB custom NVMe SSD
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    825 GB custom SSD
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    1 TB custom SSD
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Resolution
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Up to 2K
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Up to 8K
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Up to 8K
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Frame Rate
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Up to 120 fps
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Up to 120 fps
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Up to 120 fps
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Optical Drive
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    ConTableRowoller
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    1
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    1
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    1
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Web Connection
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Ethernet/Wi-Fi
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Ethernet/Wi-Fi
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Ethernet/Wi-Fi
                  </TableCell>
                </TableRow>
                <TableRow className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <TableCell
                    colSpan={4}
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    Delivery
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    CounTableRowy
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Worldwide
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Worldwide
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Worldwide
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-600">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Duration
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    5-10 Days
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    30 Days
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    30 Days
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Tax
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    2.5%
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    2.5%
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    2.5%
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-normal whitespace-nowrap"
                  >
                    Tax
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    2.5%
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    2.5%
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    2.5%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row" className="px-4 py-3" />
                  <TableCell className="px-4 py-6 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5"
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      Add to cart
                    </Button>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5"
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      Add to cart
                    </Button>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Button>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5"
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      Add to cart
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
}
