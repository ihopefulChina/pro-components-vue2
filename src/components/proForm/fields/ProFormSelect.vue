<template>
  <ProFormItem :name="name" :label="label" :span="span" :required="required" :rules="rules" :tooltip="tooltip">
    <el-select
      v-model="selectValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :multiple="multiple"
      :filterable="filterable"
      v-bind="$attrs"
      @change="handleChange"
    >
      <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value" :disabled="option.disabled" />
    </el-select>
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
  name: "ProFormSelect",
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
    // 选择器属性
    value: {
      type: [String, Number, Array],
      default: undefined
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array as PropType<Option[]>,
      default: () => []
    }
  },
  emits: ["input", "change"],
  setup(props, { emit }) {
    const selectValue = computed({
      get: () => props.value,
      set: val => emit("input", val)
    })

    const handleChange = (value: any) => {
      emit("change", value)
    }

    return {
      selectValue,
      handleChange
    }
  }
})
</script>
