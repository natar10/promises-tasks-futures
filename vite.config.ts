import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
      define: {
        global: 'globalThis'
      },
      supported: {
        bigint: true
      },
    },
  },
  build: {
    target: ["esnext"],
  },
});
