/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/preline/preline.js"],
  theme: {
    extend: {},
  },
  plugins: [],
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "!./src/components/Navbar.js"],
    // Include any other options you have for purge here
  },
};
