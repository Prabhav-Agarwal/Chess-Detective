import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        fetchGames: resolve(__dirname, "fetchGames.html"),
        gameReview: resolve(__dirname, "gameReview.html"),
      },
    },
  },
});
