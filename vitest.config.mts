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
    alias: [
      { find: /^pro-components-vue2$/, replacement: resolve(__dirname, "src/index.ts") },
      { find: "@", replacement: resolve(__dirname, "src") },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,vue}"],
      exclude: ["src/test/**", "src/**/*.d.ts", "src/**/type/**", "src/**/types.ts"],
    },
  },
});
