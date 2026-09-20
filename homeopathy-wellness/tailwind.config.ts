import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Original "Homeopathy Wellness" identity — calm, herbal, trustworthy.
        // Not derived from any reference brand's actual palette.
        brand: {
          50: "#f2f7f3",
          100: "#e2ede4",
          200: "#c3dcc8",
          300: "#9dc4a4",
          400: "#71a37c",
          500: "#4f8360",
          600: "#3c684c",
          700: "#31533f",
          800: "#294334",
          900: "#22372c",
        },
        clay: {
          50: "#fbf7f2",
          100: "#f3e9dc",
          200: "#e5cfb1",
          300: "#d4ac7d",
          400: "#c28c54",
          500: "#a9713c",
        },
        ink: "#1c2420",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(28, 36, 32, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
