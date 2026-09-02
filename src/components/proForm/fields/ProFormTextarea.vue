<template>
  <ProFormItem
    :name="name"
    :label="label"
    :span="span"
    :required="required"
    :rules="rules"
    :tooltip="tooltip"
  >
    <el-input
      v-model="textareaValue"
      type="textarea"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :show-word-limit="computedShowWordLimit"
      :rows="rows"
      :autosize="autosize"
      :resize="resize"
      v-bind="$attrs"
    />
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import ProFormItem from "../ProFormItem.vue";

export default defineComponent({
  name: "ProFormTextarea",
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
    // 输入框属性
    value: {
      type: [String, Number],
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: Number,
      default: undefined,
    },
    showWordLimit: {
      type: Boolean,
      default: undefined,
    },
    rows: {
      type: Number,
      default: 3,
    },
    autosize: {
      type: [Boolean, Object],
      default: false,
    },
    resize: {
      type: String,
      default: "vertical",
    },
  },
  emits: ["input"],
  setup(props, { emit }) {
    const textareaValue = computed({
      get: () => props.value,
      set: val => emit("input", val),
    });

    const computedShowWordLimit = computed(() => {
      return props.showWordLimit !== undefined ? props.showWordLimit : !!props.maxlength;
    });

    return {
      textareaValue,
      computedShowWordLimit,
    };
  },
});
</script>
