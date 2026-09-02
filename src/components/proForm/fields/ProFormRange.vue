<template>
  <ProFormItem
    :name="name"
    :label="label"
    :span="span"
    :required="required"
    :rules="rules"
    :tooltip="tooltip"
  >
    <div class="pro-form-range">
      <!-- 输入框模式 -->
      <div v-if="mode === 'input'" class="range-inputs">
        <el-input-number
          v-model="startValue"
          :min="min"
          :max="max"
          :step="step"
          :precision="precision"
          :disabled="disabled"
          :placeholder="startPlaceholder"
          :size="size"
          :class="{ 'is-error': hasError }"
          @change="handleStartChange"
        />
        <span class="range-separator">{{ separator }}</span>
        <el-input-number
          v-model="endValue"
          :min="min"
          :max="max"
          :step="step"
          :precision="precision"
          :disabled="disabled"
          :placeholder="endPlaceholder"
          :size="size"
          :class="{ 'is-error': hasError }"
          @change="handleEndChange"
        />
      </div>

      <!-- 滑块模式 -->
      <div v-else-if="mode === 'slider'" class="range-slider">
        <el-slider
          v-model="rangeValue"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :show-tooltip="showTooltip"
          :format-tooltip="formatTooltip"
          range
          @change="handleChange"
        />
      </div>

      <!-- 选择器模式 -->
      <div v-else-if="mode === 'select'" class="range-selects">
        <el-select
          v-model="startValue"
          :disabled="disabled"
          :placeholder="startPlaceholder"
          :size="size"
          @change="handleChange"
        >
          <el-option
            v-for="option in options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <span class="range-separator">{{ separator }}</span>
        <el-select
          v-model="endValue"
          :disabled="disabled"
          :placeholder="endPlaceholder"
          :size="size"
          @change="handleChange"
        >
          <el-option
            v-for="option in options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

      <!-- 显示当前值 -->
      <div v-if="showValue && rangeValue" class="range-display">
        <el-tag :type="isValid ? tagType : 'danger'" :size="tagSize">
          {{ displayText }}
        </el-tag>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="range-error">
        <i class="el-icon-warning" />
        {{ errorMessage }}
      </div>
    </div>
  </ProFormItem>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, PropType } from "@vue/composition-api";
import ProFormItem from "../ProFormItem.vue";

interface RangeOption {
  value: number;
  label: string;
}

export default defineComponent({
  name: "ProFormRange",
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
    // 范围值
    value: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    // 模式选择
    mode: {
      type: String as PropType<"input" | "slider" | "select">,
      default: "input",
    },
    // 数值范围
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    precision: {
      type: Number,
      default: 0,
    },
    // 显示配置
    disabled: {
      type: Boolean,
      default: false,
    },
    showValue: {
      type: Boolean,
      default: false,
    },
    showTooltip: {
      type: Boolean,
      default: true,
    },
    // 文本配置
    separator: {
      type: String,
      default: "至",
    },
    startPlaceholder: {
      type: String,
      default: "起始值",
    },
    endPlaceholder: {
      type: String,
      default: "结束值",
    },
    // 选择器选项（select 模式）
    options: {
      type: Array as PropType<RangeOption[]>,
      default: () => [],
    },
    // 样式配置
    size: {
      type: String,
      default: "small",
    },
    tagType: {
      type: String,
      default: "",
    },
    tagSize: {
      type: String,
      default: "small",
    },
    // 工具提示格式化
    formatTooltip: {
      type: Function as PropType<(val: number) => string>,
      default: undefined,
    },
  },
  emits: ["input", "change"],
  setup(props, { emit }) {
    // 内部值
    const rangeValue = computed({
      get: () => props.value || [],
      set: val => {
        emit("input", val);
        emit("change", val);
      },
    });

    // 起始值和结束值
    const startValue = ref<number>(props.value?.[0] ?? props.min);
    const endValue = ref<number>(props.value?.[1] ?? Math.max(props.min + 1, props.max));

    // 监听外部值变化
    watch(
      () => props.value,
      newVal => {
        if (newVal && newVal.length === 2) {
          startValue.value = newVal[0];
          endValue.value = newVal[1];
        } else if (newVal === undefined || newVal === null) {
          // 重置为默认值
          startValue.value = props.min;
          endValue.value = Math.max(props.min + 1, props.max);
        }
      },
      { immediate: true }
    );

    // 处理起始值变化
    const handleStartChange = () => {
      // 确保值在范围内
      startValue.value = Math.max(props.min, Math.min(props.max, startValue.value));

      // 如果起始值大于结束值，将结束值设为起始值
      if (startValue.value > endValue.value) {
        endValue.value = startValue.value;
      }

      rangeValue.value = [startValue.value, endValue.value];
    };

    // 处理结束值变化
    const handleEndChange = () => {
      // 确保值在范围内
      endValue.value = Math.max(props.min, Math.min(props.max, endValue.value));

      // 如果结束值小于起始值，将起始值设为结束值
      if (endValue.value < startValue.value) {
        startValue.value = endValue.value;
      }

      rangeValue.value = [startValue.value, endValue.value];
    };

    // 处理值变化（通用）
    const handleChange = () => {
      // 确保值在范围内
      startValue.value = Math.max(props.min, Math.min(props.max, startValue.value));
      endValue.value = Math.max(props.min, Math.min(props.max, endValue.value));

      rangeValue.value = [startValue.value, endValue.value];
    };

    // 显示文本
    const displayText = computed(() => {
      if (rangeValue.value && rangeValue.value.length === 2) {
        return `${rangeValue.value[0]}${props.separator}${rangeValue.value[1]}`;
      }
      return "";
    });

    // 验证区间有效性
    const validateRange = (value: number[]) => {
      if (!value || value.length !== 2) {
        return false;
      }
      return value[0] <= value[1];
    };

    // 当前值是否有效（起始值 <= 结束值）
    const isValid = computed(() => {
      if (!rangeValue.value || rangeValue.value.length !== 2) {
        return true; // 空值或无效值不显示错误
      }
      return rangeValue.value[0] <= rangeValue.value[1];
    });

    // 是否有错误（起始值 > 结束值）
    const hasError = computed(() => {
      if (!rangeValue.value || rangeValue.value.length !== 2) {
        return false;
      }
      return rangeValue.value[0] > rangeValue.value[1];
    });

    // 错误信息
    const errorMessage = computed(() => {
      if (hasError.value) {
        return "起始值不能大于结束值";
      }
      return "";
    });

    return {
      rangeValue,
      startValue,
      endValue,
      displayText,
      handleChange,
      handleStartChange,
      handleEndChange,
      validateRange,
      isValid,
      hasError,
      errorMessage,
    };
  },
});
</script>

<style lang="scss" scoped>
.pro-form-range {
  .range-inputs,
  .range-selects {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .range-separator {
    color: #606266;
    font-weight: 500;
    white-space: nowrap;
  }

  .range-slider {
    margin: 8px 0;
  }

  .range-display {
    margin-top: 8px;
    text-align: left;
  }

  .range-error {
    margin-top: 8px;
    color: #f56c6c;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;

    i {
      font-size: 14px;
    }
  }

  // 错误状态样式
  ::v-deep .is-error {
    .el-input__inner {
      border-color: #f56c6c !important;
      box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
    }

    &:hover .el-input__inner {
      border-color: #f56c6c !important;
    }

    &:focus .el-input__inner {
      border-color: #f56c6c !important;
      box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2) !important;
    }
  }
}
</style>
