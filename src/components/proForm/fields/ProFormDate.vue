<template>
  <ProFormItem
    :name="name"
    :label="label"
    :span="span"
    :required="required"
    :rules="rules"
    :tooltip="tooltip"
  >
    <el-date-picker
      v-model="dateValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :format="format"
      :value-format="valueFormat"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      class="pro-form-date-picker"
      v-bind="$attrs"
    />
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "@vue/composition-api";
import ProFormItem from "../ProFormItem.vue";

export default defineComponent({
  name: "ProFormDate",
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
    // 日期选择器属性
    value: {
      type: [String, Date, Array, Number],
      default: undefined,
    },
    type: {
      type: String as PropType<"date" | "daterange" | "datetime" | "datetimerange">,
      default: "date",
    },
    startPlaceholder: {
      type: String,
      default: "开始时间",
    },
    endPlaceholder: {
      type: String,
      default: "结束时间",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    format: {
      type: String,
      default: undefined,
    },
    valueFormat: {
      type: String,
      default: undefined,
    },
  },
  emits: ["input"],
  setup(props, { emit }) {
    const dateValue = computed({
      get: () => props.value,
      set: val => {
        emit("input", val);
      },
    });

    return {
      dateValue,
    };
  },
});
</script>

<style lang="scss" scoped>
.pro-form-date-picker {
  width: 100%;
}
</style>
