import { createTheme } from "flowbite-react";

export const customTheme = createTheme({
  // Customizacja buttonów
  button: {
    color: {
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    },
    size: {
      xs: "px-2 py-1 text-xs",
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-2.5 text-base",
      xl: "px-6 py-3 text-lg",
    },
  },

  // Customizacja kart
  card: {
    root: {
      base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
      children: "flex h-full flex-col justify-center gap-4 p-6",
    },
  },

  // Customizacja navbara
  navbar: {
    root: {
      base: "bg-white px-2 py-2.5 sm:px-4 dark:bg-gray-900",
    },
    link: {
      base: "block py-2 pr-4 pl-3 md:p-0",
      active: {
        on: "bg-primary-700 md:text-primary-700 text-white md:bg-transparent dark:text-white",
        off: "md:hover:text-primary-700 text-gray-700 hover:bg-gray-100 md:hover:bg-transparent dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
      },
    },
  },

  // Customizacja sidebara
  sidebar: {
    root: {
      base: "h-full",
      inner:
        "h-full overflow-x-hidden overflow-y-auto rounded bg-gray-50 px-3 py-4 dark:bg-gray-800",
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      active: "bg-gray-100 dark:bg-gray-700",
    },
  },
});
