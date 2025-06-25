import type { FC } from "react";
import { useState } from "react";
import {
  Badge,
  Checkbox,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { BlockBreadcrumb } from "@/components/block-breadcrumb";
import {
  HiChartBar,
  HiCurrencyDollar,
  HiShoppingBag,
  HiTrendingUp,
  HiSearch,
} from "react-icons/hi";

export const AdminProductsPage: FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const products = [
    {
      id: "1",
      name: 'Apple iMac 27"',
      category: "Computers",
      brand: "Apple",
      price: "$1,299",
      stock: 95,
      totalSales: 200,
      status: "In Stock",
      image:
        "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png",
    },
    {
      id: "2",
      name: "Apple iPhone",
      category: "Mobile Phones",
      brand: "Apple",
      price: "$999",
      stock: 342,
      totalSales: 300,
      status: "In Stock",
      image:
        "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/iphone-12-pro-max-gold.png",
    },
    {
      id: "3",
      name: "Samsung Galaxy",
      category: "Mobile Phones",
      brand: "Samsung",
      price: "$899",
      stock: 127,
      totalSales: 150,
      status: "In Stock",
      image:
        "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/samsung-galaxy-s22-ultra.png",
    },
    {
      id: "4",
      name: "Dell XPS 13",
      category: "Computers",
      brand: "Dell",
      price: "$1,099",
      stock: 0,
      totalSales: 120,
      status: "Out of Stock",
      image:
        "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/dell-xps-13.png",
    },
    {
      id: "5",
      name: "HP Spectre x360",
      category: "Computers",
      brand: "HP",
      price: "$1,299",
      stock: 325,
      totalSales: 80,
      status: "In Stock",
      image:
        "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/hp-spectre-x360.png",
    },
    {
      id: "6",
      name: "Google Pixel 6",
      category: "Mobile Phones",
      brand: "Google",
      price: "$799",
      stock: 100,
      totalSales: 200,
      status: "In Stock",
      image:
        "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/google-pixel-6.png",
    },
    {
      id: "7",
      name: "Sony WH-1000XM4",
      category: "Headphones",
      brand: "Sony",
      price: "$349",
      stock: 60,
      totalSales: 150,
      status: "In Stock",
      image:
        "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/sony-wh-1000xm4.png",
    },
    {
      id: "8",
      name: "Apple AirPods Pro",
      category: "Headphones",
      brand: "Apple",
      price: "$249",
      stock: 200,
      totalSales: 300,
      status: "In Stock",
      image:
        "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/airpods-pro.png",
    },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  return (
    <div className="p-4">
      <div className="w-full">
        <BlockBreadcrumb
          title="Flowbite Datatable"
          description="Zarządzanie produktami e-commerce z zaawansowanymi funkcjami filtrowania i analizy sprzedaży"
        />

        {/* Statistics Cards */}
        <div className="mx-auto mb-6 grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-800 p-6 dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20">
                <HiShoppingBag className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">
                  Total products
                </p>
                <p className="text-2xl font-bold text-white">6,043</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                <HiTrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">
                  New products
                </p>
                <p className="text-2xl font-bold text-white">978</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20">
                <HiChartBar className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Sales</p>
                <p className="text-2xl font-bold text-white">1,945</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 dark:bg-gray-800">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                <HiCurrencyDollar className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-white">$1,657,856</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="w-full rounded-lg bg-gray-800 shadow-sm dark:bg-gray-800">
          <div className="flex flex-col space-y-3 p-6 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
            <div className="flex flex-1 items-center space-x-4">
              <h5 className="text-xl font-semibold text-white">Products</h5>
            </div>
            <div className="flex shrink-0 flex-col items-stretch justify-end space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <HiSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <TextInput
                    placeholder="Search..."
                    className="border-gray-600 bg-gray-700 pl-10 text-white placeholder-gray-400"
                    sizing="sm"
                  />
                </div>
                <Select
                  sizing="sm"
                  className="border-gray-600 bg-gray-700 text-white"
                >
                  <option>15</option>
                  <option>25</option>
                  <option>50</option>
                </Select>
                <span className="text-sm text-gray-400">entries per page</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-full bg-gray-800 text-left text-sm text-gray-400">
              <TableHead className="bg-gray-700 text-xs text-gray-400 uppercase">
                <TableRow>
                  <TableHeadCell className="bg-gray-700 p-4">
                    <Checkbox
                      checked={selectedProducts.length === products.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                  </TableHeadCell>
                  <TableHeadCell className="bg-gray-700 px-6 py-3 tracking-wider text-gray-400 uppercase">
                    NAME
                  </TableHeadCell>
                  <TableHeadCell className="bg-gray-700 px-6 py-3 tracking-wider text-gray-400 uppercase">
                    CATEGORY
                  </TableHeadCell>
                  <TableHeadCell className="bg-gray-700 px-6 py-3 tracking-wider text-gray-400 uppercase">
                    BRAND
                  </TableHeadCell>
                  <TableHeadCell className="bg-gray-700 px-6 py-3 tracking-wider text-gray-400 uppercase">
                    PRICE
                  </TableHeadCell>
                  <TableHeadCell className="bg-gray-700 px-6 py-3 tracking-wider text-gray-400 uppercase">
                    STOCK
                  </TableHeadCell>
                  <TableHeadCell className="bg-gray-700 px-6 py-3 tracking-wider text-gray-400 uppercase">
                    TOTAL SALES
                  </TableHeadCell>
                  <TableHeadCell className="bg-gray-700 px-6 py-3 tracking-wider text-gray-400 uppercase">
                    STATUS
                  </TableHeadCell>
                  <TableHeadCell className="bg-gray-700 px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y divide-gray-700">
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-b border-gray-700 bg-gray-800 hover:bg-gray-700"
                  >
                    <TableCell className="p-4">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) =>
                          handleSelectProduct(product.id, e.target.checked)
                        }
                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium whitespace-nowrap text-white">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="mr-3 h-8 w-8 rounded-lg object-cover"
                        />
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-300">
                      <Badge className="border-blue-800 bg-blue-900/50 text-blue-400">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-300">
                      {product.brand}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-semibold text-white">
                      {product.price}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="flex items-center">
                        <span
                          className={`mr-2 h-2 w-2 rounded-full ${product.stock === 0 ? "bg-gray-500" : "bg-green-500"}`}
                        ></span>
                        <span
                          className={
                            product.stock === 0
                              ? "text-gray-400"
                              : "text-gray-300"
                          }
                        >
                          {product.stock}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-300">
                      <div className="flex items-center">
                        <svg
                          className="mr-1 h-4 w-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {product.totalSales}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        className={
                          product.status === "In Stock"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-red-900/50 text-red-400"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <button className="text-gray-400 hover:text-white">
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
