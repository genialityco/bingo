/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "pulse-infinite": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "mark-in": {
          from: { transform: "scale(0)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "mark-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0)", opacity: "0" },
        },
      },
      animation: {
        "pulse-infinite":
          "pulse-infinite 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "mark-in": "mark-in 0.5s ease-in-out forwards",
        "mark-out": "mark-out 0.5s ease-in-out forwards",
      },
      colors: {
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
});
