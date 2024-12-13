/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0D9488",
        secondary: "#02cbc3",
        error: "#FF3860",
        c_orange: "#fc9312",
        c_yellow: "#fec223",
        c_darkblue: "#116184",
        c_green: "#a8d926",
        c_darkgreen: "#03784b",
        c_darkergreen: "#046e45",
        "custom-red": "#ff0000",
        "custom-dark-red": "#b00000",
      },

      animation: {
        rotate: "rotate 10s linear infinite",
        'fade-in': 'fade-in 0.5s ease-in-out forwards',
        'fade-out': 'fade-out 0.5s ease-in-out forwards',
      },
      keyframes: {
        rotate: {
          "0%": { transform: "rotate(0deg) scale(10)" },
          "100%": { transform: "rotate(-360deg) scale(10)" },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'fade-out': {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.8)' },
        },
      },
      // Add custom easing function for the spring effect
      transitionTimingFunction: {
        spring: "cubic-bezier(0.39, 0.58, 0.26, 1.02)", // Custom spring-like timing
      },
    },
  },
  plugins: [],
};
