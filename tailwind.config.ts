import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#fefdf3",
          light: "#ffffff",
          dark: "#eff0e0",
          subtle: "#f7f7f7",
          border: "rgba(33, 29, 29, 0.14)",
          borderDark: "rgba(255, 255, 255, 0.14)",
        },
        ink: {
          DEFAULT: "#211d1d",
          dark: "#0a0a0a",
          black: "#000000",
          muted: "#575757",
          submuted: "#6e6e6e",
          light: "#fefdf3",
        },
        editorial: {
          red: "#f7413e",
          navy: "#002b5c",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Libre Baskerville", "Playfair Display", "Georgia", "serif"],
        baskerville: ["var(--font-baskerville)", "Libre Baskerville", "Georgia", "serif"],
        headline: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        oswald: ["var(--font-oswald)", "Oswald", "sans-serif"],
        bebas: ["var(--font-bebas)", "Bebas Neue", "sans-serif"],
      },
      maxWidth: {
        'page': '1380px',
      },
    },
  },
  plugins: [],
};

export default config;
