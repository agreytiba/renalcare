/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A", // Deep blue
        secondary: "#38BDF8", // Light blue
        accent: "#F43F5E", // Soft red for blood/emergency
        success: "#22C55E", // Green
        warning: "#F59E0B", // Orange/Yellow
        background: "#F8FAFC", // Light gray/blue
        surface: "#FFFFFF",
        text: "#1E293B",
        textLight: "#64748B",
      }
    },
  },
  plugins: [],
}
