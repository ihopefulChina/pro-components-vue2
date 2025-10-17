import { useGlobalThis } from "./useGlobalThis"

export interface DialogConfig {
  /** 标题 */
  title?: string
  /** 内容 */
  content?: string
  /** 确认按钮文字 */
  okText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 对话框类型 */
  type?: "success" | "warning" | "info" | "error"
  /** 确认回调 */
  onOk?: () => void | Promise<void>
  /** 取消回调 */
  onCancel?: () => void
  /** 是否显示取消按钮 */
  showCancelButton?: boolean
  /** 是否显示确认按钮 */
  showConfirmButton?: boolean
  /** 是否可通过点击遮罩层关闭 */
  closeOnClickModal?: boolean
  /** 是否可通过按 ESC 键关闭 */
  closeOnPressEscape?: boolean
  /** 自定义类名 */
  customClass?: string
  /** 是否将 content 属性作为 HTML 片段处理 */
  dangerouslyUseHTMLString?: boolean
}

export interface DialogInstance {
  /** 确认对话框 */
  confirm: (config: DialogConfig) => Promise<boolean>
  /** 警告对话框 */
  warning: (config?: Omit<DialogConfig, "type">) => Promise<boolean>
  /** 信息对话框 */
  info: (config?: Omit<DialogConfig, "type">) => Promise<boolean>
  /** 成功对话框 */
  success: (config?: Omit<DialogConfig, "type">) => Promise<boolean>
  /** 错误对话框 */
  error: (config?: Omit<DialogConfig, "type">) => Promise<boolean>
}

/**
 * 优雅的对话框 Hook，参考 Antd 设计
 * 替代 proxy.$confirm 的使用方式
 */
export function useDialog(): DialogInstance {
  const proxy = useGlobalThis() as any

  const confirm = async (config: DialogConfig): Promise<boolean> => {
    try {
      await proxy.$confirm(config.content || "", config.title || "提示", {
        confirmButtonText: config.okText || "确定",
        cancelButtonText: config.cancelText || "取消",
        type: config.type || "warning",
        showCancelButton: config.showCancelButton !== false,
        showConfirmButton: config.showConfirmButton !== false,
        closeOnClickModal: config.closeOnClickModal !== false,
        closeOnPressEscape: config.closeOnPressEscape !== false,
        customClass: config.customClass,
        dangerouslyUseHTMLString: config.dangerouslyUseHTMLString
      })

      // 执行确认回调
      if (config.onOk) {
        try {
          await config.onOk()
        } catch (error) {
          // 内部自动处理错误，销毁所有对话框
          proxy.$message.closeAll()
          throw error
        }
      }

      return true
    } catch {
      // 执行取消回调
      if (config.onCancel) {
        config.onCancel()
      }
      return false
    }
  }

  const warning = (config?: Omit<DialogConfig, "type">): Promise<boolean> => {
    return confirm({
      title: "警告",
      type: "warning",
      ...config
    })
  }

  const info = (config?: Omit<DialogConfig, "type">): Promise<boolean> => {
    return confirm({
      title: "提示",
      type: "info",
      ...config
    })
  }

  const success = (config?: Omit<DialogConfig, "type">): Promise<boolean> => {
    return confirm({
      title: "成功",
      type: "success",
      ...config
    })
  }

  const error = (config?: Omit<DialogConfig, "type">): Promise<boolean> => {
    return confirm({
      title: "错误",
      type: "error",
      ...config
    })
  }

  return {
    confirm,
    warning,
    info,
    success,
    error
  }
}
