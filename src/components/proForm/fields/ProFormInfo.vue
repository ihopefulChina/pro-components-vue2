<template>
  <ProFormItem name="" :label="label" :span="span" :required="required" :tooltip="tooltip" :formItemStyle="value === undefined ? { 'margin-bottom': '0' } : {}">
    <span v-if="value !== undefined">{{ value }}</span>
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api"
import ProFormItem from "../ProFormItem.vue"

export default defineComponent({
  name: "ProFormInfo",
  inheritAttrs: false,
  components: { ProFormItem },
  props: {
    label: {
      type: String,
      required: true
    },
    span: {
      type: Number,
      default: 24
    },
    required: {
      type: Boolean,
      default: false
    },
    // 提示信息
    tooltip: {
      type: String,
      default: ""
    },
    // 输入框属性
    value: {
      type: [String, Number],
      default: ""
    }
  },
  emits: [],
  setup() {
    return {}
  }
})
</script>
<style lang="scss" scoped></style>
