import {
  Badge,
  Button,
  Checkbox,
  Label,
  Pagination,
  Rating,
  RatingStar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  theme,
} from "flowbite-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export function AdvancedTableWithProducts() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="bg-gray-50 py-3 sm:py-5 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-12">
        <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
          <div className="flex flex-col space-y-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div className="flex flex-1 items-center space-x-4">
              <h5>
                <span className="text-gray-500">All Products:&nbsp;</span>
                <span className="dark:text-white">123456</span>
              </h5>
              <h5>
                <span className="text-gray-500">Total sales:&nbsp;</span>
                <span className="dark:text-white">$88.4k</span>
              </h5>
            </div>
            <div className="flex shrink-0 flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3 lg:justify-end">
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
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Update stocks 1/250
              </Button>
              <Button color="gray">
                <svg
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Export
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table className="[&_*]:whitespace-nowrap">
              <TableHead>
                <TableRow>
                  <TableHeadCell
                    scope="col"
                    className="p-4 group-first/head:first:rounded-tl-none"
                  >
                    <div className="flex items-center">
                      <Checkbox id="checkbox-all" name="checkbox-all" />
                      <Label htmlFor="checkbox-all" className="sr-only">
                        Select all
                      </Label>
                    </div>
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Product
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Category
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Stock
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Sales/Day
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Sales/Month
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Rating
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Sales
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Revenue
                  </TableHeadCell>
                  <TableHeadCell
                    scope="col"
                    className="p-4 group-first/head:last:rounded-tr-none"
                  >
                    Last Update
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  <TableCell className="w-4 px-4 py-3">
                    <div className="flex items-center">
                      <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <Label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        Select this product
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png"
                      alt=""
                      className="mr-3 h-8 w-auto"
                    />
                    Apple iMac 27&#34;
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="w-fit">Desktop PC</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="mr-2 inline-block h-4 w-4 rounded-full bg-red-700"></div>
                      95
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    1.47
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    0.47
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Rating>
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        5.0
                      </p>
                    </Rating>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      1.6M
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">$3.2M</TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Just now
                  </TableCell>
                </TableRow>
                <TableRow className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  <TableCell className="w-4 px-4 py-3">
                    <div className="flex items-center">
                      <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <Label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        Select this product
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png"
                      alt=""
                      className="mr-3 h-8 w-auto"
                    />
                    Apple iMac 20&quot;
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="w-fit">Desktop PC</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="mr-2 inline-block h-4 w-4 rounded-full bg-red-700"></div>
                      108
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    1.15
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    0.32
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Rating>
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        5.0
                      </p>
                    </Rating>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      6M
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">$785K</TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    This week
                  </TableCell>
                </TableRow>
                <TableRow className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  <TableCell className="w-4 px-4 py-3">
                    <div className="flex items-center">
                      <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <Label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        Select this product
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/apple-iphone-14.png"
                      alt=""
                      className="mr-3 h-8 w-auto"
                    />
                    Apple iPhone 14
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="w-fit">Phone</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="mr-2 inline-block h-4 w-4 rounded-full bg-green-400"></div>
                      24
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    1.00
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    0.99
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Rating>
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar filled={false} />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        4.0
                      </p>
                    </Rating>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      1.2M
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">$3.2M</TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Just now
                  </TableCell>
                </TableRow>
                <TableRow className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  <TableCell className="w-4 px-4 py-3">
                    <div className="flex items-center">
                      <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <Label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        Select this product
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/apple-ipad-air.png"
                      alt=""
                      className="mr-3 h-8 w-auto"
                    />
                    Apple iPad Air
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="w-fit">Tablet</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="mr-2 inline-block h-4 w-4 rounded-full bg-red-700"></div>
                      287
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    0.47
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    1.00
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Rating>
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar filled={false} />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        4.0
                      </p>
                    </Rating>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      298K
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">$425K</TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Just now
                  </TableCell>
                </TableRow>
                <TableRow className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  <TableCell className="w-4 px-4 py-3">
                    <div className="flex items-center">
                      <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <Label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        Select this product
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/xbox-series-s.png"
                      alt=""
                      className="mr-3 h-8 w-auto"
                    />
                    Xbox Series S
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="w-fit">Gaming/Console</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="mr-2 inline-block h-4 w-4 rounded-full bg-yellow-300"></div>
                      450
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    1.61
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    0.30
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Rating>
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        5.0
                      </p>
                    </Rating>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      99
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">$345K</TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    This week
                  </TableCell>
                </TableRow>
                <TableRow className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  <TableCell className="w-4 px-4 py-3">
                    <div className="flex items-center">
                      <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <Label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        Select this product
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/playstation-5.png"
                      alt=""
                      className="mr-3 h-8 w-auto"
                    />
                    PlayStation 5
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="w-fit">Gaming/Console</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="mr-2 inline-block h-4 w-4 rounded-full bg-green-400"></div>
                      2435
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    1.41
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    0.11
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Rating>
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar filled={false} />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        4.0
                      </p>
                    </Rating>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      2.1M
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">$4.2M</TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    This week
                  </TableCell>
                </TableRow>
                <TableRow className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  <TableCell className="w-4 px-4 py-3">
                    <div className="flex items-center">
                      <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <Label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        Select this product
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/xbox-series-x.png"
                      alt=""
                      className="mr-3 h-8 w-auto"
                    />
                    Xbox Series X
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="w-fit">Gaming/Console</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="mr-2 inline-block h-4 w-4 rounded-full bg-orange-400"></div>
                      235
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    7.09
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    3.32
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Rating>
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        5.0
                      </p>
                    </Rating>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      989K
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">$2.27M</TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Just now
                  </TableCell>
                </TableRow>
                <TableRow className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  <TableCell className="w-4 px-4 py-3">
                    <div className="flex items-center">
                      <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <Label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        Select this product
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/apple-watch-se.png"
                      alt=""
                      className="mr-3 h-8 w-auto"
                    />
                    Apple Watch SE
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="w-fit">Watch</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="mr-2 inline-block h-4 w-4 rounded-full bg-yellow-300"></div>
                      433
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    4.96
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    0.74
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Rating>
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        5.0
                      </p>
                    </Rating>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      102
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">$45K</TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    2 weeks ago
                  </TableCell>
                </TableRow>
                <TableRow className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  <TableCell className="w-4 px-4 py-3">
                    <div className="flex items-center">
                      <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <Label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        Select this product
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/nikon-d850.png"
                      alt=""
                      className="mr-3 h-8 w-auto"
                    />
                    NIKON D850
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="w-fit">Photo/Video</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="mr-2 inline-block h-4 w-4 rounded-full bg-orange-400"></div>
                      351
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    0.20
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    0.74
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Rating>
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar filled={false} />
                      <RatingStar filled={false} />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        3.0
                      </p>
                    </Rating>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      1.2M
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">$1.52M</TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    3 weeks ago
                  </TableCell>
                </TableRow>
                <TableRow className="border-b hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                  <TableCell className="w-4 px-4 py-3">
                    <div className="flex items-center">
                      <Checkbox
                        id="checkbox-table-search-1"
                        name="checkbox-table-search-1"
                        className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                      <Label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        Select this product
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    <img
                      src="https://flowbite.s3.amazonaws.com/blocks/application-ui/devices/benq-ex2710q.png"
                      alt=""
                      className="mr-3 h-8 w-auto"
                    />
                    Monitor BenQ EX2710Q
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge className="w-fit">TV/Monitor</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="mr-2 inline-block h-4 w-4 rounded-full bg-green-400"></div>
                      1242
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    4.12
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    0.30
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <Rating>
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar />
                      <RatingStar filled={false} />
                      <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        4.0
                      </p>
                    </Rating>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-2 h-5 w-5 text-gray-400"
                        aria-hidden
                      >
                        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                      </svg>
                      211K
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">$1.2M</TableCell>
                  <TableCell className="px-4 py-2 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                    Just now
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <nav
            className="flex flex-col items-start justify-between space-y-3 p-4 md:flex-row md:items-center md:space-y-0"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Showing&nbsp;
              <span className="font-semibold text-gray-900 dark:text-white">
                1-10
              </span>
              &nbsp;of&nbsp;
              <span className="font-semibold text-gray-900 dark:text-white">
                1000
              </span>
            </span>
            <Pagination
              currentPage={currentPage}
              nextLabel=""
              onPageChange={(page) => setCurrentPage(page)}
              previousLabel=""
              showIcons
              totalPages={100}
              theme={{
                pages: {
                  base: twMerge(theme.pagination.pages.base, "mt-0"),
                  next: {
                    base: twMerge(
                      theme.pagination.pages.next.base,
                      "w-10 px-1.5 py-1.5",
                    ),
                    icon: "h-6 w-6",
                  },
                  previous: {
                    base: twMerge(
                      theme.pagination.pages.previous.base,
                      "w-10 px-1.5 py-1.5",
                    ),
                    icon: "h-6 w-6",
                  },
                  selector: {
                    base: twMerge(
                      theme.pagination.pages.selector.base,
                      "w-9 py-2 text-sm focus:border-blue-300",
                    ),
                  },
                },
              }}
            />
          </nav>
        </div>
      </div>
    </section>
  );
}
