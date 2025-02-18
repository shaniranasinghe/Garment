/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkblue: '#001f3f', // Dark blue background
        red: '#ff0000',      // Red text color
        white: '#ffffff'     // White for hover effect
      },
    },
  },
  plugins: [],
};
