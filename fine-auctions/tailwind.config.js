/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,mjs}", "./*.html"],
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
        "primary-background": "#2B2B2B",
      }
    },
  },
  variants: {
    extend: {
      display: ["group-focus"],
    },
  },
  plugins: [],
};
