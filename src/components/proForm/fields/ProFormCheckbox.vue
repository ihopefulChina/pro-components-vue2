<template>
  <ProFormItem
    :name="name"
    :label="label"
    :span="span"
    :required="required"
    :rules="rules"
    :tooltip="tooltip"
  >
    <el-checkbox-group
      v-model="checkboxValue"
      :disabled="disabled"
      :min="min"
      :max="max"
      :size="size"
      :text-color="textColor"
      :fill="fill"
      v-bind="$attrs"
      @change="handleChange"
    >
      <el-checkbox
        v-for="option in options"
        :key="option.value"
        :label="option.value"
        :disabled="option.disabled"
        :border="border"
      >
        {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>
  </ProFormItem>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@vue/composition-api";
import ProFormItem from "../ProFormItem.vue";

interface Option {
  label: string;
  value: any;
  disabled?: boolean;
}

export default defineComponent({
  name: "ProFormCheckbox",
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
    // 复选框属性
    value: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array as PropType<Option[]>,
      default: () => [],
    },
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
    size: {
      type: String,
      default: "medium",
    },
    textColor: {
      type: String,
      default: "#409EFF",
    },
    fill: {
      type: String,
      default: "#409EFF",
    },
    border: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["input", "change"],
  setup(props, { emit }) {
    const checkboxValue = computed({
      get: () => {
        return props.value;
      },
      set: val => {
        emit("input", val);
      },
    });

    const handleChange = (value: any) => {
      emit("change", value);
    };

    return {
      checkboxValue,
      handleChange,
    };
  },
});
</script>
