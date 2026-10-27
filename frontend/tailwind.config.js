/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1c1c1c',
        card: '#161616',
        primary: '#f95e26', // the orange color from the image
        sidebar: '#242424',
        border: '#333'
      },
    },
  },
  plugins: [],
}
