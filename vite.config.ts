import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { createVuePlugin } from "vite-plugin-vue2";

export default defineConfig({
  plugins: [
    createVuePlugin({
      jsx: true,
      jsxOptions: {
        compositionApi: true,
      },
    }),
    dts({
      include: ["src/**/*"],
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    }),
    libInjectCss(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "localhost",
    port: 3000,
    open: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ProComponentsVue2",
      fileName: format => `index.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["vue", "@vue/composition-api", "element-ui"],
      output: {
        globals: {
          vue: "Vue",
          "@vue/composition-api": "VueCompositionAPI",
          "element-ui": "ElementUI",
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
