/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 6s ease-in-out 3s infinite',
        'blob-1': 'blob-1 20s ease-in-out infinite',
        'blob-2': 'blob-2 25s ease-in-out infinite',
        'blob-3': 'blob-3 22s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'gradient': 'gradient-shift 4s ease infinite',
      },
    },
  },
  plugins: [],
};
