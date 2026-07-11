/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0A0A0A",
        panel: "#121212",
        panel2: "#181818",
        border: "#262626",
        accent: "#2979FF",
        accentHover: "#5393FF",
        trusted: "#22C55E",
        warning: "#EF4444",
        caution: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
