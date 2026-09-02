<template>
  <section class="demo-block">
    <div class="demo-block__live"><slot /></div>
    <div class="demo-block__meta">
      <div>
        <strong>{{ title }}</strong>
        <p>{{ description }}</p>
      </div>
      <div class="demo-block__actions">
        <button type="button" @click="copyCode">{{ copied ? "已复制" : "复制代码" }}</button>
        <button
          type="button"
          :aria-expanded="expanded ? 'true' : 'false'"
          @click="expanded = !expanded"
        >
          {{ expanded ? "收起代码" : "查看代码" }}
        </button>
      </div>
    </div>
    <pre v-if="expanded" class="demo-block__code"><code>{{ code }}</code></pre>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  name: "DemoBlock",
  props: {
    title: { type: String, default: "基础用法" },
    description: { type: String, default: "可直接操作下面的真实组件。" },
    code: { type: String, required: true },
  },
  setup(props) {
    const expanded = ref(false);
    const copied = ref(false);
    const copyCode = async () => {
      await navigator.clipboard.writeText(props.code);
      copied.value = true;
      window.setTimeout(() => {
        copied.value = false;
      }, 1200);
    };
    return { copied, copyCode, expanded };
  },
});
</script>
