import type { FC } from "react";
import { productData, Product } from "@/data/products";

const AdminDashboardPage: FC = function () {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Products
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Browse and filter the product list below.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Brand</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Sales</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((product: Product) => (
              <tr
                key={product.name}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">{product.brand}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.sales}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded px-2.5 py-0.5 text-xs font-medium ${
                      product.status === "In Stock"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
