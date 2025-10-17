import { Ref } from "@vue/composition-api"

export interface FormInstance {
  /** 重置表单 */
  resetFields: () => void
  /** 验证表单项 */
  validateField: (key: string | string[]) => void
  /** 验证表单 */
  validate: (callback: (isValid: boolean, invalidFields: Object) => void) => void
  /** 清除验证 */
  clearValidate: (key: string) => void
}

export interface ProFormProvide {
  formRef: Ref<FormInstance | undefined>
  getFieldsValue: () => Record<string, any>
}
