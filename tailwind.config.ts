import type { Config } from "tailwindcss";
import { colors } from "component-nest/colors";

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/component-nest/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      ...colors,
      primary: {
        DEFAULT: "#27464E",
      },
      "on-primary": {
        DEFAULT: "#FEAE88",
      },
      secondary: {
        DEFAULT: "#FEAE88",
      },
      "on-secondary": {
        DEFAULT: "#FFFFFF",
      },
      tertiary: {
        DEFAULT: "#FFFFFF",
      },
      "on-tertiary": {
        DEFAULT: "#27464E",
      },
      disabled: {
        DEFAULT: "#D3D3D3",
      },
    },
    gridTemplateRows: {
      formSection: "30% auto",
    },
  },
  plugins: [],
};
export default config;
