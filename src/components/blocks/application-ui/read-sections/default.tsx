import { Button } from "flowbite-react";
import { HiPencilAlt, HiTrash } from "react-icons/hi";

export function DefaultReadSection() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-8 lg:py-16">
        <h2 className="mb-2 text-xl leading-none font-semibold text-gray-900 md:text-2xl dark:text-white">
          Apple iMac 25"
        </h2>
        <p className="mb-4 text-xl leading-none font-extrabold text-gray-900 md:text-2xl dark:text-white">
          $2999
        </p>
        <dl>
          <dt className="mb-2 leading-none font-semibold text-gray-900 dark:text-white">
            Details
          </dt>
          <dd className="mb-4 text-gray-500 sm:mb-5 dark:text-gray-400">
            Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7
            processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory,
            Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage,
            Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US.
          </dd>
        </dl>
        <dl className="flex items-center space-x-6">
          <div>
            <dt className="mb-2 leading-none font-semibold text-gray-900 dark:text-white">
              Category
            </dt>
            <dd className="mb-4 text-gray-500 sm:mb-5 dark:text-gray-400">
              Electronics/PC
            </dd>
          </div>
          <div>
            <dt className="mb-2 leading-none font-semibold text-gray-900 dark:text-white">
              Item weight
            </dt>
            <dd className="mb-4 text-gray-500 sm:mb-5 dark:text-gray-400">
              12kg
            </dd>
          </div>
        </dl>
        <div className="flex items-center space-x-4">
          <Button size="lg" className="[&>span]:text-sm">
            <HiPencilAlt className="mr-1 -ml-1 h-5 w-5" />
            Edit
          </Button>
          <Button color="failure" size="lg" className="[&>span]:text-sm">
            <HiTrash className="mr-1.5 -ml-1 h-5 w-5" />
            Delete
          </Button>
        </div>
      </div>
    </section>
  );
}
