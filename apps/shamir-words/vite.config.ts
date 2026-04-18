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
          "shamir-words": ["@forgesworn/shamir-words"],
        },
      },
    },
  },
  server: {
    port: 5174,
    strictPort: false,
  },
  preview: {
    port: 4174,
  },
});
