/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: [
      "./src/**/*.{html,js,mjs}",
      "./*.html",
      "./node_modules/flowbite/**/*.js",
    ],
  },
  theme: {
    extend: {
      backgroundSize: {
        "50%": "50%",
        "100%": "100%",
        "200%": "200%",
        "300%": "300%",
        "400%": "400%",
        "500%": "500%",
      },
      colors: {
        "primary-button": "#D12600",
        "primary-background": "#2B3138",
        "primary-text": "#D12600",
        "border-orange-500": "#D12600",
      },
    },
  },
  variants: {
    extend: {
      display: ["group-focus"],
    },
  },
  plugins: [require("flowbite/plugin")],
};
