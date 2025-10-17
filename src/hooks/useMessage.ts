import { useGlobalThis } from "./useGlobalThis"

export interface MessageConfig {
  /** 通知标题 */
  title?: string
  /** 通知内容 */
  message: string
  /** 通知类型 */
  type?: "success" | "warning" | "info" | "error"
  /** 显示时长，0 为不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 自定义类名 */
  customClass?: string
  /** 是否将 message 属性作为 HTML 片段处理 */
  dangerouslyUseHTMLString?: boolean
}

export interface MessageInstance {
  /** 成功通知 */
  success: (message: string, config?: Omit<MessageConfig, "type" | "message">) => void
  /** 错误通知 */
  error: (message: string, config?: Omit<MessageConfig, "type" | "message">) => void
  /** 警告通知 */
  warning: (message: string, config?: Omit<MessageConfig, "type" | "message">) => void
  /** 信息通知 */
  info: (message: string, config?: Omit<MessageConfig, "type" | "message">) => void
  /** 关闭所有通知 */
  closeAll: () => void
}

/**
 * 优雅的消息 Hook，参考 Antd 设计
 * 替代 proxy.$message 的使用方式
 */
export function useMessage(): MessageInstance {
  const proxy = useGlobalThis() as any

  const success = (message: string, config?: Omit<MessageConfig, "type" | "message">) => {
    proxy.$message.success(message, config)
  }

  const error = (message: string, config?: Omit<MessageConfig, "type" | "message">) => {
    proxy.$message.error(message, config)
  }

  const warning = (message: string, config?: Omit<MessageConfig, "type" | "message">) => {
    proxy.$message.warning(message, config)
  }

  const info = (message: string, config?: Omit<MessageConfig, "type" | "message">) => {
    proxy.$message.info(message, config)
  }

  const closeAll = () => {
    proxy.$message.closeAll()
  }

  return {
    success,
    error,
    warning,
    info,
    closeAll
  }
}
