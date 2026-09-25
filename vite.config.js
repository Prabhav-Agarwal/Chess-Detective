import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "landingPage.html"),
        assets: resolve(__dirname, "chess-detective-assets.html"),
      },
    },
  },
});
