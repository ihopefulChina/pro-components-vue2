<template>
  <SiteShell>
    <header class="doc-hero">
      <span>Composition API</span>
      <h1>Hooks 与工具</h1>
      <p>把反馈、异步锁、表格请求和表单状态沉淀为可组合能力。</p>
    </header>
    <section v-for="(items, group) in hookGroups" :key="group" class="overview-group">
      <div class="overview-group__heading">
        <h2>{{ group }}</h2>
        <span>{{ items.length }}</span>
      </div>
      <div class="overview-grid">
        <RouterLink
          v-for="item in items"
          :key="item.slug"
          :to="`/hooks/${item.slug}`"
          class="overview-card"
        >
          <div>
            <code>{{ item.name }}</code>
            <span>API</span>
          </div>
          <p>{{ item.description }}</p>
          <small>查看签名与示例</small>
        </RouterLink>
      </div>
    </section>
  </SiteShell>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import SiteShell from "@docs/components/SiteShell.vue";
import { hookGroups } from "@docs/content/hooks";

export default defineComponent({
  name: "HooksOverview",
  components: { SiteShell },
  setup: () => ({ hookGroups }),
});
</script>
