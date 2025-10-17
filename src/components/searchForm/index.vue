<template>
  <el-form :inline="true" :model="formData" :rules="rules" class="form" ref="searchForm">
    <el-form-item v-for="field in fields" :key="field.prop" :label="field.label" :prop="field.prop">
      <!-- 输入框 -->
      <el-input
        v-if="field.type === 'input'"
        v-model="formData[field.prop]"
        :placeholder="field.placeholder"
        :clearable="field.clearable !== false"
        :maxlength="field.maxlength"
        :show-word-limit="field.showWordLimit !== undefined ? field.showWordLimit : field.maxlength ? true : false"
        :style="{ width: field.width || '200px' }"
        v-bind="field.fieldProps || {}"
      />

      <!-- 选择器 -->
      <el-select
        v-else-if="field.type === 'select'"
        v-model="formData[field.prop]"
        :placeholder="field.placeholder"
        :clearable="field.clearable !== false"
        :style="{ width: field.width || '200px' }"
        v-bind="field.fieldProps || {}"
      >
        <el-option v-for="option in field.options || []" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>

      <!-- 日期选择器 -->
      <el-date-picker
        v-else-if="field.type === 'date'"
        v-model="formData[field.prop]"
        :type="field.dateType || 'date'"
        :placeholder="field.placeholder"
        :clearable="field.clearable !== false"
        :format="field.format"
        :value-format="field.valueFormat"
        :style="{ width: field.width || '200px' }"
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
        :format="field.format"
        :value-format="field.valueFormat"
        :style="{ width: field.width || '240px' }"
        v-bind="field.fieldProps || {}"
      />

      <!-- 数字输入框 -->
      <el-input-number
        v-else-if="field.type === 'number'"
        v-model="formData[field.prop]"
        :placeholder="field.placeholder"
        :min="field.min"
        :max="field.max"
        :step="field.step || 1"
        :precision="field.precision"
        :controls="field.controls !== false"
        :style="{ width: field.width || '200px' }"
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
      <slot name="extra-buttons"></slot>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from "@vue/composition-api"
import { SearchField, FormRules } from "./types"

export default defineComponent({
  name: "SearchForm",
  props: {
    /** 搜索字段配置 */
    fields: {
      type: Array as PropType<SearchField[]>,
      required: true
    },
    /** 表单数据 */
    modelValue: {
      type: Object,
      default: () => ({})
    },
    /** 表单验证规则 */
    rules: {
      type: Object as PropType<FormRules>,
      default: () => ({})
    },
    /** 外部loading状态（可选，如果提供则使用外部状态） */
    loading: {
      type: Boolean,
      default: undefined
    }
  },
  emits: ["update:modelValue", "search", "reset"],
  setup(props, { emit }) {
    const searchForm = ref()
    const internalLoading = ref(false)

    // 表单数据
    const formData = ref({ ...props.modelValue })

    // 计算loading状态：优先使用外部loading，否则使用内部loading
    const searchLoading = computed(() => {
      return props.loading !== undefined ? props.loading : internalLoading.value
    })

    // 监听外部数据变化
    watch(
      () => props.modelValue,
      newVal => {
        formData.value = { ...newVal }
      },
      { deep: true }
    )

    // 监听内部数据变化，同步到外部
    watch(
      formData,
      newVal => {
        emit("update:modelValue", newVal)
      },
      { deep: true }
    )

    // 处理搜索
    const handleSearch = async () => {
      const isValid = await new Promise<boolean>(resolve => {
        searchForm.value?.validate((valid: boolean) => {
          resolve(valid)
        })
      })

      if (isValid) {
        // 如果使用内部loading状态
        if (props.loading === undefined) {
          internalLoading.value = true
        }

        try {
          await emit("search", formData.value)
        } finally {
          if (props.loading === undefined) {
            internalLoading.value = false
          }
        }
      }
    }

    // 处理重置
    const handleReset = () => {
      searchForm.value?.resetFields()
      emit("reset")
    }

    return {
      searchForm,
      formData,
      searchLoading,
      handleSearch,
      handleReset
    }
  }
})
</script>

<style lang="scss" scoped>
.form {
  .el-form-item {
    margin-right: 20px;
    margin-bottom: 15px;
  }
}
</style>
