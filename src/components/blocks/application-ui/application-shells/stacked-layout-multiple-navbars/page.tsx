"use client";

import {
  Button,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Label,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Radio,
  Select,
  TextInput,
  theme,
} from "flowbite-react";
import { twMerge } from "tailwind-merge";

export default function StackedLayoutWithMultipleNavbars() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Navbar
        fluid
        theme={{
          root: {
            inner: {
              base: "flex flex-col",
            },
          },
        }}
        className="pb-0"
      >
        <div className="border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <a href="https://flowbite.com" className="mr-6 flex">
                <img
                  src="https://flowbite.s3.amazonaws.com/logo.svg"
                  className="mr-3 h-8"
                  alt=""
                />
                <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                  Flowbite
                </span>
              </a>
              <form action="#" method="GET" className="hidden lg:block lg:pl-2">
                <Label htmlFor="topbar-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-96">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-4 w-4 text-gray-500 dark:text-gray-400"
                      aria-hidden
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
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
                    id="topbar-search"
                    name="topbar-search"
                    placeholder="Jump to Favorites, Apps, Pipelines..."
                    type="search"
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center justify-between space-x-4 lg:order-2">
              <Dropdown
                inline
                label={
                  <>
                    <span className="sr-only">View notifications</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 14 20"
                    >
                      <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
                    </svg>
                  </>
                }
                placement="bottom"
                theme={{
                  arrowIcon: "hidden",
                  content: twMerge(theme.dropdown.content, "py-0"),
                  floating: {
                    base: twMerge(
                      theme.dropdown.floating.base,
                      "w-96 rounded-xl",
                    ),
                  },
                  inlineWrapper: twMerge(
                    theme.dropdown.inlineWrapper,
                    "rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-4 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600",
                  ),
                }}
              >
                <div className="block rounded-t-xl bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:bg-gray-600 dark:text-white">
                  Notifications
                </div>
                <div className="border-t border-gray-100 dark:border-gray-600">
                  <a
                    href="#"
                    className="flex border-b px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    <div className="shrink-0">
                      <img
                        className="h-11 w-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                        alt=""
                      />
                      <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-primary-700 dark:border-gray-700">
                        <svg
                          className="h-2 w-2 text-white"
                          aria-hidden
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 18"
                        >
                          <path d="M15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783ZM6 2h6a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2Zm7 5H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Z" />
                          <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="w-full pl-3">
                      <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                        New message from&nbsp;
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Bonnie Green
                        </span>
                        : "Hey, what's up? All set for the presentation?"
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        a few moments ago
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex border-b px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    <div className="shrink-0">
                      <img
                        className="h-11 w-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                        alt=""
                      />
                      <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-gray-900 dark:border-gray-700">
                        <svg
                          className="h-2 w-2 text-white"
                          aria-hidden
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="w-full pl-3">
                      <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Jese Leos
                        </span>
                        &nbsp;and&nbsp;
                        <span className="font-medium text-gray-900 dark:text-white">
                          5 others
                        </span>
                        &nbsp;started following you.
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        10 minutes ago
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex border-b px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    <div className="shrink-0">
                      <img
                        className="h-11 w-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png"
                        alt=""
                      />
                      <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-red-600 dark:border-gray-700">
                        <svg
                          className="h-2 w-2 text-white"
                          aria-hidden
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />{" "}
                        </svg>
                      </div>
                    </div>
                    <div className="w-full pl-3">
                      <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Joseph McFall
                        </span>
                        &nbsp;and&nbsp;
                        <span className="font-medium text-gray-900 dark:text-white">
                          141 others
                        </span>
                        &nbsp;love your story. See it and view more stories.
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        44 minutes ago
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex border-b px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    <div className="shrink-0">
                      <img
                        className="h-11 w-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png"
                        alt=""
                      />
                      <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-green-400 dark:border-gray-700">
                        <svg
                          className="h-2 w-2 text-white"
                          aria-hidden
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          <path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="w-full pl-3">
                      <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Leslie Livingston
                        </span>
                        &nbsp;mentioned you in a comment:&nbsp;
                        <span className="font-medium text-primary-700 dark:text-primary-500">
                          @bonnie.green
                        </span>
                        &nbsp;what do you say?
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        1 hour ago
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="shrink-0">
                      <img
                        className="h-11 w-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/robert-brown.png"
                        alt=""
                      />
                      <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-purple-500 dark:border-gray-700">
                        <svg
                          className="h-2 w-2 text-white"
                          aria-hidden
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 14"
                        >
                          <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="w-full pl-3">
                      <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Robert Brown
                        </span>
                        &nbsp;posted a new video: Glassmorphism - learn how to
                        implement the new design trend.
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        3 hours ago
                      </div>
                    </div>
                  </a>
                </div>
                <a
                  href="#"
                  className="block rounded-b-xl border-t border-gray-100 bg-gray-50 py-2 text-center text-base font-medium text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:hover:underline"
                >
                  <div className="inline-flex items-center ">
                    <svg
                      aria-hidden
                      className="mr-2 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View all
                  </div>
                </a>
              </Dropdown>
              <Dropdown
                inline
                label={
                  <>
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt=""
                    />
                  </>
                }
                placement="bottom"
                theme={{
                  arrowIcon: "hidden",
                  floating: {
                    base: twMerge(
                      theme.dropdown.floating.base,
                      "w-60 rounded-xl",
                    ),
                  },
                  inlineWrapper: twMerge(
                    theme.dropdown.inlineWrapper,
                    "text-gray-600 dark:text-gray-400",
                  ),
                }}
              >
                <div className="px-4 py-3">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    Neil Sims
                  </span>
                  <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                    name@flowbite.com
                  </span>
                </div>
                <DropdownDivider />
                <DropdownItem className="text-gray-500 dark:text-gray-400">
                  My profile
                </DropdownItem>
                <DropdownItem className="text-gray-500 dark:text-gray-400">
                  Account settings
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem className="text-gray-500 dark:text-gray-400">
                  <svg
                    className="mr-2 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                  </svg>
                  My links
                </DropdownItem>
                <DropdownItem className="text-gray-500 dark:text-gray-400">
                  <svg
                    className="mr-2 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m1.56 6.245 8 3.924a1 1 0 0 0 .88 0l8-3.924a1 1 0 0 0 0-1.8l-8-3.925a1 1 0 0 0-.88 0l-8 3.925a1 1 0 0 0 0 1.8Z" />{" "}
                    <path d="M18 8.376a1 1 0 0 0-1 1v.163l-7 3.434-7-3.434v-.163a1 1 0 0 0-2 0v.786a1 1 0 0 0 .56.9l8 3.925a1 1 0 0 0 .88 0l8-3.925a1 1 0 0 0 .56-.9v-.786a1 1 0 0 0-1-1Z" />{" "}
                    <path d="M17.993 13.191a1 1 0 0 0-1 1v.163l-7 3.435-7-3.435v-.163a1 1 0 1 0-2 0v.787a1 1 0 0 0 .56.9l8 3.925a1 1 0 0 0 .88 0l8-3.925a1 1 0 0 0 .56-.9v-.787a1 1 0 0 0-1-1Z" />{" "}
                  </svg>
                  Collections
                </DropdownItem>
                <DropdownItem className="text-gray-500 dark:text-gray-400">
                  <div className="flex w-full items-center justify-between">
                    <span className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-primary-600 dark:text-primary-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="m7.164 3.805-4.475.38L.327 6.546a1.114 1.114 0 0 0 .63 1.89l3.2.375 3.007-5.006ZM11.092 15.9l.472 3.14a1.114 1.114 0 0 0 1.89.63l2.36-2.362.38-4.475-5.102 3.067Zm8.617-14.283A1.613 1.613 0 0 0 18.383.291c-1.913-.33-5.811-.736-7.556 1.01-1.98 1.98-6.172 9.491-7.477 11.869a1.1 1.1 0 0 0 .193 1.316l.986.985.985.986a1.1 1.1 0 0 0 1.316.193c2.378-1.3 9.889-5.5 11.869-7.477 1.746-1.745 1.34-5.643 1.01-7.556Zm-3.873 6.268a2.63 2.63 0 1 1-3.72-3.72 2.63 2.63 0 0 1 3.72 3.72Z" />
                      </svg>
                      Pro version
                    </span>
                    <svg
                      className="h-2.5 w-2.5 text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </div>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem className="text-gray-500 dark:text-gray-400">
                  Sign out
                </DropdownItem>
              </Dropdown>
              <NavbarToggle />
            </div>
          </div>
        </div>
        <nav className="bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-wrap items-center justify-between p-4 sm:pb-3 lg:px-6">
            <div className="mb-4 flex items-center sm:mb-0">
              <Dropdown
                inline
                label={
                  <>
                    <span className="sr-only">Open user menu</span>
                    <div className="mr-2 flex items-center">
                      <img
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                        className="mr-2 h-7 w-7 rounded-full"
                        alt=""
                      />
                      <div className="text-left">
                        <div className="text-sm font-semibold leading-none text-gray-900 dark:text-white">
                          Personal
                        </div>
                      </div>
                    </div>
                    <svg
                      className="h-3 w-3 text-gray-500 dark:text-gray-400"
                      aria-hidden
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5m0 6 4 4 4-4"
                      />
                    </svg>
                  </>
                }
                theme={{
                  arrowIcon: "hidden",
                  inlineWrapper: twMerge(
                    theme.dropdown.inlineWrapper,
                    "rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-700",
                  ),
                }}
              >
                <a
                  href="#"
                  className="flex items-center rounded px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <div className="text-left">
                    <div className="mb-0.5 text-sm font-medium leading-none text-gray-900 dark:text-white">
                      Company
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created August, 2014
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center rounded px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <div className="text-left">
                    <div className="mb-0.5 text-sm font-medium leading-none text-gray-900 dark:text-white">
                      Personal
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created September, 2018
                    </div>
                  </div>
                </a>
              </Dropdown>
              <svg
                className="mx-4 h-3 w-3 text-gray-500 dark:text-gray-400"
                aria-hidden
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Dropdown
                inline
                label="flowbite.com"
                theme={{
                  arrowIcon: "hidden",
                  inlineWrapper: twMerge(
                    theme.dropdown.inlineWrapper,
                    "rounded-lg p-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus:ring-gray-700",
                  ),
                }}
              >
                <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <div className="flex rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <div className="flex h-5 items-center">
                        <Radio id="helper-radio-4" name="helper-radio" />
                      </div>
                      <div className="ml-2 text-sm">
                        <Label
                          htmlFor="helper-radio-4"
                          className="font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div>themesberg.com</div>
                          <p
                            id="helper-radio-text-4"
                            className="text-xs font-normal text-gray-500 dark:text-gray-300"
                          >
                            Free templates and themes
                          </p>
                        </Label>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <div className="flex h-5 items-center">
                        <Radio id="helper-radio-5" name="helper-radio" />
                      </div>
                      <div className="ml-2 text-sm">
                        <Label
                          htmlFor="helper-radio-5"
                          className="font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div>iconscale.com</div>
                          <p
                            id="helper-radio-text-5"
                            className="text-xs font-normal text-gray-500 dark:text-gray-300"
                          >
                            Open-source SVG icons
                          </p>
                        </Label>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <div className="flex h-5 items-center">
                        <Radio id="helper-radio-6" name="helper-radio" />
                      </div>
                      <div className="ml-2 text-sm">
                        <Label
                          htmlFor="helper-radio-6"
                          className="font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div>ui.glass</div>
                          <p
                            id="helper-radio-text-6"
                            className="text-xs font-normal text-gray-500 dark:text-gray-300"
                          >
                            Glassmorphism UI framework
                          </p>
                        </Label>
                      </div>
                    </div>
                  </li>
                </ul>
              </Dropdown>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:items-center">
              <Button className="whitespace-nowrap [&>span]:text-xs">
                Open app
              </Button>
              <Dropdown
                label={
                  <div className="flex items-center">
                    <span>More&nbsp;</span>
                    <svg
                      className="ml-1.5 h-2.5 w-2.5"
                      aria-hidden
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5m0 6 4 4 4-4"
                      />
                    </svg>
                  </div>
                }
                theme={{
                  arrowIcon: "hidden",
                  floating: {
                    base: twMerge(theme.dropdown.floating.base, "w-48"),
                    target: twMerge(
                      theme.dropdown.floating.target,
                      "w-full border border-blue-600 text-blue-600 hover:text-white dark:bg-transparent [&>span]:text-xs",
                    ),
                  },
                }}
              >
                <DropdownItem>
                  <svg
                    className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-300"
                    aria-hidden
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create new app
                </DropdownItem>
                <DropdownItem>
                  <svg
                    className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-300"
                    aria-hidden
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Inbox
                </DropdownItem>
                <DropdownItem>
                  <svg
                    className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-300"
                    aria-hidden
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  App info
                </DropdownItem>
                <DropdownItem>
                  <svg
                    className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-300"
                    aria-hidden
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path
                      fillRule="evenodd"
                      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Edit app
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        </nav>
        <form
          action="#"
          method="GET"
          className="px-4 py-3 dark:bg-gray-800 lg:hidden"
        >
          <Label htmlFor="topbar-search" className="sr-only">
            Search
          </Label>
          <div className="relative mt-1 grid grid-cols-1 gap-y-3">
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
              id="topbar-search"
              name="topbar-search"
              placeholder="Jump to Favorites, Apps, Pipelines..."
              type="search"
            />
            <Select>
              <option>Overview</option>
              <option>Resources</option>
              <option>Deploy</option>
              <option>Metrics</option>
              <option>Activity</option>
              <option>Access</option>
              <option>Settings</option>
            </Select>
          </div>
        </form>
        <NavbarCollapse className=" border-b border-gray-200 dark:border-gray-800">
          <div className="flex w-full flex-col items-center bg-white shadow-sm  dark:bg-gray-900 lg:mx-5 lg:flex-row [&_li]:w-full lg:[&_li]:w-auto">
            <NavbarLink
              aria-current="page"
              href="#"
              className="block border-b p-0 dark:border-gray-700 dark:hover:bg-transparent lg:inline lg:border-b-0"
            >
              <span className="block border-b-2 border-primary-600 px-4 py-3 text-sm font-medium text-primary-600 hover:text-primary-600 dark:border-primary-500 dark:text-primary-500">
                Overview
              </span>
            </NavbarLink>
            <NavbarLink
              href="#"
              className="block border-b p-0 dark:border-gray-700 dark:hover:bg-transparent md:inline md:border-b-0"
            >
              <span className="block border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 hover:border-primary-600 hover:text-primary-600 dark:text-gray-400 dark:hover:border-primary-500 dark:hover:text-primary-500">
                Resources
              </span>
            </NavbarLink>
            <NavbarLink
              href="#"
              className="block border-b p-0 dark:border-gray-700 dark:hover:bg-transparent md:inline md:border-b-0"
            >
              <span className="block border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 hover:border-primary-600 hover:text-primary-600 dark:text-gray-400 dark:hover:border-primary-500 dark:hover:text-primary-500">
                Deploy
              </span>
            </NavbarLink>
            <NavbarLink
              href="#"
              className="block border-b p-0 dark:border-gray-700 dark:hover:bg-transparent md:inline md:border-b-0"
            >
              <span className="block border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 hover:border-primary-600 hover:text-primary-600 dark:text-gray-400 dark:hover:border-primary-500 dark:hover:text-primary-500">
                Metrics
              </span>
            </NavbarLink>
            <NavbarLink
              href="#"
              className="block border-b p-0 dark:border-gray-700 dark:hover:bg-transparent md:inline md:border-b-0"
            >
              <span className="block border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 hover:border-primary-600 hover:text-primary-600 dark:text-gray-400 dark:hover:border-primary-500 dark:hover:text-primary-500">
                Activity
              </span>
            </NavbarLink>
            <NavbarLink
              href="#"
              className="block border-b p-0 dark:border-gray-700 dark:hover:bg-transparent md:inline md:border-b-0"
            >
              <span className="block border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 hover:border-primary-600 hover:text-primary-600 dark:text-gray-400 dark:hover:border-primary-500 dark:hover:text-primary-500">
                Access
              </span>
            </NavbarLink>
            <NavbarLink
              href="#"
              className="block border-b p-0 dark:border-gray-700 dark:hover:bg-transparent md:inline md:border-b-0"
            >
              <span className="block border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 hover:border-primary-600 hover:text-primary-600 dark:text-gray-400 dark:hover:border-primary-500 dark:hover:text-primary-500">
                Settings
              </span>
            </NavbarLink>
          </div>
        </NavbarCollapse>
      </Navbar>
      <div className="grid flex-1 grid-cols-1 gap-5 p-4 dark:bg-gray-900 md:grid-cols-2">
        <div className="h-96 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div className="h-96 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div className="h-96 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div className="h-96 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div className="h-96 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div className="h-96 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div className="h-96 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div className="h-96 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div className="h-96 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div className="h-96 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
      </div>
    </div>
  );
}
