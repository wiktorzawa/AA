import { Button } from "flowbite-react";
import { HiLocationMarker, HiPencilAlt, HiTrash } from "react-icons/hi";

export function ReadUserSection() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-8 lg:py-16">
        <h2 className="mb-4 text-xl leading-none font-semibold text-gray-900 sm:mb-5 md:text-2xl dark:text-white">
          Helene Engels
        </h2>
        <dl>
          <dt className="mb-2 leading-none font-semibold text-gray-900 dark:text-white">
            Biography
          </dt>
          <dd className="mb-4 text-gray-500 sm:mb-5 dark:text-gray-400">
            UI/UX Designer, Creating things that stand out, Featured by Adobe,
            Figma, Webflow and others, Daily design tips & resources, Exploring
            Web3.
          </dd>
          <dt className="mb-2 leading-none font-semibold text-gray-900 dark:text-white">
            Location
          </dt>
          <dd className="mb-4 flex items-center text-gray-900 sm:mb-5 dark:text-white">
            <HiLocationMarker className="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <span className="font-medium">
              California, United States of America
            </span>
          </dd>
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
