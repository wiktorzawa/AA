import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Dodaj helper Flowbite, aby skanował komponenty z biblioteki
    flowbite.content(),
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  // Dodaj plugin Flowbite, aby aktywować style i interaktywność
  plugins: [flowbite.plugin()],
};
