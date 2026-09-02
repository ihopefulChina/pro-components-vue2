<template>
  <aside
    id="docs-side-nav"
    class="side-nav"
    :class="{ 'side-nav--open': open }"
    aria-label="文档目录"
    :aria-hidden="mobile && !open ? 'true' : undefined"
    :inert="mobile && !open"
  >
    <button class="side-nav__close" type="button" aria-label="关闭目录" @click="$emit('close')">
      ×
    </button>
    <section class="nav-section">
      <p>指南</p>
      <RouterLink
        v-for="guide in guides"
        :key="guide.slug"
        :to="`/guide/${guide.slug}`"
        @click.native="$emit('close')"
      >
        {{ guide.title }}
      </RouterLink>
    </section>
    <section class="nav-section">
      <p>组件</p>
      <RouterLink to="/components" @click.native="$emit('close')">
        组件总览
        <span>{{ componentDocs.length }}</span>
      </RouterLink>
    </section>
    <section
      v-for="(items, group) in componentGroups"
      :key="group"
      class="nav-section nav-section--compact"
    >
      <p>{{ group }}</p>
      <RouterLink
        v-for="item in items"
        :key="item.slug"
        :to="`/components/${item.slug}`"
        @click.native="$emit('close')"
      >
        {{ item.name }}
      </RouterLink>
    </section>
    <section class="nav-section nav-section--compact">
      <p>Hooks 与工具</p>
      <RouterLink to="/hooks" @click.native="$emit('close')">
        Hooks 总览
        <span>{{ hookDocs.length }}</span>
      </RouterLink>
      <RouterLink
        v-for="item in hookDocs"
        :key="item.slug"
        :to="`/hooks/${item.slug}`"
        @click.native="$emit('close')"
      >
        {{ item.name }}
      </RouterLink>
    </section>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { componentDocs, componentGroups } from "@docs/content/components";
import { guides } from "@docs/content/guides";
import { hookDocs } from "@docs/content/hooks";

export default defineComponent({
  name: "SideNav",
  props: { open: { type: Boolean, default: false }, mobile: { type: Boolean, default: false } },
  emits: ["close"],
  setup: () => ({ componentDocs, componentGroups, guides, hookDocs }),
});
</script>
