import { defineConfig } from "vitest/config";
import { createVuePlugin } from "vite-plugin-vue2";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    createVuePlugin({
      jsx: true,
      jsxOptions: {
        compositionApi: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
