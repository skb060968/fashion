/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "fashion-gold": "#c8a951",
        "fashion-black": "#1a1a1a",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
}
