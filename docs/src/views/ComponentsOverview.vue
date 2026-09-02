<template>
  <SiteShell>
    <header class="doc-hero">
      <span>Components</span>
      <h1>组件总览</h1>
      <p>
        {{ componentDocs.length }}
        个公开组件，按真实开发任务组织。每个条目都包含可交互演示、复制代码和完整 API。
      </p>
    </header>
    <section v-for="(items, group) in componentGroups" :key="group" class="overview-group">
      <div class="overview-group__heading">
        <h2>{{ group }}</h2>
        <span>{{ items.length }}</span>
      </div>
      <div class="overview-grid">
        <RouterLink
          v-for="item in items"
          :key="item.slug"
          :to="`/components/${item.slug}`"
          class="overview-card"
        >
          <div>
            <code>{{ item.name }}</code>
            <span>1.0.0</span>
          </div>
          <p>{{ item.description }}</p>
          <small>查看示例与 API</small>
        </RouterLink>
      </div>
    </section>
  </SiteShell>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import SiteShell from "@docs/components/SiteShell.vue";
import { componentDocs, componentGroups } from "@docs/content/components";

export default defineComponent({
  name: "ComponentsOverview",
  components: { SiteShell },
  setup: () => ({ componentDocs, componentGroups }),
});
</script>
