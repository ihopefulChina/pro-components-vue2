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
      <section id="example" class="doc-section">
        <div class="section-title">
          <span>01</span>
          <div>
            <h2>使用示例</h2>
            <p>在 Vue 2 Composition API 的 setup 中调用。</p>
          </div>
        </div>
        <DemoBlock :code="doc.code" title="基础签名" description="代码可直接复制到 setup。">
          <pre class="hook-preview"><code>{{ doc.code }}</code></pre>
        </DemoBlock>
      </section>
      <section id="api" class="doc-section">
        <div class="section-title">
          <span>02</span>
          <div>
            <h2>API</h2>
            <p>参数、配置和返回能力。</p>
          </div>
        </div>
        <template v-if="doc.props">
          <h3>Parameters</h3>
          <ApiTable :rows="doc.props" />
        </template>
        <template v-if="doc.methods">
          <h3>Returns</h3>
          <ApiTable :rows="doc.methods" />
        </template>
      </section>
    </article>
    <template #toc>
      <p>本页内容</p>
      <a href="#example">使用示例</a>
      <a href="#api">API</a>
    </template>
  </SiteShell>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import ApiTable from "@docs/components/ApiTable.vue";
import DemoBlock from "@docs/components/DemoBlock.vue";
import SiteShell from "@docs/components/SiteShell.vue";
import { hookBySlug } from "@docs/content/hooks";

export default defineComponent({
  name: "HookPage",
  components: { ApiTable, DemoBlock, SiteShell },
  setup(_, { root }) {
    const doc = computed(() => hookBySlug(String(root.$route.params.slug)));
    const sourceUrl = computed(
      () =>
        `https://github.com/ihopefulChina/pro-components-vue2/tree/main/src/${doc.value?.name === "useValidateForm" ? "components/proForm/hooks/useValidateForm.ts" : doc.value?.name === "guid" ? "utils/guid.ts" : `hooks/${doc.value?.name}.ts`}`
    );
    return { doc, sourceUrl };
  },
});
</script>
