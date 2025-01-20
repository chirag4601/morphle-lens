import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "./public",
  base: "",
  build: {
    manifest: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css")
            ? "assets/index.min.css"
            : "[name][extname]",
        entryFileNames: () => "assets/index.min.js",
      },
    },
  },
});
