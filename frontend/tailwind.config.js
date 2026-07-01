/** @type {import('tailwindcss').Config} */
export default {
  // This is the critical line — tells Tailwind to use the .dark class
  // on <html> to activate dark mode, which ThemeContext already sets correctly
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
