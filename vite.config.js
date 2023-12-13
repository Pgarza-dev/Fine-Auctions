import { defineConfig } from "vite";
import * as path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "src"),
  plugins: [],
  server: {
    hot: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/index.html"),
        about: path.resolve(__dirname, "src/about/index.html"),
        login: path.resolve(__dirname, "src/login/index.html"),
        profile: path.resolve(__dirname, "src/profile/index.html"),
        user: path.resolve(__dirname, "src/user_page/index.html"),
        subscribe: path.resolve(__dirname, "src/subscribe/index.html"),
        auction: path.resolve(__dirname, "src/auction_item/index.html"),
        norwegian: path.resolve(__dirname, "src/norwegian/index.html"),
      },
    },
  },
});
