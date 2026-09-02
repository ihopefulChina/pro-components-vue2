<template>
  <SiteShell v-if="doc">
    <article class="doc-article">
      <header class="component-header">
        <div>
          <span>{{ doc.category }}</span>
          <h1>{{ doc.title }}</h1>
          <p>{{ doc.description }}</p>
        </div>
        <a :href="sourceUrl" target="_blank" rel="noopener noreferrer">查看源码 ↗</a>
      </header>
      <section id="demo" class="doc-section">
        <div class="section-title">
          <span>01</span>
          <div>
            <h2>基础用法</h2>
            <p>演示运行的是当前仓库源码，不是静态截图。</p>
          </div>
        </div>
        <DemoBlock :code="doc.code" :description="doc.description">
          <ComponentDemo :name="doc.name" />
        </DemoBlock>
      </section>
      <section id="api" class="doc-section">
        <div class="section-title">
          <span>02</span>
          <div>
            <h2>API</h2>
            <p>公开参数与返回值以 1.0.0 源码为准。</p>
          </div>
        </div>
        <template v-if="doc.props && doc.props.length">
          <h3>Props</h3>
          <ApiTable :rows="doc.props" />
        </template>
        <template v-if="doc.events && doc.events.length">
          <h3>Events</h3>
          <ApiTable :rows="doc.events" />
        </template>
        <template v-if="doc.slots && doc.slots.length">
          <h3>Slots</h3>
          <ApiTable :rows="doc.slots" />
        </template>
        <template v-if="doc.methods && doc.methods.length">
          <h3>Methods</h3>
          <ApiTable :rows="doc.methods" />
        </template>
      </section>
      <nav class="doc-pagination" aria-label="相邻组件">
        <RouterLink v-if="previous" :to="`/components/${previous.slug}`">
          <small>上一个</small>
          <strong>← {{ previous.name }}</strong>
        </RouterLink>
        <span />
        <RouterLink v-if="next" :to="`/components/${next.slug}`">
          <small>下一个</small>
          <strong>{{ next.name }} →</strong>
        </RouterLink>
      </nav>
    </article>
    <template #toc>
      <p>本页内容</p>
      <RouterLink :to="{ path: $route.path, hash: '#demo' }">基础用法</RouterLink>
      <RouterLink :to="{ path: $route.path, hash: '#api' }">API</RouterLink>
      <small>v{{ doc.since }}</small>
    </template>
  </SiteShell>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import ApiTable from "@docs/components/ApiTable.vue";
import ComponentDemo from "@docs/components/ComponentDemo.vue";
import DemoBlock from "@docs/components/DemoBlock.vue";
import SiteShell from "@docs/components/SiteShell.vue";
import { componentBySlug, componentDocs } from "@docs/content/components";

export default defineComponent({
  name: "ComponentPage",
  components: { ApiTable, ComponentDemo, DemoBlock, SiteShell },
  setup(_, { root }) {
    const doc = computed(() => componentBySlug(String(root.$route.params.slug)));
    const index = computed(() => componentDocs.findIndex(item => item.slug === doc.value?.slug));
    const previous = computed(() => componentDocs[index.value - 1]);
    const next = computed(() => componentDocs[index.value + 1]);
    const sourcePath = computed(() => {
      if (!doc.value) return "";
      if (["ProForm", "ProFormItem", "ModalForm", "DrawerForm"].includes(doc.value.name)) {
        return `proForm/${doc.value.name}.vue`;
      }
      if (doc.value.name.startsWith("ProForm")) {
        return `proForm/fields/${doc.value.name}.vue`;
      }
      const folders: Record<string, string> = {
        ProTable: "proTable/index.vue",
        SearchForm: "searchForm/index.vue",
        CustomTabs: "customTabs/index.vue",
        Segmented: "segmented/index.vue",
      };
      return folders[doc.value.name];
    });
    const sourceUrl = computed(
      () =>
        `https://github.com/ihopefulChina/pro-components-vue2/tree/main/src/components/${sourcePath.value}`
    );
    return { doc, next, previous, sourceUrl };
  },
});
</script>
