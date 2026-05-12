import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        navy: "#07111f",
        ink: "#0f172a",
        mist: "#f8fafc"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(79, 70, 229, 0.22)",
        soft: "0 20px 55px rgba(15, 23, 42, 0.12)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        mesh: "mesh 14s ease-in-out infinite alternate",
        caret: "caret 1s steps(1) infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -14px, 0)" }
        },
        mesh: {
          "0%": { transform: "translate3d(-4%, -3%, 0) scale(1)" },
          "100%": { transform: "translate3d(4%, 3%, 0) scale(1.08)" }
        },
        caret: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
