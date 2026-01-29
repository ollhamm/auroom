import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#d4af37",
        secondary: "#f1c232",
        "bg-main": "#fffbf2",
        "bg-card": "#ffffff",
        "text-primary": "#1f1f1f",
        "text-secondary": "#6b6b6b",
        border: "#e6e0d4",
        success: "#2ec4b6",
        error: "#e63946",
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
