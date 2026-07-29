/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50:  "#F5F5F6",
          100: "#E4E4E7",
          200: "#C7C7CC",
          300: "#9A9AA2",
          400: "#6E6E76",
          500: "#4A4A52",
          600: "#2A2A32",
          700: "#1E1E24",
          800: "#15151A",
          900: "#0F0F13",
          950: "#0A0A0B",
        },
        bone: {
          50:  "#FAFAF7",
          100: "#F0EFE9",
          200: "#E2E0D6",
          300: "#C9C6B8",
          400: "#A8A493",
        },
        accent: {
          DEFAULT: "#D7FF3A",
          hover: "#C2E82F",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Instrument Serif", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};