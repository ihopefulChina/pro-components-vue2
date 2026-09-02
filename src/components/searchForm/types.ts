// Element UI 表单验证规则类型
export interface FormRule {
  required?: boolean;
  message?: string;
  trigger?: "blur" | "change" | "manual";
  min?: number;
  max?: number;
  len?: number;
  pattern?: RegExp;
  validator?: (rule: any, value: any, callback: (error?: Error) => void) => void;
  asyncValidator?: (rule: any, value: any, callback: (error?: Error) => void) => void;
}

// 搜索字段类型定义
export interface SearchField {
  prop: string;
  label: string;
  type: "input" | "textarea" | "select" | "date" | "daterange" | "number" | "image" | "link";
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  width?: string | number;
  maxlength?: number;
  showWordLimit?: boolean;
  dateType?: string;
  rangeSeparator?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  format?: string;
  valueFormat?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  controls?: boolean;
  options?: Array<{ label: string; value: any }>;
  // 字段属性（用于传递 Element UI 组件的属性）
  fieldProps?: Record<string, any>;
}

// 搜索表单配置
export interface SearchFormSchema {
  fields: SearchField[];
  rules?: Record<string, FormRule[]>;
  searchLoading?: boolean;
}

// 表单验证规则类型
export type FormRules = Record<string, FormRule[]>;
