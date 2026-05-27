import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./server/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#050608",
          900: "#0a0d12",
          800: "#111722",
          700: "#1b2432",
        },
        electric: "#3b82ff",
        holo: "#22d3ee",
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.18)",
        "glow-blue": "0 0 44px rgba(59, 130, 255, 0.2)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
          "50%": { transform: "translate3d(14px,-18px,0) rotate(2deg)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        drift: "drift 12s ease-in-out infinite",
        scan: "scan 3.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
