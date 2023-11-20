import { defineConfig } from "vite";

export default defineConfig({
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
        profile: path.resolve(__dirname, "src/user/index.html"),
        login: path.resolve(__dirname, "src/login/index.html"),
        signup: path.resolve(__dirname, "src/signup/index.html"),
        unauthorized: path.resolve(__dirname, "src/unauthorized/index.html"),
        settings: path.resolve(__dirname, "src/settings/index.html"),
        search: path.resolve(__dirname, "src/search/index.html"),
        post: path.resolve(__dirname, "src/post/index.html"),
        about: path.resolve(__dirname, "src/about/index.html"),
      },
    },
  },
});
