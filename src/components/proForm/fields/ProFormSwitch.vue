<template>
  <ProFormItem :name="name" :label="label" :span="span" :required="required" :rules="rules" :tooltip="tooltip">
    <el-switch
      v-model="switchValue"
      :disabled="disabled"
      :active-text="activeText"
      :inactive-text="inactiveText"
      :active-value="activeValue"
      :inactive-value="inactiveValue"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      v-bind="$attrs"
    />
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api"
import ProFormItem from "../ProFormItem.vue"

export default defineComponent({
  name: "ProFormSwitch",
  inheritAttrs: false,
  components: { ProFormItem },
  props: {
    // 表单项属性
    name: {
      type: String,
      required: true
    },
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
    rules: {
      type: Array,
      default: () => []
    },
    // 提示信息
    tooltip: {
      type: String,
      default: ""
    },
    // 开关属性
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    activeText: {
      type: String,
      default: ""
    },
    inactiveText: {
      type: String,
      default: ""
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    activeColor: {
      type: String,
      default: "#409EFF"
    },
    inactiveColor: {
      type: String,
      default: "#C0CCDA"
    }
  },
  emits: ["input"],
  setup(props, { emit }) {
    const switchValue = computed({
      get: () => props.value,
      set: val => emit("input", val)
    })

    return {
      switchValue
    }
  }
})
</script>
