import {
  Button,
  Checkbox,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Label,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
  theme,
} from "flowbite-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export function DefaultAdvancedTable() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="bg-gray-50 p-3 sm:p-5 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
          <div className="flex flex-col items-center justify-between space-y-3 p-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <Label htmlFor="simple-search" className="sr-only">
                  Search
                </Label>
                <TextInput
                  icon={() => (
                    <svg
                      aria-hidden
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  id="simple-search"
                  name="simple-search"
                  placeholder="Search"
                  required
                  type="search"
                  className="w-full [&_input]:py-2"
                />
              </form>
            </div>
            <div className="flex w-full shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-y-0 md:space-x-3">
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
                Add product
              </Button>
              <div className="flex w-full items-center space-x-3 md:w-auto">
                <Dropdown
                  color="gray"
                  label={
                    <>
                      <svg
                        className="mr-1.5 -ml-1 h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                      </svg>
                      Actions
                    </>
                  }
                  theme={{
                    arrowIcon: "hidden",
                    floating: {
                      base: twMerge(theme.dropdown.floating.base, "w-48"),
                      target: "w-full",
                    },
                  }}
                >
                  <DropdownItem>Mass Edit</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Delete All</DropdownItem>
                </Dropdown>
                <Dropdown
                  color="gray"
                  label={
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                        className="mr-2 h-4 w-4 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Filter</span>
                    </>
                  }
                  theme={{
                    floating: {
                      base: twMerge(
                        theme.dropdown.floating.base,
                        "w-48 rounded-xl",
                      ),
                      target: "w-full",
                    },
                  }}
                >
                  <div className="p-3">
                    <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                      Choose brand
                    </h6>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Checkbox id="apple" name="apple" />
                        <Label
                          htmlFor="apple"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Apple (56)
                        </Label>
                      </li>
                      <li className="flex items-center">
                        <Checkbox id="fitbit" name="fitbit" />
                        <Label
                          htmlFor="fitbit"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Microsoft (16)
                        </Label>
                      </li>
                      <li className="flex items-center">
                        <Checkbox id="razer" name="razer" />
                        <Label
                          htmlFor="razer"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Razer (49)
                        </Label>
                      </li>
                      <li className="flex items-center">
                        <Checkbox id="nikon" name="nikon" />
                        <Label
                          htmlFor="nikon"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Nikon (12)
                        </Label>
                      </li>
                      <li className="flex items-center">
                        <Checkbox id="benq" name="benq" />
                        <Label
                          htmlFor="benq"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          BenQ (74)
                        </Label>
                      </li>
                    </ul>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table
              theme={{
                root: {
                  wrapper: "static",
                },
              }}
              className="w-full text-left text-sm text-gray-500 dark:text-gray-400"
            >
              <TableHead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                <TableRow>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Product name
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Category
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Brand
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Description
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    Price
                  </TableHeadCell>
                  <TableHeadCell scope="col" className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    Apple iMac 27&quot;
                  </TableCell>
                  <TableCell className="px-4 py-3">PC</TableCell>
                  <TableCell className="px-4 py-3">Apple</TableCell>
                  <TableCell className="px-4 py-3">300</TableCell>
                  <TableCell className="px-4 py-3">$2999</TableCell>
                  <TableCell className="flex items-center justify-end px-4 py-3">
                    <Dropdown
                      inline
                      label={
                        <>
                          <span className="sr-only">Manage entry</span>
                          <svg
                            className="h-5 w-5"
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </>
                      }
                      theme={{
                        arrowIcon: "hidden",
                        floating: {
                          base: twMerge(theme.dropdown.floating.base, "w-40"),
                        },
                      }}
                    >
                      <DropdownItem>Show</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    Apple iMac 20&quot;
                  </TableCell>
                  <TableCell className="px-4 py-3">PC</TableCell>
                  <TableCell className="px-4 py-3">Apple</TableCell>
                  <TableCell className="px-4 py-3">200</TableCell>
                  <TableCell className="px-4 py-3">$1499</TableCell>
                  <TableCell className="flex items-center justify-end px-4 py-3">
                    <Dropdown
                      inline
                      label={
                        <>
                          <span className="sr-only">Manage entry</span>
                          <svg
                            className="h-5 w-5"
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </>
                      }
                      theme={{
                        arrowIcon: "hidden",
                        floating: {
                          base: twMerge(theme.dropdown.floating.base, "w-40"),
                        },
                      }}
                    >
                      <DropdownItem>Show</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    Apple iPhone 14&quot;
                  </TableCell>
                  <TableCell className="px-4 py-3">PC</TableCell>
                  <TableCell className="px-4 py-3">Apple</TableCell>
                  <TableCell className="px-4 py-3">1237</TableCell>
                  <TableCell className="px-4 py-3">$2999</TableCell>
                  <TableCell className="flex items-center justify-end px-4 py-3">
                    <Dropdown
                      inline
                      label={
                        <>
                          <span className="sr-only">Manage entry</span>
                          <svg
                            className="h-5 w-5"
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </>
                      }
                      theme={{
                        arrowIcon: "hidden",
                        floating: {
                          base: twMerge(theme.dropdown.floating.base, "w-40"),
                        },
                      }}
                    >
                      <DropdownItem>Show</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    Apple iPad Air
                  </TableCell>
                  <TableCell className="px-4 py-3">PC</TableCell>
                  <TableCell className="px-4 py-3">Apple</TableCell>
                  <TableCell className="px-4 py-3">4578</TableCell>
                  <TableCell className="px-4 py-3">$1199</TableCell>
                  <TableCell className="flex items-center justify-end px-4 py-3">
                    <Dropdown
                      inline
                      label={
                        <>
                          <span className="sr-only">Manage entry</span>
                          <svg
                            className="h-5 w-5"
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </>
                      }
                      theme={{
                        arrowIcon: "hidden",
                        floating: {
                          base: twMerge(theme.dropdown.floating.base, "w-40"),
                        },
                      }}
                    >
                      <DropdownItem>Show</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    Xbox Series S
                  </TableCell>
                  <TableCell className="px-4 py-3">Gaming/Console</TableCell>
                  <TableCell className="px-4 py-3">Microsoft</TableCell>
                  <TableCell className="px-4 py-3">256</TableCell>
                  <TableCell className="px-4 py-3">$299</TableCell>
                  <TableCell className="flex items-center justify-end px-4 py-3">
                    <Dropdown
                      inline
                      label={
                        <>
                          <span className="sr-only">Manage entry</span>
                          <svg
                            className="h-5 w-5"
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </>
                      }
                      theme={{
                        arrowIcon: "hidden",
                        floating: {
                          base: twMerge(theme.dropdown.floating.base, "w-40"),
                        },
                      }}
                    >
                      <DropdownItem>Show</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    PlayStation 5
                  </TableCell>
                  <TableCell className="px-4 py-3">Gaming/Console</TableCell>
                  <TableCell className="px-4 py-3">Sony</TableCell>
                  <TableCell className="px-4 py-3">78</TableCell>
                  <TableCell className="px-4 py-3">$799</TableCell>
                  <TableCell className="flex items-center justify-end px-4 py-3">
                    <Dropdown
                      inline
                      label={
                        <>
                          <span className="sr-only">Manage entry</span>
                          <svg
                            className="h-5 w-5"
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </>
                      }
                      theme={{
                        arrowIcon: "hidden",
                        floating: {
                          base: twMerge(theme.dropdown.floating.base, "w-40"),
                        },
                      }}
                    >
                      <DropdownItem>Show</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    Xbox Series X
                  </TableCell>
                  <TableCell className="px-4 py-3">Gaming/Console</TableCell>
                  <TableCell className="px-4 py-3">Microsoft</TableCell>
                  <TableCell className="px-4 py-3">200</TableCell>
                  <TableCell className="px-4 py-3">$699</TableCell>
                  <TableCell className="flex items-center justify-end px-4 py-3">
                    <Dropdown
                      inline
                      label={
                        <>
                          <span className="sr-only">Manage entry</span>
                          <svg
                            className="h-5 w-5"
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </>
                      }
                      theme={{
                        arrowIcon: "hidden",
                        floating: {
                          base: twMerge(theme.dropdown.floating.base, "w-40"),
                        },
                      }}
                    >
                      <DropdownItem>Show</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    Apple Watch SE
                  </TableCell>
                  <TableCell className="px-4 py-3">Watch</TableCell>
                  <TableCell className="px-4 py-3">Apple</TableCell>
                  <TableCell className="px-4 py-3">657</TableCell>
                  <TableCell className="px-4 py-3">$399</TableCell>
                  <TableCell className="flex items-center justify-end px-4 py-3">
                    <Dropdown
                      inline
                      label={
                        <>
                          <span className="sr-only">Manage entry</span>
                          <svg
                            className="h-5 w-5"
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </>
                      }
                      theme={{
                        arrowIcon: "hidden",
                        floating: {
                          base: twMerge(theme.dropdown.floating.base, "w-40"),
                        },
                      }}
                    >
                      <DropdownItem>Show</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    NIKON D850
                  </TableCell>
                  <TableCell className="px-4 py-3">Camera</TableCell>
                  <TableCell className="px-4 py-3">Nikon</TableCell>
                  <TableCell className="px-4 py-3">465</TableCell>
                  <TableCell className="px-4 py-3">$599</TableCell>
                  <TableCell className="flex items-center justify-end px-4 py-3">
                    <Dropdown
                      inline
                      label={
                        <>
                          <span className="sr-only">Manage entry</span>
                          <svg
                            className="h-5 w-5"
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </>
                      }
                      theme={{
                        arrowIcon: "hidden",
                        floating: {
                          base: twMerge(theme.dropdown.floating.base, "w-40"),
                        },
                      }}
                    >
                      <DropdownItem>Show</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b dark:border-gray-700">
                  <TableCell
                    scope="row"
                    className="px-4 py-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    Monitor BenQ EX2710Q
                  </TableCell>
                  <TableCell className="px-4 py-3">TV/Monitor</TableCell>
                  <TableCell className="px-4 py-3">BenQ</TableCell>
                  <TableCell className="px-4 py-3">354</TableCell>
                  <TableCell className="px-4 py-3">$499</TableCell>
                  <TableCell className="flex items-center justify-end px-4 py-3">
                    <Dropdown
                      inline
                      label={
                        <>
                          <span className="sr-only">Manage entry</span>
                          <svg
                            className="h-5 w-5"
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </>
                      }
                      theme={{
                        arrowIcon: "hidden",
                        floating: {
                          base: twMerge(theme.dropdown.floating.base, "w-40"),
                        },
                      }}
                    >
                      <DropdownItem>Show</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownDivider />
                      <DropdownItem>Delete</DropdownItem>
                    </Dropdown>
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
