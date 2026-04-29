import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(0, 229, 255, 0.15)",
        "border-strong": "rgba(0, 229, 255, 0.30)",
        input: "rgba(0, 229, 255, 0.15)",
        ring: "rgba(0, 229, 255, 0.15)",
        background: "#06080f",
        "bg-secondary": "#0b0f1a",
        "bg-tertiary": "#0f1422",
        foreground: "#e2e8f0",
        primary: {
          DEFAULT: "#00e5ff",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#ff3b5c",
          foreground: "#e2e8f0",
        },
        warning: {
          DEFAULT: "#ffb020",
          foreground: "#e2e8f0",
        },
        safe: {
          DEFAULT: "#00ff88",
          foreground: "#e2e8f0",
        },
        muted: {
          DEFAULT: "#64748b",
          foreground: "#64748b",
        },
        secondary: {
          DEFAULT: "#94a3b8",
          foreground: "#e2e8f0",
        },
        card: {
          DEFAULT: "#0b0f1a",
          foreground: "#e2e8f0",
        },
        popover: {
          DEFAULT: "#0b0f1a",
          foreground: "#e2e8f0",
        },
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      fontFamily: {
        sans: ["var(--font-outfit)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
