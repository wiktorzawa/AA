import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Label,
  Radio,
  Select,
  theme,
} from "flowbite-react";
import { FaChevronDown } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

export function TableHeaderWithBreadcrumb() {
  return (
    <section className="flex items-center bg-gray-50 py-6 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl px-4 lg:px-12">
        <div className="relative overflow-hidden bg-white px-4 shadow-md sm:rounded-lg dark:bg-gray-800">
          <div className="flex flex-col space-y-3 py-3 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
            <div>
              <Breadcrumb className="mb-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-700">
                <BreadcrumbItem href="#">Dashboard</BreadcrumbItem>
                <BreadcrumbItem href="#">2022</BreadcrumbItem>
                <BreadcrumbItem>All Products</BreadcrumbItem>
              </Breadcrumb>
              <h5>
                <span className="dark:text-white">View list of products</span>
              </h5>
            </div>
            <div className="flex shrink-0 flex-col items-start space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3 lg:justify-end">
              <Button>
                <HiPlus className="mr-1.5 -ml-1 h-3.5 w-3.5" />
                Add new product
              </Button>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-4 pb-4 md:grid-cols-3 lg:grid-cols-6">
            <Select>
              <option selected>Brand</option>
              <option value="samsung">Samsung</option>
              <option value="apple">Apple</option>
              <option value="nokia">Nokia</option>
              <option value="sony">Sony</option>
            </Select>
            <Select>
              <option selected>Category</option>
              <option value="tablet">Tablet</option>
              <option value="phone">Phone</option>
              <option value="tv">TV</option>
              <option value="console">Console</option>
            </Select>
            <Select>
              <option selected>Color</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="silver">Silver</option>
            </Select>
            <Select>
              <option selected>Category</option>
              <option value="tablet">Tablet</option>
              <option value="phone">Phone</option>
              <option value="tv">TV</option>
              <option value="console">Console</option>
            </Select>
            <Select>
              <option selected>Sold by</option>
              <option value="samsung">Samsung</option>
              <option value="apple">Apple</option>
              <option value="nokia">Nokia</option>
              <option value="flowbite">Flowbite</option>
            </Select>
            <Select>
              <option selected>Return Policy</option>
              <option value="30-days">30 days</option>
              <option value="14-days">14 days</option>
              <option value="no-returns">No returns</option>
            </Select>
          </div>
          <div className="block w-full items-center justify-between border-t py-3 md:flex dark:border-gray-700">
            <div className="mb-4 flex flex-wrap md:mb-0">
              <div className="mr-4 mb-2 flex w-full items-center text-sm font-medium text-gray-900 md:mb-0 md:w-auto dark:text-white">
                Show by:
              </div>
              <fieldset className="flex flex-wrap">
                <div className="mr-4 flex items-center">
                  <Radio id="all-products" name="show-by" />
                  <Label
                    htmlFor="all-products"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    All
                  </Label>
                </div>
                <div className="mr-4 flex items-center">
                  <Radio id="by-category" name="show-by" />
                  <Label
                    htmlFor="by-category"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    By Category
                  </Label>
                </div>
                <div className="mr-4 flex items-center">
                  <Radio id="by-price" name="show-by" />
                  <Label
                    htmlFor="by-price"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    By Price
                  </Label>
                </div>
                <div className="mr-4 flex items-center">
                  <Radio id="by-state" name="show-by" />
                  <Label
                    htmlFor="by-state"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    By State
                  </Label>
                </div>
                <div className="mr-4 flex items-center">
                  <Radio id="by-brand" name="show-by" />
                  <Label
                    htmlFor="by-brand"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    By Brand
                  </Label>
                </div>
              </fieldset>
            </div>
            <div>
              <Dropdown
                color="gray"
                label={
                  <>
                    <FaChevronDown className="mr-3 h-3 w-3" />
                    Actions
                  </>
                }
                placement="bottom"
                theme={{
                  arrowIcon: "hidden",
                  content: twMerge(theme.dropdown.content, "w-48"),
                }}
              >
                <DropdownItem>Mass Edit</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Delete All</DropdownItem>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
