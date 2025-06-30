import { createTheme } from "flowbite-react";

export const customTheme = createTheme({
  // Customizacja buttonów
  button: {
    color: {
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      // Neon colors
      neonCyan:
        "bg-cyan-400 text-black shadow-lg shadow-cyan-400/50 transition-all duration-300 hover:bg-cyan-300 hover:shadow-cyan-300/50",
      neonMagenta:
        "bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/50 transition-all duration-300 hover:bg-fuchsia-400 hover:shadow-fuchsia-400/50",
      neonGreen:
        "bg-green-400 text-black shadow-lg shadow-green-400/50 transition-all duration-300 hover:bg-green-300 hover:shadow-green-300/50",
      neonPurple:
        "bg-purple-500 text-white shadow-lg shadow-purple-500/50 transition-all duration-300 hover:bg-purple-400 hover:shadow-purple-400/50",
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
      base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-lg dark:shadow-cyan-500/10",
      children: "flex h-full flex-col justify-center gap-4 p-6",
    },
  },

  // Customizacja navbara
  navbar: {
    root: {
      base: "bg-white px-2 py-2.5 sm:px-4 dark:border-b dark:border-cyan-500/20 dark:bg-gray-900",
    },
    link: {
      base: "block py-2 pr-4 pl-3 md:p-0",
      active: {
        on: "bg-primary-700 md:text-primary-700 text-white md:bg-transparent dark:text-cyan-400 dark:shadow-sm dark:shadow-cyan-400/50",
        off: "md:hover:text-primary-700 text-gray-700 hover:bg-gray-100 md:hover:bg-transparent dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-cyan-300 dark:hover:shadow-sm dark:hover:shadow-cyan-300/30",
      },
    },
  },

  // Customizacja sidebara
  sidebar: {
    root: {
      base: "h-full",
      inner:
        "h-full overflow-x-hidden overflow-y-auto rounded bg-gray-50 px-3 py-4 dark:border-r dark:border-cyan-500/20 dark:bg-gray-800",
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 transition-all duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-cyan-300 dark:hover:shadow-sm dark:hover:shadow-cyan-300/20",
      active:
        "bg-gray-100 dark:bg-gray-700 dark:text-cyan-400 dark:shadow-sm dark:shadow-cyan-400/30",
    },
  },
});

// Neon Theme Variant
export const neonTheme = createTheme({
  button: {
    color: {
      primary:
        "transform bg-gradient-to-r from-cyan-400 to-blue-500 font-semibold text-black shadow-lg shadow-cyan-400/50 transition-all duration-300 hover:scale-105 hover:from-cyan-300 hover:to-blue-400 hover:shadow-cyan-300/70",
      secondary:
        "transform bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:from-purple-400 hover:to-pink-400 hover:shadow-purple-400/70",
      accent:
        "transform bg-gradient-to-r from-green-400 to-emerald-500 font-semibold text-black shadow-lg shadow-green-400/50 transition-all duration-300 hover:scale-105 hover:from-green-300 hover:to-emerald-400 hover:shadow-green-300/70",
    },
  },

  card: {
    root: {
      base: "flex rounded-xl border border-cyan-500/30 bg-gray-900 shadow-2xl shadow-cyan-500/20 backdrop-blur-sm transition-all duration-300 hover:shadow-cyan-400/30",
      children: "flex h-full flex-col justify-center gap-4 p-6",
    },
  },

  navbar: {
    root: {
      base: "border-b border-cyan-500/30 bg-gray-900/90 px-2 py-2.5 shadow-lg shadow-cyan-500/10 backdrop-blur-md sm:px-4",
    },
    link: {
      base: "block py-2 pr-4 pl-3 transition-all duration-300 md:p-0",
      active: {
        on: "glow-text-cyan font-semibold text-cyan-400 shadow-sm shadow-cyan-400/50",
        off: "text-gray-300 hover:text-cyan-300 hover:shadow-sm hover:shadow-cyan-300/30",
      },
    },
  },
});
