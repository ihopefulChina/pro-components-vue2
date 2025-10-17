// ProForm 字段类型
export type ProFormFieldType =
  | "text"
  | "password"
  | "textarea"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "daterange"
  | "datetime"
  | "datetimerange"
  | "switch"
  | "upload"
  | "image"
  | "custom"

// 表单项配置
export interface ProFormFieldProps {
  /** 字段名 */
  name: string
  /** 标签 */
  label: string
  /** 字段类型 */
  type?: ProFormFieldType
  /** 占位符 */
  placeholder?: string
  /** 是否必填 */
  required?: boolean
  /** 验证规则 */
  rules?: any[]
  /** 字段宽度 */
  width?: string | number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否隐藏 */
  hidden?: boolean
  /** 自定义渲染 */
  render?: (formData: any, isDetail: boolean) => any
  /** 字段属性 */
  fieldProps?: Record<string, any>
  /** 选择器选项 */
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  /** 枚举值 */
  valueEnum?: Record<string | number, string | { label: string; value: any }>
  /** 依赖字段 */
  dependencies?: string[]
  /** 依赖字段变化时的处理 */
  onDependencyChange?: (value: any, formData: any) => void
}

// ProForm 配置
export interface ProFormConfig {
  /** 表单数据 */
  modelValue: Record<string, any>
  /** 验证规则 */
  rules?: Record<string, any[]>
  /** 标签宽度 */
  labelWidth?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 字段配置 */
  fields: ProFormFieldProps[]
  /** 提交函数 */
  onSubmit?: (values: any) => Promise<void> | void
  /** 重置函数 */
  onReset?: () => void
  /** 字段值变化 */
  onValuesChange?: (changedValues: any, allValues: any) => void
}
