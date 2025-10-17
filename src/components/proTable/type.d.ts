// 操作按钮配置
export interface ActionButton {
  text: string
  type?: "primary" | "success" | "warning" | "danger" | "info" | "text"
  size?: "medium" | "small" | "mini"
  icon?: string
  disabled?: boolean | ((row: any) => boolean)
  show?: boolean | ((row: any) => boolean)
  onClick: (row: any) => void | Promise<void>
}

// 搜索表单配置
export interface SearchFormConfig {
  // 是否在搜索表单中显示
  hideInSearch?: boolean
  // 搜索表单项的占位符
  searchPlaceholder?: string
  // 搜索表单项的宽度
  searchWidth?: string | number
  // 搜索表单项的标签
  searchLabel?: string
  // 搜索表单项类型
  valueType?: "input" | "select" | "date" | "daterange" | "number" | "textarea"
  // 选择器选项
  valueEnum?: Array<{ label: string; value: any }> | Record<string, string | { label: string; value: any }>
  // 搜索表单项验证规则
  searchRules?: Array<{
    required?: boolean
    message?: string
    trigger?: "blur" | "change" | "manual"
    min?: number
    max?: number
    len?: number
    pattern?: RegExp
    validator?: (rule: any, value: any, callback: (error?: Error) => void) => void
  }>
  // 其他搜索表单项属性
  searchProps?: Record<string, any>
}

// 数据源配置（参考 Antd ProTable）
export interface DataSourceConfig<T = any> {
  // 数据源
  dataSource?: T[]
  // 数据请求函数
  request?: (params: any) => Promise<{ data: T[]; total: number; success: boolean }>
  // 请求参数
  params?: Record<string, any>
  // 是否立即请求
  manualRequest?: boolean
  // 请求成功回调
  onRequestSuccess?: (data: T[], total: number) => void
  // 请求失败回调
  onRequestError?: (error: any) => void
  // 数据转换函数
  dataTransform?: (data: any) => T[]
  // 分页配置
  pagination?: {
    current?: number
    pageSize?: number
    total?: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    showTotal?: (total: number, range: [number, number]) => string
  }
}

// 表格列配置（参考 ProTable 设计）
export interface ICommonTableColumn {
  prop: string
  label: string
  width?: string | number
  fixed?: "left" | "right"
  align?: "left" | "center" | "right"
  slotName?: string
  // 操作列配置
  type?: "actions"
  buttons?: ActionButton[]

  // 显示控制（参考 ProTable）
  hideInSearch?: boolean // 在搜索表单中隐藏
  hideInTable?: boolean // 在表格中隐藏

  // 搜索表单配置（参考 ProTable）
  searchPlaceholder?: string
  searchWidth?: string | number
  searchLabel?: string
  // 搜索表单项类型
  valueType?: "input" | "select" | "date" | "daterange" | "image" | "link"
  // 选择器选项（当 valueType 为 select 时）
  valueEnum?:
    | Array<{ label: string; value: any }>
    | Record<string | number, string | { label: string; value?: any; status?: "success" | "warning" | "danger" | "info" }>

  // 搜索表单项验证规则
  searchRules?: Array<{
    required?: boolean
    message?: string
    trigger?: "blur" | "change" | "manual"
    min?: number
    max?: number
    len?: number
    pattern?: RegExp
    validator?: (rule: any, value: any, callback: (error?: Error) => void) => void
  }>
  /**
   * 是否开启文本省略
   * 当为true时，文本会自动省略，当为数字时，文本会自动省略到指定行数
   */
  ellipsis?: boolean | number
  // 其他搜索表单项属性
  searchProps?: Record<string, any>
  // 字段属性（用于搜索表单）
  fieldProps?: Record<string, any>
  // 渲染函数
  render?: (text: any, record: any) => string | number | undefined
  // 图片相关配置
  imageStyle?: string
  onImageClick?: (imageUrl: string) => void
  // 图片列表配置
  maxImages?: number // 最大显示图片数量，默认3张
  lazy?: boolean // 是否懒加载，默认true
}
