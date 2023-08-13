/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f24b78",
        secondary: "#0C123E",
        link: "#0788B6"
      },
      fontFamily: {
        sans: ["Work Sans"],
        serif: ["Merriweather"]
      }
    },
  },
  plugins: [],
}