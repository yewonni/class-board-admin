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
        primary: "#96B956",
        primaryHover: "#B7D46B",
        primaryActive: "#769B24",
        secondary: "#CBD5E1",
        sidebarBg: "#111827",
        mainBg: "#F4F4F6",
        accent: "#4B8C79",
        error: "#EF4444 ",
      },
      backgroundImage: {
        "search-icon": "url('/images/search-icon.svg')",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
