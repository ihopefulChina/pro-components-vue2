<template>
  <div v-if="open" class="search-mask" role="presentation" @mousedown.self="$emit('close')">
    <section class="search-dialog" role="dialog" aria-modal="true" aria-label="搜索文档">
      <div class="search-dialog__input">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          ref="input"
          v-model="query"
          type="search"
          placeholder="搜索组件、Hook 或指南"
          @keydown.esc="$emit('close')"
        />
        <kbd>Esc</kbd>
      </div>
      <div class="search-results">
        <RouterLink
          v-for="result in results"
          :key="result.path"
          :to="result.path"
          @click.native="selectResult"
        >
          <span class="search-results__type">{{ result.type }}</span>
          <strong>{{ result.name }}</strong>
          <small>{{ result.description }}</small>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </RouterLink>
        <div v-if="results.length === 0" class="search-empty">
          没有匹配项，试试组件名或能力关键词。
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from "@vue/composition-api";
import { componentDocs } from "@docs/content/components";
import { guides } from "@docs/content/guides";
import { hookDocs } from "@docs/content/hooks";

interface SearchItem {
  name: string;
  description: string;
  type: string;
  path: string;
}

export default defineComponent({
  name: "SearchDialog",
  props: { open: { type: Boolean, default: false } },
  emits: ["close"],
  setup(props, { emit }) {
    const query = ref("");
    const input = ref<HTMLInputElement>();
    const items: SearchItem[] = [
      ...componentDocs.map(item => ({
        name: item.name,
        description: item.description,
        type: "组件",
        path: `/components/${item.slug}`,
      })),
      ...hookDocs.map(item => ({
        name: item.name,
        description: item.description,
        type: "Hook",
        path: `/hooks/${item.slug}`,
      })),
      ...guides.map(item => ({
        name: item.title,
        description: item.summary,
        type: "指南",
        path: `/guide/${item.slug}`,
      })),
    ];
    const results = computed(() => {
      const keyword = query.value.trim().toLowerCase();
      return (
        keyword
          ? items.filter(item =>
              `${item.name} ${item.description} ${item.type}`.toLowerCase().includes(keyword)
            )
          : items
      ).slice(0, 10);
    });
    watch(
      () => props.open,
      value => {
        if (value) nextTick(() => input.value?.focus());
        else query.value = "";
      }
    );
    const selectResult = () => emit("close");
    return { input, query, results, selectResult };
  },
});
</script>
