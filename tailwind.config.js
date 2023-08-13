/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ffcc00",
        secondary: "#252525",
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