<template>
  <header class="site-header">
    <button
      class="mobile-menu"
      type="button"
      aria-label="打开文档目录"
      aria-controls="docs-side-nav"
      :aria-expanded="menuOpen ? 'true' : 'false'"
      @click="$emit('toggle-menu')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
    </button>
    <RouterLink class="brand" to="/" aria-label="Pro Components Vue2 首页">
      <LogoMark class="brand__mark" />
      <span class="brand__name">
        Pro Components
        <b>Vue2</b>
      </span>
    </RouterLink>

    <nav class="header-nav" aria-label="全局导航">
      <RouterLink to="/guide/getting-started">指南</RouterLink>
      <RouterLink to="/components">组件</RouterLink>
      <RouterLink to="/hooks">Hooks</RouterLink>
    </nav>

    <div class="header-actions">
      <button
        class="theme-toggle"
        type="button"
        :aria-label="themeActionLabel"
        :title="themeActionLabel"
        @click="toggleTheme"
      >
        <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3.5" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" />
        </svg>
      </button>
      <button
        class="search-trigger"
        type="button"
        aria-label="搜索文档"
        @click="$emit('open-search')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <span>搜索文档</span>
        <kbd>⌘ K</kbd>
      </button>
      <span class="version">1.0.0</span>
      <a
        class="github-link"
        href="https://github.com/ihopefulChina/pro-components-vue2"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub 仓库"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.47.09.65-.2.65-.46v-1.67c-2.65.58-3.2-1.12-3.2-1.12-.44-1.1-1.06-1.39-1.06-1.39-.87-.59.06-.58.06-.58.96.07 1.47.99 1.47.99.85 1.46 2.24 1.04 2.79.8.08-.62.33-1.04.6-1.28-2.11-.24-4.34-1.06-4.34-4.7 0-1.04.37-1.89.98-2.55-.1-.24-.43-1.21.09-2.52 0 0 .8-.26 2.61.97A9 9 0 0 1 12 7.18a9 9 0 0 1 2.38.32c1.81-1.23 2.6-.97 2.6-.97.53 1.31.2 2.28.1 2.52.61.66.98 1.51.98 2.55 0 3.65-2.23 4.45-4.35 4.69.34.3.64.87.64 1.76v2.51c0 .26.17.56.65.46A9.5 9.5 0 0 0 12 2.5Z"
          />
        </svg>
      </a>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useTheme } from "../theme";
import LogoMark from "./LogoMark.vue";

export default defineComponent({
  name: "SiteHeader",
  components: { LogoMark },
  props: { menuOpen: { type: Boolean, default: false } },
  emits: ["toggle-menu", "open-search"],
  setup() {
    return useTheme();
  },
});
</script>
