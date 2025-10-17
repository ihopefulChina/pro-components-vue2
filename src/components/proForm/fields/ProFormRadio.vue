<template>
  <ProFormItem :name="name" :label="label" :span="span" :required="required" :rules="rules" :tooltip="tooltip">
    <el-radio-group v-model="radioValue" :disabled="disabled" :size="size" :text-color="textColor" :fill="fill" v-bind="$attrs">
      <el-radio v-for="option in options" :key="option.value" :label="option.value" :disabled="option.disabled" :border="border">
        {{ option.label }}
      </el-radio>
    </el-radio-group>
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "@vue/composition-api"
import ProFormItem from "../ProFormItem.vue"

interface Option {
  label: string
  value: any
  disabled?: boolean
}

export default defineComponent({
  name: "ProFormRadio",
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
    // 单选框属性
    value: {
      type: [String, Number, Boolean],
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array as PropType<Option[]>,
      default: () => []
    },
    size: {
      type: String,
      default: "medium"
    },
    textColor: {
      type: String,
      default: "#409EFF"
    },
    fill: {
      type: String,
      default: "#409EFF"
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  emits: ["input"],
  setup(props, { emit }) {
    const radioValue = computed({
      get: () => props.value,
      set: val => emit("input", val)
    })

    return {
      radioValue
    }
  }
})
</script>
