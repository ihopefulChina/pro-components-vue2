import { resolve } from "path";
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";

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
  server: {
    host: "127.0.0.1",
    port: 3000,
    open: true,
    cors: true,
    strictPort: false,
  },
  build: {
    outDir: "dist-dev",
    sourcemap: true,
  },
  // 配置路由重写，让示例项目可以正常访问
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
});