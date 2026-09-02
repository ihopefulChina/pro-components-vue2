<template>
  <ProFormItem
    :name="name"
    :label="label"
    :span="span"
    :required="required"
    :rules="rules"
    :tooltip="tooltip"
  >
    <el-slider
      v-model="sliderValue"
      :min="min"
      :max="max"
      :disabled="disabled"
      :step="step"
      :show-input="showInput"
      :show-input-controls="showInputControls"
      :input-size="inputSize"
      :show-stops="showStops"
      :show-tooltip="showTooltip"
      :format-tooltip="formatTooltip"
      :range="range"
      :vertical="vertical"
      :height="height"
      :label="sliderLabel"
      :debounce="debounce"
      :tooltip-class="tooltipClass"
      v-bind="$attrs"
    />
    <span v-if="showValue">{{ valueText }}</span>
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "@vue/composition-api";
import ProFormItem from "../ProFormItem.vue";

export default defineComponent({
  name: "ProFormSlider",
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
    // 滑块属性
    value: {
      type: [Number, Array],
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    showInput: {
      type: Boolean,
      default: false,
    },
    showInputControls: {
      type: Boolean,
      default: true,
    },
    inputSize: {
      type: String,
      default: "small",
    },
    showStops: {
      type: Boolean,
      default: false,
    },
    showTooltip: {
      type: Boolean,
      default: true,
    },
    formatTooltip: {
      type: Function as PropType<(val: number) => string>,
      default: undefined,
    },
    range: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "",
    },
    sliderLabel: {
      type: String,
      default: "",
    },
    debounce: {
      type: Number,
      default: 300,
    },
    tooltipClass: {
      type: String,
      default: "",
    },
    showValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["input", "change"],
  setup(props, { emit }) {
    const sliderValue = computed({
      get: () => props.value,
      set: val => {
        emit("input", val);
        emit("change", val);
      },
    });
    const valueText = computed(() => {
      if (props.value !== undefined && props.value !== null) {
        if (Array.isArray(props.value)) {
          return `${props.value[0]}-${props.value[1]}`;
        }
        return props.value;
      }
      return "";
    });

    return {
      sliderValue,
      valueText,
    };
  },
});
</script>
