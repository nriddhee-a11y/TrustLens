/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0A0A0C",
        panel: "#131316",
        panel2: "#1B1B1F",
        border: "#26262C",
        borderStrong: "#38383F",
        accent: "#3B7FFF",
        accentHover: "#5C93FF",
        accentDim: "#1E3A6E",
        trusted: "#2FD999",
        warning: "#F1495F",
        caution: "#F5A623",
        ink: "#F2F3F5",
        muted: "#9497A0",
        faint: "#8A8D96",
        mint: "#34F5A0",
        mintDim: "#0F2A20",
        landing: "#080B0A",
        landingPanel: "#0C1613",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        wideish: "0.08em",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};
