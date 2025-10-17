import { reactive } from "@vue/composition-api"
import { useState } from "./useState"

export interface DrawerFormProps<T> {
  /** 表单标题 */
  title: string
  /** 是否是查看详情 */
  isDetail: boolean
  /** 表单弹窗是否可见 */
  open: boolean
  /** 关闭弹窗 */
  onClose: () => void
  /** 刷新表格 */
  onRefresh?: () => void
  /** 详情 */
  detail?: T | undefined
  /** 设置详情 */
  setDetail?: (detail: T) => void
}

export interface UseDrawerFormProps<T> {
  /** DrawerForm 表单props */
  drawerFormProps: DrawerFormProps<T>
  /** 表单赋值编辑 */
  onEdit: (record?: T) => void
  /** 新增表单 */
  onAdd: () => void
  /** 查看详情 */
  onDetail: (record?: T) => void
  /** 复制表单 */
  onCopy: (record?: T) => void
}

export function useDrawerForm<T>({ drawerTitle = "", rowKey = "id" }: { drawerTitle?: string; rowKey?: string }): UseDrawerFormProps<T> {
  /** 表单弹窗是否可见 */
  const [open, setOpen] = useState(false)
  /** 表单标题 */
  const [title, setTitle] = useState("")
  /** 详情数据 */
  const [detail, setDetail] = useState<T | undefined>(undefined)
  /** 是否是查看详情 */
  const [isDetail, setIsDetail] = useState(false)

  /** 表单赋值编辑 */
  const onEdit = (record?: T) => {
    setDetail(record)
    setTitle(`编辑${drawerTitle}`)
    setIsDetail(false)
    setOpen(true)
  }

  /** 新增表单 */
  const onAdd = () => {
    setDetail(undefined)
    setTitle(`添加${drawerTitle}`)
    setIsDetail(false)
    setOpen(true)
  }

  /** 复制表单 */
  const onCopy = (record?: T) => {
    const newRecord = { ...record } as T & { [rowKey: string]: any }
    delete newRecord?.[rowKey]
    setDetail(newRecord)
    setTitle(`复制${drawerTitle}`)
    setIsDetail(false)
    setOpen(true)
  }

  /** 查看详情 */
  const onDetail = (record?: T) => {
    setDetail(record)
    setIsDetail(true)
    setTitle(`${drawerTitle}详情`)
    setOpen(true)
  }

  /** 关闭弹窗 */
  const onClose = () => {
    setOpen(false)
    // 延迟重置状态，避免动画冲突
    setTimeout(() => {
      setIsDetail(false)
      setDetail(undefined)
    }, 300)
  }

  /** DrawerForm 表单props */
  const drawerFormProps = reactive({
    isDetail,
    title,
    open,
    onClose,
    detail,
    setDetail
  }) as DrawerFormProps<T>

  return { onEdit, onAdd, onDetail, onCopy, drawerFormProps }
}
