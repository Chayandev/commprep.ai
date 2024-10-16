/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D9488',
        secondary: '#02cbc3',
        error: '#FF3860',
        c_orange:"#fc9312",
        c_yellow:"#fec223",
        c_darkblue:"#116184",
        c_green:"#a8d926",
        c_darkgreen:"#03784b",
        c_darkergreen:"#046e45",
        'custom-red': '#ff0000', 
        'custom-dark-red': '#b00000',
      },
    },
  },
  plugins: [],
}

