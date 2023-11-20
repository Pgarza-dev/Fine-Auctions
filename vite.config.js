import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  server: {
    hot: true,
    watch: {
      usePolling: true,
    },
  },
});
