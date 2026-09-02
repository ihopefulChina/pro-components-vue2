<template>
  <el-form ref="searchForm" inline :model="formData" :rules="rules" class="form">
    <el-form-item v-for="field in fields" :key="field.prop" :label="field.label" :prop="field.prop">
      <!-- 输入框 -->
      <el-input
        v-if="field.type === 'input' || field.type === 'link' || field.type === 'image'"
        v-model="formData[field.prop]"
        :placeholder="field.placeholder"
        :clearable="field.clearable !== false"
        :disabled="field.disabled"
        :maxlength="field.maxlength"
        :show-word-limit="
          field.showWordLimit !== undefined ? field.showWordLimit : field.maxlength ? true : false
        "
        :style="{ width: getFieldWidth(field.width, '200px') }"
        v-bind="field.fieldProps || {}"
      />

      <!-- 多行文本 -->
      <el-input
        v-else-if="field.type === 'textarea'"
        v-model="formData[field.prop]"
        type="textarea"
        :placeholder="field.placeholder"
        :disabled="field.disabled"
        :maxlength="field.maxlength"
        :show-word-limit="
          field.showWordLimit !== undefined ? field.showWordLimit : !!field.maxlength
        "
        :style="{ width: getFieldWidth(field.width, '240px') }"
        v-bind="field.fieldProps || {}"
      />

      <!-- 选择器 -->
      <el-select
        v-else-if="field.type === 'select'"
        v-model="formData[field.prop]"
        :placeholder="field.placeholder"
        :clearable="field.clearable !== false"
        :disabled="field.disabled"
        :style="{ width: getFieldWidth(field.width, '200px') }"
        v-bind="field.fieldProps || {}"
      >
        <el-option
          v-for="option in field.options || []"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <!-- 日期选择器 -->
      <el-date-picker
        v-else-if="field.type === 'date'"
        v-model="formData[field.prop]"
        :type="field.dateType || 'date'"
        :placeholder="field.placeholder"
        :clearable="field.clearable !== false"
        :disabled="field.disabled"
        :format="field.format"
        :value-format="field.valueFormat"
        :style="{ width: getFieldWidth(field.width, '200px') }"
        v-bind="field.fieldProps || {}"
      />

      <!-- 日期范围选择器 -->
      <el-date-picker
        v-else-if="field.type === 'daterange'"
        v-model="formData[field.prop]"
        :type="field.dateType || 'daterange'"
        :range-separator="field.rangeSeparator || '至'"
        :start-placeholder="field.startPlaceholder || '开始日期'"
        :end-placeholder="field.endPlaceholder || '结束日期'"
        :clearable="field.clearable !== false"
        :disabled="field.disabled"
        :format="field.format"
        :value-format="field.valueFormat"
        :style="{ width: getFieldWidth(field.width, '240px') }"
        v-bind="field.fieldProps || {}"
      />

      <!-- 数字输入框 -->
      <el-input-number
        v-else-if="field.type === 'number'"
        v-model="formData[field.prop]"
        :placeholder="field.placeholder"
        :disabled="field.disabled"
        :min="field.min"
        :max="field.max"
        :step="field.step || 1"
        :precision="field.precision"
        :controls="field.controls !== false"
        :style="{ width: getFieldWidth(field.width, '200px') }"
        v-bind="field.fieldProps || {}"
      />
    </el-form-item>

    <!-- 操作按钮 -->
    <el-form-item v-if="fields && fields.length > 0">
      <el-button @click="handleReset">
        <i class="el-icon-refresh-right" />
        重置
      </el-button>
      <el-button type="primary" :loading="searchLoading" @click="handleSearch">
        <i class="el-icon-search" />
        搜索
      </el-button>
    </el-form-item>

    <!-- 额外按钮区域 -->
    <el-form-item v-if="$slots['extra-buttons']">
      <slot name="extra-buttons" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from "@vue/composition-api";
import type { FormRules, SearchField } from "./types";

type SearchFormValue = Record<string, unknown>;

export default defineComponent({
  name: "SearchForm",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    /** 搜索字段配置 */
    fields: {
      type: Array as PropType<SearchField[]>,
      required: true,
    },
    /** Vue 2 v-model 表单数据 */
    value: {
      type: Object as PropType<SearchFormValue>,
      default: undefined,
    },
    /** 兼容显式的 model-value 绑定 */
    modelValue: {
      type: Object as PropType<SearchFormValue>,
      default: undefined,
    },
    /** 表单验证规则 */
    rules: {
      type: Object as PropType<FormRules>,
      default: () => ({}),
    },
    /** 外部loading状态（可选，如果提供则使用外部状态） */
    loading: {
      type: Boolean,
      default: undefined,
    },
    /** 可等待的搜索函数；未传 loading 时用于提供真实的异步反馈 */
    searchHandler: {
      type: Function as PropType<(values: SearchFormValue) => void | Promise<void>>,
      default: undefined,
    },
  },
  emits: ["input", "update:modelValue", "search", "reset"],
  setup(props, { emit }) {
    const searchForm = ref();
    const internalLoading = ref(false);

    // 表单数据
    const getExternalValue = () => props.value ?? props.modelValue ?? {};
    const formData = ref<SearchFormValue>({ ...getExternalValue() });

    const isSameValue = (left: SearchFormValue, right: SearchFormValue) => {
      try {
        return JSON.stringify(left) === JSON.stringify(right);
      } catch {
        return left === right;
      }
    };

    // 计算loading状态：优先使用外部loading，否则使用内部loading
    const searchLoading = computed(() => {
      return props.loading !== undefined ? props.loading : internalLoading.value;
    });

    // 监听外部数据变化
    watch(
      getExternalValue,
      newVal => {
        if (!isSameValue(formData.value, newVal)) {
          formData.value = { ...newVal };
        }
      },
      { deep: true }
    );

    // 监听内部数据变化，同步到外部
    watch(
      formData,
      newVal => {
        const value = { ...newVal };
        emit("input", value);
        emit("update:modelValue", value);
      },
      { deep: true }
    );

    // 处理搜索
    const handleSearch = async () => {
      const isValid = await new Promise<boolean>(resolve => {
        searchForm.value?.validate((valid: boolean) => {
          resolve(valid);
        });
      });

      if (isValid) {
        // 如果使用内部loading状态
        if (props.loading === undefined) {
          internalLoading.value = true;
        }

        try {
          const value = { ...formData.value };
          await props.searchHandler?.(value);
          emit("search", value);
        } finally {
          if (props.loading === undefined) {
            internalLoading.value = false;
          }
        }
      }
    };

    // 处理重置
    const handleReset = () => {
      searchForm.value?.resetFields();
      emit("reset", { ...formData.value });
    };

    const getFieldWidth = (width: string | number | undefined, fallback: string) => {
      if (typeof width === "number") return `${width}px`;
      return width || fallback;
    };

    return {
      searchForm,
      formData,
      searchLoading,
      getFieldWidth,
      handleSearch,
      handleReset,
    };
  },
});
</script>

<style lang="scss" scoped>
.form {
  .el-form-item {
    margin-right: 20px;
    margin-bottom: 15px;
  }
}
</style>
