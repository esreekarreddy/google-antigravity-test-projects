import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background
        "bg-deep": "#0a0a0f",
        "bg-surface": "rgba(26, 26, 46, 0.8)",
        "bg-elevated": "rgba(40, 40, 70, 0.6)",

        // Accents
        "accent-cyan": "#00ffff",
        "accent-magenta": "#ff00ff",
        "accent-purple": "#a855f7",
        "accent-blue": "#3b82f6",

        // Text
        "text-primary": "#f5f5f5",
        "text-secondary": "#a1a1aa",
        "text-muted": "#71717a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        "glow-cyan":
          "0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2)",
        "glow-magenta":
          "0 0 20px rgba(255, 0, 255, 0.4), 0 0 40px rgba(255, 0, 255, 0.2)",
        "glow-sm": "0 0 10px rgba(0, 255, 255, 0.3)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        gradient: "gradient-shift 15s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
} satisfies Config;
