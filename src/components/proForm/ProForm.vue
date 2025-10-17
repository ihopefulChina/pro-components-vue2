<template>
  <div class="pro-form-container">
    <el-form
      ref="formRef"
      class="pro-form"
      :class="{ 'readonly-form': readonly }"
      :model="formData"
      :rules="rules"
      :disabled="disabled"
      :label-position="labelPosition"
    >
      <el-row :gutter="8">
        <slot :form-data="formData" :is-detail="readonly"></slot>
      </el-row>
    </el-form>

    <div v-if="showFooter && !readonly" :class="['pro-form-footer', { 'in-drawer': inDrawer }]">
      <el-button @click="handleCancel">{{ cancelText }}</el-button>
      <el-button type="primary" :loading="isSubmitting" @click="triggerSubmit">
        {{ confirmText }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { useMessage } from "@/hooks/useMessage"
import { useState } from "@/hooks/useState"
import { defineComponent, provide, ref, watch } from "@vue/composition-api"
import { FormInstance } from "./type"

export default defineComponent({
  name: "ProForm",
  props: {
    /**  初始化表单数据 */
    initialValue: {
      type: Object,
      required: false
    },
    /** 表单验证规则 */
    rules: {
      type: Object,
      default: () => ({})
    },
    /** 标签位置 */
    labelPosition: {
      type: String,
      default: "top"
    },
    /** 是否只读 */
    readonly: {
      type: Boolean,
      default: false
    },
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false
    },
    /** 是否显示底部按钮 */
    showFooter: {
      type: Boolean,
      default: true
    },
    /** 取消按钮文本 */
    cancelText: {
      type: String,
      default: "取消"
    },
    /** 确定按钮文本 */
    confirmText: {
      type: String,
      default: "提交"
    },
    /** 是否在抽屉中（影响按钮定位） */
    inDrawer: {
      type: Boolean,
      default: false
    }
  },
  emits: ["submit", "reset", "cancel"],
  setup(props, { emit }) {
    /** 表单实例 */
    const formRef = ref<FormInstance>()

    /** 消息提示 */
    const message = useMessage()
    /** 表单数据 */
    const [formData, setFormData] = useState({ ...props.initialValue })
    /** 是否提交中 */
    const [isSubmitting, setIsSubmitting] = useState(false)
    /** 是否已经初始化过表单数据 */
    const [isInitialized, setIsInitialized] = useState(false)

    /** 监听表单数据变化 - 只在首次初始化时重置数据 */
    watch(
      () => props.initialValue,
      newValue => {
        if (newValue && !isInitialized.value) {
          setFormData({ ...newValue })
          setIsInitialized(true)
        }
      },
      { deep: true, immediate: true }
    )

    /** 提交表单 */
    const submit = async () => {
      try {
        setIsSubmitting(true)
        const valid = await new Promise<boolean>(resolve => {
          formRef.value?.validate((isValid: boolean, invalidFields: Object) => {
            if (Object.keys(invalidFields).length > 0) {
              //@ts-ignore
              message?.error(invalidFields[Object.keys(invalidFields)?.[0]]?.[0]?.message)
              return resolve(false)
            }

            resolve(isValid)
          })
        })

        if (valid) {
          // 确保传递最新的数据
          emit("submit", { ...formData.value })
          setFormData({ ...formData.value })
        }
      } catch (error) {
        console.error("提交失败:", error)
        throw error
      } finally {
        setIsSubmitting(false)
      }
    }

    // 重置表单
    const reset = () => {
      formRef.value?.resetFields()
      setFormData({})
      setIsInitialized(false)
      emit("reset")
    }

    // 验证表单
    const validate = () => {
      return new Promise<boolean>(resolve => {
        formRef.value?.validate((isValid: boolean) => {
          resolve(isValid)
        })
      })
    }

    // 设置字段值
    const setFieldsValue = (values: Record<string, any>) => {
      setFormData({ ...formData.value, ...values })
    }

    // 获取字段值
    const getFieldsValue = () => {
      return { ...formData.value }
    }

    // 取消操作
    const handleCancel = () => {
      emit("cancel")
      reset()
    }

    // 触发提交
    const triggerSubmit = () => {
      submit()
    }

    provide("proForm", {
      formRef,
      getFieldsValue
    })

    return {
      formRef,
      formData,
      isSubmitting,
      submit,
      reset,
      validate,
      setFieldsValue,
      getFieldsValue,
      handleCancel,
      triggerSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.pro-form-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  /** 不允许加一个相对定位 */
}
.pro-form {
  width: calc(100% - 20px);
  z-index: 1;
}

.pro-form-footer {
  z-index: 2;
  text-align: right;
  padding: 20px;
  border-top: 1px solid #e8e8e8;
  background: #fff;
  margin-top: 20px;

  &.in-drawer {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    margin-top: 0;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
}

.readonly-form {
  ::v-deep .el-input__inner,
  ::v-deep .el-range-input,
  ::v-deep .el-select__inner,
  ::v-deep .el-textarea__inner {
    border: none;
    background-color: transparent;
    color: #333;
    cursor: default;
    padding-left: 0;
  }

  /** 复选框 */
  ::v-deep .is-checked .el-checkbox__label {
    color: #333;
  }
  ::v-deep .el-checkbox__input.is-disabled.is-checked,
  ::v-deep .el-input__icon,
  ::v-deep .el-input-number__decrease,
  ::v-deep .el-input-number__increase {
    display: none;
  }
  ::v-deep .el-checkbox.is-disabled {
    &:not(.is-checked) {
      display: none;
    }
  }
}
</style>
