import type { FC } from "react";
import { Button } from "flowbite-react";
import { HiArrowRight } from "react-icons/hi";

const HeroSection: FC = function () {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-12 lg:py-16">
        <a
          href="#"
          className="mb-7 inline-flex items-center justify-between rounded-full bg-gray-100 px-1 py-1 pr-4 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          role="alert"
        >
          <span className="bg-primary-600 mr-3 rounded-full px-4 py-1.5 text-xs text-white">
            New
          </span>
          <span className="text-sm font-medium">
            Flowbite is out! See what's new
          </span>
          <HiArrowRight className="ml-2 h-5 w-5" />
        </a>
        <h1 className="mb-4 text-4xl leading-none font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          We invest in the world's potential
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 sm:px-16 lg:text-xl xl:px-48 dark:text-gray-400">
          Here at Flowbite we focus on markets where technology, innovation, and
          capital can unlock long-term value and drive economic growth.
        </p>
        <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 lg:mb-16">
          <Button size="lg" className="bg-primary-700 hover:bg-primary-800">
            Learn more
            <HiArrowRight className="-mr-1 ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" color="gray" outline>
            Watch video
          </Button>
        </div>
        <div className="mx-auto px-4 text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
          <span className="font-semibold text-gray-400 uppercase">
            FEATURED IN
          </span>
          <div className="mt-8 flex flex-wrap items-center justify-center text-gray-500 sm:justify-between">
            <a
              href="#"
              className="mr-5 mb-5 hover:text-gray-800 lg:mb-0 dark:hover:text-gray-400"
            >
              <svg
                className="h-8"
                viewBox="0 0 132 29"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Logo SVG content */}
              </svg>
            </a>
            {/* Więcej logo */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
