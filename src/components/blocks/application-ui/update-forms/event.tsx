import {
  Avatar,
  AvatarGroup,
  AvatarGroupCounter,
  Button,
  Checkbox,
  Datepicker,
  Label,
  Select,
  Textarea,
  TextInput,
  Tooltip,
} from "flowbite-react";
import { useState } from "react";

export function UpdateEventForm() {
  const [dateEnd, setDateEnd] = useState("6/11/2024");
  const [dateStart, setDateStart] = useState("10/11/2023");

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto px-4 py-8 md:max-w-6xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Update event
        </h2>
        <form>
          <div className="gap-4 sm:mb-2 sm:grid sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            <div className="mb-4 space-y-4 xl:col-span-2">
              <div>
                <Label htmlFor="title" className="mb-2 block dark:text-white">
                  Title
                </Label>
                <TextInput
                  defaultValue="The 4th Digital Transformation"
                  id="title"
                  name="title"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="date_start"
                  className="mb-2 block dark:text-white"
                >
                  Select Date
                </Label>
                <div className="items-center space-y-4 md:flex md:space-y-0">
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        aria-hidden
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <Datepicker
                      id="date_start"
                      name="start"
                      onSelectedDateChanged={(date) => {
                        setDateStart(date.toLocaleDateString());
                      }}
                      value={dateStart}
                    />
                  </div>
                  <span className="hidden text-gray-500 md:mx-4 md:flex">
                    to
                  </span>
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        aria-hidden
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <Datepicker
                      id="date_end"
                      name="end"
                      onSelectedDateChanged={(date) => {
                        setDateEnd(date.toLocaleDateString());
                      }}
                      value={dateEnd}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex w-20 items-center">
                  <Checkbox defaultChecked id="event-duration-checkbox" />
                  <Label
                    htmlFor="event-duration-checkbox"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    All day
                  </Label>
                </div>
                <Label htmlFor="time" className="sr-only">
                  Select an option
                </Label>
                <Select id="time">
                  <option>Does not repeat</option>
                  <option selected value="DA">
                    Daily
                  </option>
                  <option value="WW">Weekly on Wednesday</option>
                  <option value="EW">Every weekday</option>
                  <option value="CU">Custom</option>
                </Select>
              </div>
              <div>
                <div className="mb-1 flex items-center">
                  <button className="mb-2 mr-2 inline-flex items-center rounded-lg bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50 dark:focus:ring-[#4285F4]/55">
                    Join with Google Meet
                  </button>
                  <div className="ml-1 flex">
                    <Tooltip content="Video call options">
                      <button className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="sr-only">Call options</span>
                      </button>
                    </Tooltip>
                    <Tooltip content="Copy conference info">
                      <button className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z"></path>
                          <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path>
                        </svg>
                        <span className="sr-only">Copy conference info</span>
                      </button>
                    </Tooltip>
                    <Tooltip content="Remove conference">
                      <button className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg
                          aria-hidden="true"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="sr-only">Remove conference</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  meet.google.com/asd-fgh-jfgu
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Up to 100 guest connections
                </p>
              </div>
              <div>
                <div className="mb-2 block dark:text-white">Tag Color</div>
                <div className="flex items-center space-x-2">
                  <button className="h-6 w-6 rounded-sm bg-purple-500" />
                  <button className="h-6 w-6 rounded-sm bg-indigo-500" />
                  <button className="h-6 w-6 rounded-sm bg-primary-600" />
                  <button className="h-6 w-6 rounded-sm bg-pink-500" />
                  <button className="h-6 w-6 rounded-sm bg-teal-400" />
                  <button className="h-6 w-6 rounded-sm bg-green-400" />
                  <button className="h-6 w-6 rounded-sm bg-yellow-300" />
                  <button className="h-6 w-6 rounded-sm bg-orange-400" />
                  <button className="h-6 w-6 rounded-sm bg-red-500" />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="mb-2 block dark:text-white"
                >
                  Description
                </Label>
                <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-600">
                  <div className="flex items-center justify-between border-b px-3 py-2 dark:border-gray-600">
                    <div className="flex flex-wrap items-center divide-gray-200 dark:divide-gray-600 sm:divide-x">
                      <div className="flex items-center space-x-1 sm:pr-4">
                        <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                          <svg
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="sr-only">Attach file</span>
                        </button>
                        <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                          <svg
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="sr-only">Embed map</span>
                        </button>
                        <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                          <svg
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="sr-only">Upload image</span>
                        </button>
                        <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                          <svg
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="sr-only">Format code</span>
                        </button>
                        <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                          <svg
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="sr-only">Add emoji</span>
                        </button>
                      </div>
                      <div className="hidden flex-wrap items-center space-x-1 sm:flex sm:pl-4">
                        <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                          <svg
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="sr-only">Timeline</span>
                        </button>
                        <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                          <svg
                            aria-hidden
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="sr-only">Download</span>
                        </button>
                      </div>
                    </div>
                    <Tooltip content="Show full screen">
                      <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white sm:ml-auto">
                        <svg
                          aria-hidden
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="sr-only">Full screen</span>
                      </button>
                    </Tooltip>
                  </div>
                  <div className="rounded-b-lg bg-gray-50 px-4 py-2 dark:bg-gray-700">
                    <Textarea
                      defaultValue="The 4th Digital Transformation and Industry 4.0 Free Online Conference Organized by Flowbite and Themesberg, Live on Saturday 26th Nov at 02:00 pm GMT | 04:00 pm EET on Zoom Webinars"
                      id="description"
                      name="description"
                      required
                      rows={8}
                      className="border-0 px-0 text-sm focus:ring-0"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-2 block dark:text-white">Reminder</div>
                <div className="space-y-4 md:flex md:space-x-4 md:space-y-0">
                  <div className="w-full">
                    <Label htmlFor="reminder-type" className="sr-only">
                      Reminder type
                    </Label>
                    <Select id="reminder-type">
                      <option selected>Notification</option>
                      <option value="AL">Alarm</option>
                      <option value="EM">Email</option>
                      <option value="SM">SMS</option>
                    </Select>
                  </div>
                  <div className="w-full">
                    <Label htmlFor="reminder-counter" className="sr-only">
                      Counter
                    </Label>
                    <TextInput
                      defaultValue="4"
                      id="reminder-counter-days"
                      name="reminder-counter"
                      required
                      type="number"
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor="reminder-length-type" className="sr-only">
                      Length
                    </Label>
                    <Select id="reminder-length-type">
                      <option selected>Days</option>
                      <option value="WE">Weeks</option>
                      <option value="MO">Months</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4 space-y-4">
              <div>
                <Label
                  htmlFor="add-guests"
                  className="mb-2 block dark:text-white"
                >
                  Add guests
                </Label>
                <div className="relative">
                  <TextInput
                    id="add-guests"
                    placeholder="Add guest email"
                    required
                  />
                  <Button className="absolute inset-y-2.5 right-2.5 inline-flex items-center rounded-lg bg-primary-700 px-3 py-1.5 font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 [&>span]:p-0 [&>span]:text-xs">
                    <svg
                      className="-ml-0.5 mr-0.5 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add
                  </Button>
                </div>
              </div>
              <div className="items-center md:flex md:space-x-4">
                <AvatarGroup className="mb-4 flex shrink-0 md:mb-0 [&_img]:h-8 [&_img]:w-8 dark:[&_img]:ring-gray-800">
                  <Avatar
                    alt="Helene Engels"
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png"
                    rounded
                    stacked
                  />
                  <Avatar
                    alt="Robert Brown"
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/robert-brown.png"
                    rounded
                    stacked
                  />
                  <Avatar
                    alt="Bonnie Green"
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                    rounded
                    stacked
                  />
                  <AvatarGroupCounter
                    href="#"
                    total={9}
                    className="h-8 w-8 dark:ring-gray-800"
                  />
                </AvatarGroup>
                <Button
                  color="gray"
                  outline
                  className="mr-3 inline-flex hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 [&>span]:border-gray-200 [&>span]:bg-white [&>span]:text-xs [&>span]:text-gray-900 dark:[&>span]:border-gray-600 dark:[&>span]:bg-gray-800 dark:[&>span]:text-gray-400"
                >
                  <svg
                    aria-hidden
                    className="-ml-1 mr-1 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add member
                </Button>
                <Button
                  color="gray"
                  outline
                  className="mr-3 inline-flex hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 [&>span]:border-gray-200 [&>span]:bg-white [&>span]:text-xs [&>span]:text-gray-900 dark:[&>span]:border-gray-600 dark:[&>span]:bg-gray-800 dark:[&>span]:text-gray-400"
                >
                  <svg
                    aria-hidden
                    className="-ml-1 mr-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Find a time
                </Button>
              </div>
              <div>
                <p className="mb-2 block dark:text-white">Guest Permissions</p>
                <div className="space-y-3">
                  <div className="mr-4 flex items-center">
                    <Checkbox
                      id="guest-permission-1-checkbox"
                      name="guest-permission-checkbox"
                    />
                    <Label
                      htmlFor="guest-permission-1-checkbox"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Modify event
                    </Label>
                  </div>
                  <div className="mr-4 flex items-center">
                    <Checkbox
                      id="guest-permission-2-checkbox"
                      name="guest-permission-checkbox"
                    />
                    <Label
                      htmlFor="guest-permission-2-checkbox"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Invite others
                    </Label>
                  </div>
                  <div className="mr-4 flex items-center">
                    <Checkbox
                      defaultChecked
                      id="guest-permission-3-checkbox"
                      name="guest-permission-checkbox"
                    />
                    <Label
                      htmlFor="guest-permission-3-checkbox"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      See guest list
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-4">
            <Button type="submit" className="[&>span]:px-5 [&>span]:py-2.5">
              Update event
            </Button>
            <Button
              color="failure"
              outline
              theme={{
                color: {
                  failure:
                    "border border-transparent bg-red-600 text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-red-600 dark:bg-red-600 dark:focus:ring-red-900 dark:enabled:hover:bg-red-500",
                },
                outline: {
                  on: "flex w-full justify-center bg-white text-red-600 transition-all duration-75 ease-in group-enabled:group-hover:bg-opacity-0 group-enabled:group-hover:text-inherit dark:bg-gray-900 dark:text-red-500",
                },
              }}
              className="[&>span]:border-red-600 [&>span]:px-5 [&>span]:py-2.5"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                className="-ml-1 mr-1 h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
