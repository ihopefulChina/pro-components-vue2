<template>
  <ProFormItem
    :name="name"
    :label="label"
    :span="span"
    :required="required"
    :rules="rules"
    :tooltip="tooltip"
  >
    <el-input-number
      v-model="numberValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :min="min"
      :max="max"
      :step="step"
      :precision="precision"
      :controls="controls"
      v-bind="$attrs"
    />
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import ProFormItem from "../ProFormItem.vue";

export default defineComponent({
  name: "ProFormNumber",
  components: { ProFormItem },
  inheritAttrs: false,
  props: {
    // 表单项属性
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    span: {
      type: Number,
      default: 24,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    // 提示信息
    tooltip: {
      type: String,
      default: "",
    },
    // 数字输入框属性
    value: {
      type: [String, Number],
      default: undefined,
    },
    placeholder: {
      type: String,
      default: "请输入数字",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
    step: {
      type: Number,
      default: 1,
    },
    precision: {
      type: Number,
      default: undefined,
    },
    controls: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["input"],
  setup(props, { emit }) {
    const numberValue = computed({
      get: () => props.value,
      set: val => emit("input", val),
    });

    return {
      numberValue,
    };
  },
});
</script>
