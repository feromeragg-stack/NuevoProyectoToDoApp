/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#F8FAFC",
          100: "#EEF2F6",
          200: "#E3E8EF",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        brand: {
          50: "#EAFBF5",
          100: "#CFF5E6",
          200: "#A0EBD0",
          300: "#72E0BB",
          400: "#44D6A6",
          500: "#16CB91",
          600: "#12A775",
          700: "#0E835A",
          800: "#0A5F40",
          900: "#073A27",
        },
        // 👇 agrego 700/800 para un violeta dark bien marcado
        accent: {
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
        },
        success: { 500: "#10B981" },
        warning: { 500: "#F59E0B" },
        danger: { 500: "#EF4444" },
      },
      boxShadow: { soft: "0 10px 25px rgba(0,0,0,0.08)" },
    },
  },
  plugins: [],
};
