<template>
  <div class="api-table-wrap">
    <table class="api-table">
      <thead>
        <tr>
          <th>名称</th>
          <th>说明</th>
          <th>类型</th>
          <th>默认值</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="`${row.name}-${row.type}`">
          <td>
            <code>{{ row.name }}</code>
          </td>
          <td>{{ row.description }}</td>
          <td>
            <code>{{ row.type }}</code>
          </td>
          <td>
            <code>{{ row.defaultValue || "—" }}</code>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";
import type { ApiRow } from "@docs/content/types";

export default defineComponent({
  name: "ApiTable",
  props: { rows: { type: Array as PropType<ApiRow[]>, required: true } },
});
</script>
