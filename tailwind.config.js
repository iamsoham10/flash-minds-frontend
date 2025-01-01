/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./src/app/components/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Urbanist", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
      },
      colors: {
        primary: "#1E2A69",
        secondary: "#4B60D0",
        card: "#F9D399",
        sub_card: "#F9E3C8",
        form: "#586380",
        background: "#FFFCF3",
      },
    },
  },
  plugins: [],
};
