import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "ring-sig": ["@forgesworn/ring-sig"],
        },
      },
    },
  },
  server: {
    port: 5175,
    strictPort: false,
  },
  preview: {
    port: 4175,
  },
});
