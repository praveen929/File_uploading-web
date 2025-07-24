/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'], // Enable class-based dark mode with multiple selectors
  theme: {
    extend: {},
  },
  plugins: [],
};
