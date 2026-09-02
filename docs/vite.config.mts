import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, Plugin } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { componentDocs } from "./src/content/components";
import { guides } from "./src/content/guides";
import { hookDocs } from "./src/content/hooks";

const routePaths = [
  "components",
  "hooks",
  ...componentDocs.map(item => `components/${item.slug}`),
  ...hookDocs.map(item => `hooks/${item.slug}`),
  ...guides.map(item => `guide/${item.slug}`),
];

const githubPagesFallback: Plugin = {
  name: "github-pages-spa-fallback",
  apply: "build",
  closeBundle() {
    const entry = resolve(__dirname, "dist/index.html");
    copyFileSync(entry, resolve(__dirname, "dist/404.html"));
    routePaths.forEach(routePath => {
      const routeDirectory = resolve(__dirname, "dist", routePath);
      mkdirSync(routeDirectory, { recursive: true });
      copyFileSync(entry, resolve(routeDirectory, "index.html"));
    });
  },
};

export default defineConfig(({ command }) => ({
  base: command === "build" ? process.env.DOCS_BASE || "/pro-components-vue2/" : "/",
  plugins: [createVuePlugin(), githubPagesFallback],
  resolve: {
    alias: [
      { find: "@docs", replacement: resolve(__dirname, "src") },
      { find: /^pro-components-vue2$/, replacement: resolve(__dirname, "../src/index.ts") },
      { find: "@", replacement: resolve(__dirname, "../src") },
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 4175,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    // 文档站要在一个运行时展示 Element UI 全量组件；该 vendor chunk 不进入 npm 库包。
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/element-ui") ||
            id.includes("node_modules/vue") ||
            id.includes("node_modules/@vue")
          ) {
            return "ui-runtime";
          }
          if (id.includes("node_modules/vuedraggable")) return "sortable";
          return undefined;
        },
      },
    },
  },
}));
