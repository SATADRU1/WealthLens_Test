/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3399E6",
          dark: "#2A7FBD",
        },
        accent: "#40BFBF",
        background: "#F0F8FF",
        surface: "#FFFFFF",
      },
      fontFamily: {
        display: ["Sora_600SemiBold", "Inter-SemiBold", "System"],
        body: ["Sora_400Regular", "Inter-Regular", "System"],
      },
      borderRadius: {
        xl: "16px",
      },
    },
  },
  plugins: [],
}