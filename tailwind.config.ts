import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apptit: {
          blue: "var(--color-apptit-blue)",
          green: "var(--color-apptit-green)",
          yellow: "var(--color-apptit-yellow)",
          red: "var(--color-apptit-red)",
        },
        grayx: {
          dark: "var(--color-gray-dark)",
          medium: "var(--color-gray-medium)",
          light: "var(--color-gray-light)",
        },
        white: "var(--color-white)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        surface: {
          bg: "var(--surface-bg)",
          card: "var(--surface-card)",
          elevated: "var(--surface-elevated)",
        },
        textx: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          inverse: "var(--text-inverse)",
        },
        borderx: {
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        ringx: {
          DEFAULT: "var(--ring)",
          offset: "var(--ring-offset)",
        },
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        "2xl": "var(--radius-2xl)",
      },
      boxShadow: {
        smx: "var(--shadow-sm)",
        mdx: "var(--shadow-md)",
        lgx: "var(--shadow-lg)",
      },
      transitionTimingFunction: {
        "apptit-in": "var(--ease-in)",
        "apptit-out": "var(--ease-out)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(.96)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in var(--dur-base) var(--ease-out) both",
        "slide-up": "slide-up var(--dur-base) var(--ease-out) both",
        "scale-in": "scale-in var(--dur-base) var(--ease-out) both ",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "var(--container-max)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
        ],
      },
    },
  },
  plugins: [],
};

export default config;